import { Response } from "express";
import Joi from "joi";

interface ResponseArgs {
  title: string;
  code?: number;
  message?: string | Error;
  data?: any;
  fileDir?: any;
  fileName?: any;
}

export interface IResponseWrapper {
  SuccessResponse(args: ResponseArgs): Response;
  FileResponse(args: ResponseArgs): any;
  ErrorResponse(args: ResponseArgs): Response;
}

export interface ISuccessResponseDto extends ResponseArgs {
  hasError: boolean;
}

export interface IErrorResponseDto {
  hasError: boolean;
  errors: ResponseArgs;
}

export interface IResponseError extends Error {
  status?: number;
}

export interface IUtilDto {
  isSuccess: boolean;
  message: string;
  data?: any;
  [key: string]: any;
}

export class ResponseWrapper implements IResponseWrapper {
  readonly res: Response;
  constructor(res: Response) {
    this.res = res;
  }

  SuccessResponse(args: ResponseArgs) {
    const { title, message, data, code } = args;
    if (process.env.LOG_ENDPOINT_RESPONSES) console.log("message :>> ", message);
    return this.res.status(200).json({
      hasError: false,
      title,
      code,
      message,
      data,
    });
  }

  FileResponse(args: ResponseArgs) {
    const { message, fileDir, fileName } = args;
    if (process.env.LOG_ENDPOINT_RESPONSES) console.log("message :>> ", message);
    return this.res.sendFile(fileDir, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/zip",
      },
      lastModified: false,
      etag: false,
    });
  }

  ErrorResponse(args: ResponseArgs) {
    const { title, code, data } = args;
    let { message } = args;
    //Sentry.captureException(message)
    if (process.env.LOG_ENDPOINT_RESPONSES) console.log("message :>> ", message);
    if (Joi.isError(message)) {
      message = message.details.map((detail) => detail.message).join(", ");
    }
    return this.res.status(200).json({
      hasError: true,
      errors: {
        title,
        code,
        message: message?.toString(),
        data
      },
    });
  }
}
