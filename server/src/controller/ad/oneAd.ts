import { Request, Response } from "express";
import { IAd } from "../../interfaces/ad";
import { Ad } from "../../models/adModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const oneAd = async (req: Request, res: Response) => {
  try {
    const ad: IAd | null = await Ad.findOne({ _id: req.params.id })
      .select("-updatedAt -__v")
      .populate({
        path: `user`,
        select: "-updatedAt -__v +active",
      });

    if (!ad) {
      return errorResponse("Can't find this ad", res, 404);
    }

    res.status(200).json({
      status: `success`,
      ad,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
