import { Response } from "express";
import { Ad } from "../../models/adModel";
import { IAd } from "../../interfaces/ad";
import { ReqUser } from "../../interfaces/reqUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const deleteAd: any = async function (req: ReqUser, res: Response) {
  try {
    if (req.user.role !== "admin") {
      return errorResponse(
        "You don't have permission for this operation",
        res,
        401
      );
    }

    const ad: IAd | null = await Ad.findByIdAndDelete(req.params.id)
      .select("-updatedAt -__v")
      .populate({
        path: `user`,
        select: "-updatedAt -__v +active",
      });

    if (!ad) {
      return errorResponse(
        "Can't delete this ad, please check ad ID.",
        res,
        404
      );
    }

    res.status(200).json({
      status: `success`,
      message: "The ad has been successfully deleted",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
