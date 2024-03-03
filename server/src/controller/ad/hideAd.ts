import { Response } from "express";
import { Ad } from "../../models/adModel";
import { ReqUser } from "../../interfaces/reqUser";
import { IAd } from "../../interfaces/ad";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const hideAd: any = async function (req: ReqUser, res: Response) {
  try {
    //Getting ad
    const ad: IAd | null = await Ad.findById(req.params.id)
      .select("-updatedAt -__v")
      .populate({
        path: `user`,
        select: "-updatedAt -__v +active",
      });

    if (!ad) {
      return errorResponse("Can't hide this ad", res, 404);
    }

    //Checking can user hide ad
    if (ad.user && req.user.id !== ad.user[0].id) {
      return errorResponse(
        "You don`t have permission to hide this ad",
        res,
        401
      );
    }

    let message: string = "";

    if (ad.visible) {
      ad.visible = false;
      message = "The ad has been successfully hidden";
    } else {
      ad.visible = true;
      message = "The ad is available to other users";
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
