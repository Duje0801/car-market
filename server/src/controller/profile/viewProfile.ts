import { Request, Response } from "express";
import { Ad } from "../../models/adModel";
import { User } from "../../models/userModel";
import { checkUser } from "../../utilis/checkUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { IUser } from "../../interfaces/user";

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

    //Only admin can see deactivated ads
    if (loggedUser?.role === `admin`) {
      active = {};
    }

    //Only admin ad profile owner can see visible and old ads
    if (loggedUser?.role === `admin` || params === loggedUser?.username) {
      visible = {};
      oldAd = {};
    }

    //Getting user
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

    //Getting total number of user ads
    let userCountAds: number | null = await Ad.countDocuments({
      username: params,
      ...active,
      ...oldAd,
    });

    //In case of error while getting total ads number, in response ads number will be 9999999
    //Because, later, at front and user will see profile data (without ads total number)
    //Otherwise user will get error 
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
