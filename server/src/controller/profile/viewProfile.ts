import { Request, Response } from "express";
import { IUser } from "../../interfaces/user";
import { User } from "../../models/userModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { checkUser } from "../../utilis/checkUser";

export const viewProfile: any = async function (req: Request, res: Response) {
  try {
    const params = req.params.id;

    const loggedUser: IUser | null = await checkUser(req);

    let active: {} = { active: true };
    let visible: {} = { visible: true };

    if (loggedUser?.role === `admin`) {
      active = {};
    }

    if (loggedUser?.role === `admin` || params === loggedUser?.username) {
      visible = {};
    }

    const user: IUser | null = await User.findOne({ username: params })
      .select("+active -updatedAt -__v")
      .populate({
        path: `ads`,
        match: { ...active, ...visible },
        options: { sort: { createdAt: -1 } },
        select: "-updatedAt -__v",
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
