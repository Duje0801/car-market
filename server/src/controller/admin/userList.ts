import { Response } from "express";
import { IUser } from "../../interfaces/user";
import { User } from "../../models/userModel";
import { ReqUser } from "../../interfaces/reqUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const userList: any = async function (req: ReqUser, res: Response) {
  try {
    const { onlyActive, contains } = req.query;
    let queries: {} = {};

    if (req.user.role !== `admin`) {
      return errorResponse(
        "You don't have permission to view this page",
        res,
        401
      );
    }

    if (onlyActive) {
      queries = { active: true };
    }

    if (contains) {
      queries = {
        ...queries,
        username: { $regex: req.query.contains, $options: "i" },
      };
    }

    const users: IUser[] | null = await User.find({ ...queries }).select(
      "+active -updatedAt -__v"
    );

    if (!users) {
      return errorResponse("Can't find any user", res, 404);
    }

    res.status(200).json({
      status: `success`,
      users,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
