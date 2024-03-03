import { Request, Response } from "express";
import { checkUser } from "../../utilis/checkUser";
import { IAd } from "../../interfaces/ad";
import { Ad } from "../../models/adModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const oneAd = async (req: Request, res: Response) => {
  try {
    //Getting user data (if the user exists)
    const user: any = await checkUser(req);

    //Getting ad
    const ad: IAd | null = await Ad.findById(req.params.id)
      .select("-updatedAt -__v")
      .populate({
        path: `user`,
        select: "-updatedAt -__v +active",
      });

    if (!ad) {
      return errorResponse("Can't find this ad", res, 404);
    }

    //Checking if the other user wants to see the edit page
    if (
      (req.originalUrl.split("/")[5] === `edit` && !user) ||
      (req.originalUrl.split("/")[5] === `edit` &&
        ad.user &&
        ad.user[0].id !== user.id)
    ) {
      return errorResponse(
        "You don`t have permission to view this page",
        res,
        401
      );
    }

    //Checking can user see this ad:
    //1. If ad is not visible
    if (
      !ad.visible &&
      (!user || user?.role !== `admin`) &&
      (!ad.user || ad.user[0].id !== user?.id)
    ) {
      return errorResponse(
        "You don`t have permission to view this ad",
        res,
        401
      );
    }

    //2. If ad is deactivated
    if (!ad.active && (!user || user?.role !== `admin`)) {
      return errorResponse(
        "You don`t have permission to view this ad",
        res,
        401
      );
    }

    res.status(200).json({
      status: `success`,
      ad,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
