import { Request, Response } from "express";
import { Ad } from "../../models/adModel";
import { IAd } from "../../interfaces/ad";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const newestAds: any = async function (req: Request, res: Response) {
  try {
    const ads: IAd[] = await Ad.find({ visible: true, active: true })
      .select("-updatedAt -__v")
      .sort(`-createdAt`)
      .limit(5);

    res.status(200).json({
      status: `success`,
      ads,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
