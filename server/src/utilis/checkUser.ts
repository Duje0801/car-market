import { Request } from "express";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";

//Dotenv
import dotenv from "dotenv";
dotenv.config();

//This function gets the profile of the user who requested to view the ad.
//If the user is not logged in, the function will return null

export const checkUser = async (req: Request) => {
  let user: any;
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.split(" ")[1];
    if (!token) return null;
    const decoded: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    );
    if (typeof decoded !== `string`) {
      user = await User.findById(decoded._id).select(
        "+active +role -updatedAt -__v"
      );
      return user;
    }
    return null;
  }
};
