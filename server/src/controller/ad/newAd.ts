import { Response } from "express";
import { Ad } from "../../models/adModel";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { ReqUser } from "../../interfaces/reqUser";

export const newAd: any = async function (req: ReqUser, res: Response) {
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

    const adImagesObject = JSON.parse(adImages);

    //Checking if the new car is registered and it's mileage
    if (condition === "New" && firstRegistration !== "-" && mileage !== "0") {
      return errorResponse(
        "The new car must not be registered and have 0 mileage",
        res,
        400
      );
    }

    //Checking number of images in ad
    if (adImagesObject.length < 1 || adImagesObject.length > 10) {
      return errorResponse("Ad must have between 1 and 10 images", res, 400);
    }

    //Checking first registration
    let firstRegistrationChecked: string | number;
    if (
      !isNaN(Number(firstRegistration)) &&
      firstRegistration >= 2000 &&
      firstRegistration <= new Date().getFullYear()
    ) {
      firstRegistrationChecked = Number(firstRegistration);
    } else if (firstRegistration === "-") {
      firstRegistrationChecked = 0;
    } else if (firstRegistration === "1999. and before") {
      firstRegistrationChecked = 1999;
    } else {
      return errorResponse(
        "First registration year must be from 2000 onwards, -, or text `1999. and before`",
        res,
        400
      );
    }

    //Saving ad
    await Ad.create({
      username: req.user.username,
      title,
      condition,
      make,
      model,
      firstRegistration: firstRegistrationChecked,
      mileage: Number(mileage),
      fuel,
      gearbox,
      power: Number(power),
      price: Number(price),
      location: req.user.location,
      country: req.user.country,
      description,
      images: adImagesObject,
    });

    res.status(200).json({
      status: `success`,
      message: "The ad has been successfully created!",
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
