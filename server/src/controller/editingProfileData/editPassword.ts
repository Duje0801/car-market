import { Response } from "express";
import validator = require("validator");
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { ReqUser } from "../../interfaces/reqUser";
import { IUser } from "../../interfaces/user";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const editPassword: any = async function (req: ReqUser, res: Response) {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    //Checking email
    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email address format", res, 400);
    }

    //Checking password
    if (
      oldPassword.length < 9 ||
      newPassword.length < 9 ||
      confirmNewPassword.length < 9
    ) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        400
      );
    }

    if (newPassword !== confirmNewPassword) {
      return errorResponse("New passwords must be identical", res, 400);
    }

    //Checking is new password strong enough
    async function checkPasswordValidation() {
      return !validator.isStrongPassword(newPassword) ? false : true;
    }

    const checkPassValidation = await checkPasswordValidation();

    if (!checkPassValidation) {
      return errorResponse(
        `New password must be longer than 8 characters and must contain at least one: uppercase letter, 
             lowercase letter, digit and special character.`,
        res,
        400
      );
    }

    //Getting user
    const user: IUser = await User.findOne({ email }).select(
      `+active +password -__v`
    );

    //Checking does user exist and is user active
    if (!user || !user.active) {
      return errorResponse(
        "The user with that email is deactivated or does not exist.",
        res,
        401
      );
    }

    //Checking if the user has permission to change the password
    if (user.id !== req.user.id) {
      return errorResponse(
        "You don't have permission for this operation.",
        res,
        401
      );
    }

    //Checking is old password correct
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return errorResponse("Old password is incorrect.", res, 401);
    }

    //Removing restart password data and saving new password
    user.password = await bcrypt.hash(newPassword, 14);

    //Saving new password
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      message: "Password succesfully changed!",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
