import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/userModel";
import { IUser } from "../../interfaces/user";
import { ReqUser } from "../../interfaces/reqUser";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

import dotenv from "dotenv";
dotenv.config();

export const protect: any = async function (
  req: ReqUser,
  res: Response,
  next: NextFunction
) {
  try {
    //Getting authorization (Bearer + jwt token) from client
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith(`Bearer`))
      return errorResponse("Invalid token", res, 401);

    const token = authorization.split(" ")[1];

    //Checking is token valid
    const decoded: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    );

    if (typeof decoded === `string`)
      return errorResponse("Invalid token", res, 401);

    const user: IUser = await User.findById(decoded._id).select("+active -updatedAt -__v")

    if (user && user.active) {
      //Memorizing user data in request
      req.user = user;
      next();
    } else
      return errorResponse(
        "The user is deactivated or does not exist",
        res,
        401
      );
  } catch (error) {
    errorHandler(error, req, res);
  }
};
