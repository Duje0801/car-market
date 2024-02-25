import { Request, Response } from "express";
import validator = require("validator");
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { IUser } from "../../interfaces/user";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const resetPassword: any = async function (req: Request, res: Response) {
  try {
    const { email, token, password, confirmPassword } = req.body;

    //Checking email
    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email address", res, 401);
    }

    //Checking password
    if (password !== confirmPassword)
      return errorResponse("Passwords must be identical", res, 401);

    if (password.length < 9 || confirmPassword.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        401
      );
    }

    //Geting user
    const user: IUser = await User.findOne({ email }).select(
      `+active +restartPasswordCode +restartPasswordCodeExpire`
    );

    //Checking does user exist and if user is active
    if (!user || !user.active)
      return errorResponse(
        "The user with that email is deactivated or does not exist",
        res,
        401
      );

    //Checking is new password strong enough
    async function checkPasswordValidation() {
      return !validator.isStrongPassword(password) ? false : true;
    }

    const checkPassValidation = await checkPasswordValidation();

    if (!checkPassValidation) {
      return errorResponse(
        `New password must be longer than 8 characters and must contain at least one: uppercase letter, 
         lowercase letter, digit and special character.`,
        res,
        401
      );
    }

    //Checking token
    if (
      token.length !== 6 ||
      !(await bcrypt.compare(token, user.restartPasswordCode!))
    )
      return errorResponse("Invalid token code", res, 401);

    if (Date.now() > user.restartPasswordCodeExpire!.getTime())
      return errorResponse(
        "Token expired, go to forgot password form again",
        res,
        401
      );

    //Removing restart password data and saving new password
    user.restartPasswordCode = undefined;
    user.restartPasswordCodeExpire = undefined;
    user.password = await bcrypt.hash(password, 14);

    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      message: "Password succesfully changed!",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
