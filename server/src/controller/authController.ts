import { Request, Response } from "express";
import validator = require("validator");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { IUser } from "../interfaces/user";
import { errorResponse } from "../utilis/errorHandling/errorResponse";
import { errorHandler } from "../utilis/errorHandling/errorHandler";

//Dotenv
import dotenv from "dotenv";
dotenv.config();

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.JWT_PRIVATE_KEY!, {
    expiresIn: process.env.JWT_PRIVATE_KEY_EXPIRES!,
  });
};

const signUp: any = async function (req: Request, res: Response) {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      contact,
      userType,
      avatarURL,
      uploadedAvatarURL,
      uploadedPublicID,
    } = req.body;

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
        avatarURL,
        uploadedAvatar: {
          imageUrl: uploadedAvatarURL,
          publicID: uploadedPublicID,
        },
      },
    });

    if (!newUser) return errorResponse("Can't create new user", res, 401);

    //Creating token
    const token = createToken(newUser._id);

    res.status(201).json({
      status: `success`,
      data: {
        username,
        email,
        token,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

const logIn: any = async function (req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    //Checking email
    if (!validator.isEmail(email)) {
      return errorResponse("Invalid email address", res, 401);
    }

    //Checking password
    if (password.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        401
      );
    }

    //Getting user profile
    const user: IUser = await User.findOne({ email }).select("+password -__v");

    if (
      !user ||
      !("password" in user) ||
      !(await bcrypt.compare(password, user.password))
    )
      return errorResponse("The email or password is incorrect", res, 401);

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

export { signUp, logIn };
