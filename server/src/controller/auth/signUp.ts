import { Request, Response } from "express";
import validator = require("validator");
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { IUser } from "../../interfaces/user";

export const signUp: any = async function (req: Request, res: Response) {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      contact,
      userType,
      location,
      country,
    } = req.body;

    //Checking email
    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email address format", res, 400);
    }

    if (password.length < 9 || confirmPassword.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        400
      );
    }

    //Checking password
    if (password !== confirmPassword)
      return errorResponse("Passwords must be identical", res, 400);

    async function checkPasswordValidation() {
      return !validator.isStrongPassword(password) ? false : true;
    }

    const checkPassValidation = await checkPasswordValidation();

    if (!checkPassValidation) {
      return errorResponse(
        `Password must be longer than 8 characters and must contain at least one: uppercase letter, 
         lowercase letter, digit and special character.`,
        res,
        400
      );
    }

    //Hashing password
    const hashedPassword = await bcrypt.hash(password, 14);

    //Creating new user in MongoDB
    const newUser: IUser | null = await User.create({
      username,
      email,
      password: hashedPassword,
      contact,
      userType,
      avatar: {
        avatarURL: "",
        uploadedAvatar: {
          imageUrl: "",
          publicID: "",
        },
      },
      location,
      country,
    });

    if (!newUser) return errorResponse("Can't create new user", res, 404);

    res.status(201).json({
      status: `success`,
      message: `Profile has been succesfully created!`,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
