import { Response } from "express";
import { Ad } from "../../models/adModel";
import { ReqUser } from "../../interfaces/reqUser";
import { IAd } from "../../interfaces/ad";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const editAd: any = async function (req: ReqUser, res: Response) {
  try {
    const {
      title,
      condition,
      make,
      model,
      firstRegistration,
      mileage,
      fuel,
      gearbox,
      power,
      price,
      description,
      adImages,
    } = req.body;

    //Checking if the new car is registered and it's mileage
    if (condition === "New" && firstRegistration !== "-" && mileage !== "0") {
      return errorResponse(
        "The new car must not be registered and have 0 mileage",
        res,
        400
      );
    }

    //Getting ad
    const ad: IAd | null = await Ad.findById(req.params.id)
      .select("-updatedAt -__v")
      .populate({
        path: `user`,
        select: "-updatedAt -__v +active",
      });

    if (!ad) {
      return errorResponse("Can't edit this ad", res, 404);
    }

    //Checking if user has permission to edit ad data
    if (ad.user && ad.user[0].id !== req.user.id) {
      return errorResponse(
        "You don't have permission for this operation",
        res,
        404
      );
    }

    //Checking the first registration
    let firstRegistrationChecked: string | number;
    if (
      !isNaN(Number(firstRegistration)) &&
      firstRegistration >= 2000 &&
      firstRegistration <= new Date().getFullYear()
    ) {
      firstRegistrationChecked = Number(firstRegistration);
    } else if (firstRegistration === "-") {
      firstRegistrationChecked = 0;
    } else if (firstRegistration === "Older") {
      firstRegistrationChecked = 1999;
    } else {
      return errorResponse(
        "First registration year must be from 2000 onwards, -, or text `1999. and before`",
        res,
        401
      );
    }

    ad.title = title;
    ad.condition = condition;
    ad.make = make;
    ad.model = model;
    ad.firstRegistration = firstRegistrationChecked;
    ad.mileage = mileage;
    ad.fuel = fuel;
    ad.gearbox = gearbox;
    ad.power = power;
    ad.price = price;
    ad.images = JSON.parse(adImages);
    ad.location = req.user.location || "";
    ad.country = req.user.country;
    ad.description = description;

    //Saving ad
    await ad.save({ validateBeforeSave: true });

    res.status(200).json({
      status: `success`,
      message: "The ad has been successfully edited",
      ad,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
