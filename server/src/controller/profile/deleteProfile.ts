import { Response } from "express";
import { User } from "../../models/userModel";
import { Ad } from "../../models/adModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { IUser } from "../../interfaces/user";
import { ReqUser } from "../../interfaces/reqUser";

export const deleteProfile: any = async function (req: ReqUser, res: Response) {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(
        "You don't have permission for this operation",
        res,
        401
      );
    }

    //Getting and deleting user user
    const user: IUser = await User.findByIdAndDelete(req.params.id).select(
      "+active -updatedAt -__v"
    );

    if (!user) {
      return errorResponse("Can't delete this user", res, 404);
    }

    //Deleting all user ads
    const ads = await Ad.deleteMany({ username: user.username });

    if (!ads) {
      return errorResponse(
        "User has been deleted, but his ads are still active and visible",
        res,
        404
      );
    }

    res.status(200).json({
      status: `success`,
      message: "User has been successfully deleted",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
