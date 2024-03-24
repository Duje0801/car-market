import { Request, Response } from "express";
import { Ad } from "../../models/adModel";
import { checkSearchQueries } from "../../utilis/checkSearchQueries";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { checkUser } from "../../utilis/checkUser";
import { IUser } from "../../interfaces/user";

export const searchAdsTotal: any = async function (
  req: Request,
  res: Response
) {
  try {
    const user: IUser | null = await checkUser(req);

    const adsCheck = checkSearchQueries(req);

    let filters: {} = {
      active: true,
      visible: true,
      createdAt: {
        $gt: new Date(Date.now() - 15552000000),
      },
    };

    //Only admin (role) can see old, hidden and deactivated ads
    if (user?.role === `admin`) {
      filters = {};
    }

    const adsNo = await Ad.countDocuments({ ...adsCheck, ...filters });

    res.status(200).json({
      status: `success`,
      adsNo,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
