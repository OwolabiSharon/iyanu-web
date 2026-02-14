import { User } from "@database/entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const { SALT_ROUNDS, JWT_SECRET } = process.env;
export const hashString = async (plainString: string) => {
  return await bcrypt.hash(plainString, parseInt(SALT_ROUNDS as string));
};

export const compareHashedString = async (plainString: string, hashedString: string): Promise<boolean> => {
  return await bcrypt.compare(plainString, hashedString);
};

export const generateUserJWT = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      last_login: user.last_login,
    },
    JWT_SECRET as string,
    { expiresIn: "45d" },
  );
};

export const generateRandomHexCode = (size: number) => {
  return crypto.randomBytes(size).toString("hex");
};

export const generateRandomNumberCode = (length = 4) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1; 
  const code = crypto.randomInt(min, max + 1);
  return code.toString().padStart(length, "0");
};

//export const passwordRegexPattern = /\w{8,20}/;
export const passwordRegexPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#._])[A-Za-zd$@$!%*?&.]{8,20}/;

export interface IDecodedAppleToken extends jwt.JwtPayload {
  email?: string;
} 

const algorithm = "aes-256-cbc";
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export const encrypt = async (text: string): Promise<string> => {
  const iv = crypto.randomBytes(16); // new IV each time
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const decrypt = async (encryptedText: string): Promise<string | undefined> => {
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
  }
};
  

