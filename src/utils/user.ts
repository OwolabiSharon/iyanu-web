import { AppDataSource } from "@database/data-source";

import { User } from "@database/entity/User";
import { compareHashedString, generateRandomHexCode, generateRandomNumberCode, hashString } from "./auth";
import { IUtilDto } from "./responses";
import dayjs from "dayjs";
import { sendMail } from "./email";
import {
  getResetPasswordCodeEmail,
  getVerificationCodeEmail,
  getUserKycApprovalTemplate,
  getUserKycDenialTemplate,
  getWelcomeEmailTemplate,
  getInviteTemplate
} from "./emailTemplates";

import { ResetPasswordCode } from "@database/entity/ResetPasswordCode";
import { VerificationCode, VerificationCodePurpose } from "@database/entity/VerificationCode";

const userRepository = AppDataSource.getRepository(User);
const verificationCodeRepository = AppDataSource.getRepository(VerificationCode);
const resetPasswordCodeRepository = AppDataSource.getRepository(ResetPasswordCode);

export const getUserById = async (id: number): Promise<User | null> => {
  return await userRepository
    .createQueryBuilder("user")
    .where(`"id" = :id`, { id })
    .getOne();
};
 
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository
    .createQueryBuilder("user")
    .where(`"email" ILIKE :email`, { email })
    .getOne();
};

export const getUserByPhone = async (phone: string): Promise<User | null> => {
  return await userRepository.createQueryBuilder().where(`"phone" = :phone`, { phone }).getOne();
};

export const signInUser = async (userId: number) => {
  return await userRepository.update(
    { id: userId },
    {
      last_login: new Date(),
    },
  );
};

export const updatePassword = async (user: User, newPassword: string) => {
  const hashedPassword = await hashString(newPassword);
  user!.password = hashedPassword;
  await user?.save();
};


export const extractGeminiText = (response: any): string  => {
  return response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export const extractGeminiJSON = (response: any)  => {
  const text = extractGeminiText(response)
  const cleaned = text.replace(/[\n\t\r\b\f\\]/g, "");
  const parsed = JSON.parse(cleaned);
  
  return parsed
}


export const saveVerificationCode = async (user: User, purpose: VerificationCodePurpose) => {
  let verificationCode = await verificationCodeRepository.findOneBy({
    user: { id: user.id },
    purpose,
  });
  if (verificationCode)
    await verificationCodeRepository.delete({
      user: { id: user.id },
      purpose,
    });

  const codeLength = purpose === "email" ? 4 : 6;
  const code = generateRandomNumberCode(codeLength);
  const hashedCode = await hashString(code);

  verificationCode = new VerificationCode();
  verificationCode.code = hashedCode;
  verificationCode.user = user;
  verificationCode.purpose = purpose;
  await verificationCode.save();

  return code;
};

export const saveAndSendEmailVerificationCode = async (user: User) => {
  const code = await saveVerificationCode(user, "email");
  // send code here
  sendMail([user.email], "Account verification", getVerificationCodeEmail(user.first_name, user.email, code));
  return code;
};

// export const saveAndSendPhoneVerificationCode = async (user: User, phone: string) => {
//   const code = await saveVerificationCode(user, "phone");

//   sendSMS(code, phone)

//   user.phone = phone; 
//   await user.save();
//   // send code here
//   return code;
// };

export const verifyUser = async (user: User, code: string, purpose: VerificationCodePurpose, phone?: string): Promise<IUtilDto> => {

  const verificationCode = await verificationCodeRepository
    .createQueryBuilder("verification_code")
    .where("verification_code.user_id = :userId", { userId: user.id })
    .andWhere("verification_code.purpose = :purpose", { purpose })
    .andWhere("verification_code.created_at  >= NOW() - INTERVAL '1 HOUR'")
    .orderBy("verification_code.created_at", "DESC")
    .getOne();

  if (!verificationCode) return { isSuccess: false, message: "Verification code is either incorrect or expired" };
  const isMatch = await compareHashedString(code, verificationCode?.code);
  let message = isMatch ? `${purpose} verified` : `${purpose} not verified`;
  if (isMatch) {
    if (purpose === "email") {
      user.is_email_verified = true;
    }
    // } else if (purpose === "phone") {
    //   user.is_phone_verified = true;
    //   if (phone) {
    //     user.phone = phone; 
    //   }
    // }

    await user.save();

    await verificationCodeRepository.delete({
      user: { id: user.id },
      purpose: "email",
    });
  }

  return { isSuccess: isMatch, message };
};

export type Channel = "email" | "phone";

export const saveResetPasswordCode = async (user: User) => {
  let resetPassword = await resetPasswordCodeRepository.findOneBy({
    user: { id: user.id },
  });
  if (resetPassword)
    await resetPasswordCodeRepository.delete({
      user: { id: user.id },
    });

  const code = generateRandomNumberCode();
  const hashedCode = await hashString(code);

  resetPassword = new ResetPasswordCode();
  resetPassword.code = hashedCode;
  resetPassword.user = user;
  await resetPassword.save();

  return code;
};



export const saveAndSendResetPasswordCode = async (user: User, channel: Channel) => {
  const code = await saveResetPasswordCode(user);

  // send code here
  if (channel == "email") sendMail([user.email], "Password reset", getResetPasswordCodeEmail(user.first_name, code));
  return code;
};

export const resetUserPassword = async (user: User, code: string, new_password: string): Promise<IUtilDto> => {
  const resetPasswordCode = await resetPasswordCodeRepository.findOneBy({
    user: { id: user.id },
  });
  if (!resetPasswordCode) return { isSuccess: false, message: "incorrect reset credentials" };
  const timeDiff = dayjs().diff(dayjs(resetPasswordCode.created_at), "minutes");
  if (timeDiff > 120) {
    await resetPasswordCodeRepository.delete({
      user: { id: user.id },
    });
    return { isSuccess: false, message: "expired reset credentials" };
  }

  const isMatch = await compareHashedString(code, resetPasswordCode?.code);
  if (!isMatch) return { isSuccess: false, message: "incorrect verification credentials" };
  await resetPasswordCodeRepository.delete({
    user: { id: user.id },
  });
  const hashedPassword = await hashString(new_password);
  user.password = hashedPassword;

  await user.save();
  return { isSuccess: isMatch, message: `password reset` };
};





