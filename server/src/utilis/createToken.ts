import jwt from "jsonwebtoken";

//Dotenv
import dotenv from "dotenv";
dotenv.config();

export const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.JWT_PRIVATE_KEY!, {
    expiresIn: process.env.JWT_PRIVATE_KEY_EXPIRES!,
  });
};
