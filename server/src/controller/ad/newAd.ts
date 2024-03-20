import { Response } from "express";
import { Ad } from "../../models/adModel";
import { ReqUser } from "../../interfaces/reqUser";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";

export const newAd: any = async function (req: ReqUser, res: Response) {
  try {
    const {
      title,
      condition,
      country,
      make,
      model,
      firstRegistration,
      mileage,
      fuel,
      power,
      price,
      description,
      adImages
    } = req.body;

    //Checking first registration
    let firstRegistrationChecked: string | number;
    if (
      !isNaN(Number(firstRegistration)) &&
      firstRegistration >= 2000 &&
      firstRegistration <= new Date().getFullYear()
    ) {
      firstRegistrationChecked = Number(firstRegistration)
    } else if (firstRegistration === "Older") {
      firstRegistrationChecked = 1999;
    } else {
      return errorResponse(
        "First registration year must be from 2000 onwards or text - Older",
        res,
        401
      );
    }

    //Saving ad
    await Ad.create({
      username: req.user.username,
      title,
      condition,
      country,
      make,
      model,
      firstRegistration: firstRegistrationChecked,
      mileage: Number(mileage),
      fuel,
      power: Number(power),
      price: Number(price),
      description,
      images: JSON.parse(adImages)
    });

    res.status(200).json({
      status: `success`,
      message: "The ad has been successfully created!",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
