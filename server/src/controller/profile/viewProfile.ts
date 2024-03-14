import { Request, Response } from "express";
import { IUser } from "../../interfaces/user";
import { Ad } from "../../models/adModel";
import { User } from "../../models/userModel";
import { checkUser } from "../../utilis/checkUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const viewProfile: any = async function (req: Request, res: Response) {
  try {
    const params = req.params.id;

    const loggedUser: IUser | null = await checkUser(req);

    let active: {} = { active: true };
    let visible: {} = { visible: true };
    let oldAd: {} = {
      createdAt: {
        $gt: new Date(Date.now() - 15552000000),
      },
    };

    if (loggedUser?.role === `admin`) {
      active = {};
    }

    if (loggedUser?.role === `admin` || params === loggedUser?.username) {
      visible = {};
      oldAd = {};
    }

    const user: IUser | null = await User.findOne({
      username: params,
      ...active,
    })
      .select("+active -updatedAt -__v")
      .populate({
        path: `ads`,
        match: { ...active, ...visible, ...oldAd },
        options: {
          sort: String(req.query.sort),
          skip: Number(req.query.page),
          limit: 5,
        },
        select: "-updatedAt -__v",
      });

    if (!user) {
      return errorResponse("Can't find user with this username", res, 404);
    }

    let userCountAds: number | null = await Ad.countDocuments({
      username: params,
      ...active,
      ...oldAd,
    });

    if (!userCountAds && userCountAds !== 0) {
      userCountAds = 9999999;
    }

    res.status(200).json({
      status: `success`,
      user,
      adsNo: userCountAds,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
