import { Response } from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import { User } from "../../models/userModel";
import { ReqUser } from "../../interfaces/reqUser";
import { IUser } from "../../interfaces/user";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const editEmail: any = async function (req: ReqUser, res: Response) {
  try {
    const { oldEmail, newEmail, password } = req.body;

    //Checking password length
    if (password.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        401
      );
    }

    //Checking email format
    if (!validator.isEmail(newEmail)) {
      return errorResponse("Invalid new email address", res, 401);
    }

    //Getting user
    const user: IUser | null = await User.findOne({ email: oldEmail })
      .select(`+active +password -updatedAt -__v`)
      .populate({
        path: `ads`,
        options: { sort: { createdAt: -1 } },
        select: {
          updatedAt: 0,
          __v: 0,
        },
      });

    //Checking does user exist, is user active and is password correct
    if (!user || !user.active) {
      return errorResponse(
        "This user is deactivated or does not exist.",
        res,
        401
      );
    }

    //Checking is password correct
    if (!(await bcrypt.compare(password, user.password))) {
      return errorResponse("Password is incorrect.", res, 401);
    }

    //Checking if the user has permission to change the password
    if (user.id !== req.user.id) {
      return errorResponse(
        "You don't have permission for this operation.",
        res,
        401
      );
    }

    //Adding new email
    user.email = newEmail;

    //Saving new email
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      message: "Email succesfully changed!",
      user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
