import { Request, Response } from "express";
import { IUser } from "../../interfaces/user";
import { User } from "../../models/userModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const viewProfile: any = async function (req: Request, res: Response) {
  try {
    const params = req.params.id;

    const user: IUser | null = await User.findOne({ username: params })
      .select("+active -updatedAt -__v")
      .populate({
        path: `ads`,
        options: { sort: { createdAt: -1 } },
        select: {
          updatedAt: 0,
          __v: 0,
        },
      });

    if (!user || !user.active) {
      return errorResponse("Can't find user with this username", res, 404);
    }

    res.status(200).json({
      status: `success`,
      user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
