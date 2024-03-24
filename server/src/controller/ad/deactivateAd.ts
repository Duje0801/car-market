import { Response } from "express";
import { Ad } from "../../models/adModel";
import { ReqUser } from "../../interfaces/reqUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { IAd } from "../../interfaces/ad";

export const deactivateAd: any = async function (req: ReqUser, res: Response) {
  try {
    //Getting ad
    const ad: IAd | null = await Ad.findById(req.params.id)
      .select("-updatedAt -__v")
      .populate({
        path: `user`,
        select: "-updatedAt -__v +active",
      });

    if (!ad) {
      return errorResponse("Can't deactivate this ad", res, 404);
    }

    //Checking if the user has permission to de/activate this ad
    //1. Is ad is not active
    if (!ad.active && req.user.role !== "admin") {
      return errorResponse(
        "You don't have permission for this operation",
        res,
        401
      );
    }

    //2. If ad is  acitve
    if (
      ad.active &&
      ad.user &&
      req.user.id !== ad.user[0].id &&
      req.user.role !== "admin"
    ) {
      return errorResponse(
        "You don't have permission for this operation",
        res,
        401
      );
    }

    let message: string = "";

    if (ad.active) {
      ad.active = false;
      message = "The ad has been successfully deactivated";
    } else {
      ad.active = true;
      message = "The ad has been activated";
    }

    await ad.save({ validateBeforeSave: true });

    res.status(200).json({
      status: `success`,
      message,
      ad,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
