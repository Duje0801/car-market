import { Response } from "express";
import { User } from "../../models/userModel";
import { IUser } from "../../interfaces/user";
import { ReqUser } from "../../interfaces/reqUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { Ad } from "../../models/adModel";

export const deactivateProfile: any = async function (
  req: ReqUser,
  res: Response
) {
  try {
    const user: IUser = await User.findById(req.params.id).select(
      "+active -updatedAt -__v"
    );

    if (!user) {
      return errorResponse("Can't find this user", res, 404);
    }

    if (user.active) {
      if (req.user.role !== "admin" && req.user.username !== user.username) {
        return errorResponse(
          "You don't have permission for this operation",
          res,
          401
        );
      }

      user.active = false;
      await user.save({ validateBeforeSave: true });

      const ads = await Ad.updateMany(
        { username: user.username },
        { $set: { active: false, visible: false } }
      );

      if (!ads) {
        return errorResponse(
          "User has been deactivated, but his ads are still active and visible",
          res,
          404
        );
      }
    } else {
      if (req.user.role !== "admin") {
        return errorResponse(
          "You don't have permission for this operation",
          res,
          401
        );
      }

      user.active = true;
      await user.save({ validateBeforeSave: true });

      const ads = await Ad.updateMany(
        { username: user.username },
        { $set: { active: true, visible: true } }
      );

      if (!ads) {
        return errorResponse(
          "User has been activated, but his ads are still inactive and unvisible",
          res,
          404
        );
      }
    }

    res.status(200).json({
      status: `success`,
      message: `User has been successfully ${user.active ? "" : "de"}activated`,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
