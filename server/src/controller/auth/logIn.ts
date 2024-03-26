import { Request, Response } from "express";
import validator = require("validator");
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { createToken } from "../../utilis/createToken";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { IUser } from "../../interfaces/user";

export const logIn: any = async function (req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    //Checking email
    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email address format", res, 400);
    }

    //Checking password
    if (password.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        400
      );
    }

    //Getting user profile
    const user: IUser = await User.findOne({ email }).select(
      "+active +password -__v"
    );

    if (
      !user ||
      !("password" in user) ||
      !(await bcrypt.compare(password, user.password))
    )
      return errorResponse("Your email or password is incorrect", res, 401);

    if (!user.active) return errorResponse("The user is deactivated", res, 401);

    //Creating token
    const token = createToken(user._id);

    res.status(200).json({
      status: `success`,
      data: { username: user.username, email: user.email, token },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
