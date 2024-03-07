import { Request, Response } from "express";
import validator = require("validator");
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { IUser } from "../../interfaces/user";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { sendEmail } from "../../utilis/sendEmail";

export const forgotPassword: any = async function (
  req: Request,
  res: Response
) {
  try {
    const { email } = req.body;

    //Checking email
    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email address format", res, 401);
    }

    //Getting user profile
    const user: IUser = await User.findOne({ email }).select("+active -__v");

    if (!user || !user.active)
      return errorResponse(
        "The user with that email is deactivated or does not exist",
        res,
        401
      );

    //Generates code (restart password token)
    const code: string = String(
      Math.floor(Math.random() * (1000000 - 100001) + 100001)
    );

    //Hashing code (for MongoDB)
    const hashedCode: string = await bcrypt.hash(code, 14);

    //Adding code and expiraton time to Mongo document
    user.restartPasswordCode = hashedCode;
    user.restartPasswordCodeExpire = new Date(Date.now() + 900000);

    //Saving changes to user document
    await user.save({ validateBeforeSave: true });

    const message = `<div>The restart token is: <b>${code}</b>.</div>
      <div>This code is valid for 15 minutes only.</div>
      <div>If you have not requested a password reset, please ignore this email.</div>`;

    //Sending mail
    await sendEmail(message, email);

    res.status(200).json({
      status: `success`,
      message: `Forgot password email sent`,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
