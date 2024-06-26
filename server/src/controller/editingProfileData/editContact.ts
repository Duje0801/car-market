import { Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { ReqUser } from "../../interfaces/reqUser";
import { IUser } from "../../interfaces/user";

export const editContact: any = async function (req: ReqUser, res: Response) {
  try {
    const { email, newContact, password } = req.body;

    //Checking contact length
    if (newContact.length > 30) {
      return errorResponse(
        "The new contact is too long, the maximum number of characters allowed is 30.",
        res,
        400
      );
    }

    //Checking password length
    if (password.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        400
      );
    }

    //Getting user
    const user: IUser | null = await User.findOne({ email })
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

    //Checking if the user has permission to change the password
    if (user.id !== req.user.id) {
      return errorResponse(
        "You don't have permission for this operation.",
        res,
        401
      );
    }

    //Checking is password correct
    if (!(await bcrypt.compare(password, user.password))) {
      return errorResponse("Password is incorrect.", res, 400);
    }

    //Adding new contact
    user.contact = newContact;

    //Saving new contact
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      message: "Contact succesfully changed!",
      user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
