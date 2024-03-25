import { Response } from "express";
import { User } from "../../models/userModel";
import { Ad } from "../../models/adModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { IUser } from "../../interfaces/user";
import { ReqUser } from "../../interfaces/reqUser";

export const deactivateProfile: any = async function (
  req: ReqUser,
  res: Response
) {
  try {
    //Getting user from MongoDB
    const user: IUser | null = await User.findById(req.params.id)
      .select("+active -updatedAt -__v")
      .populate({
        path: `ads`,
        options: { sort: { createdAt: -1 } },
        select: {
          updatedAt: 0,
          __v: 0,
        },
      });

    //Checking if the user exists
    if (!user) {
      return errorResponse("Can't find this user", res, 404);
    }

    //If user is active (will be change to active: false)
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
    }
    //If user is not active (will be change to active: true)
    else {
      //Only admin can change active from false to true
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
          "Profile has been activated, but his ads are still inactive and unvisible",
          res,
          404
        );
      }
    }

    res.status(200).json({
      status: `success`,
      message: `Profile has been successfully ${
        user.active ? "" : "de"
      }activated`,
      user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
