import { Request, Response } from "express";
import { Ad } from "../../models/adModel";
import { IAd } from "../../interfaces/ad";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const searchAd: any = async function (req: Request, res: Response) {
  try {
    let adsCheck: {} = {};

    if (req.query.make) {
      adsCheck = {
        make: req.query.make,
      };
    }
    if (req.query.model) {
      adsCheck = {
        ...adsCheck,
        model: req.query.model,
      };
    }
    if (req.query.priceFrom || req.query.priceTo) {
      let priceCheck: {} = {};
      if (req.query.priceFrom)
        priceCheck = { $gte: Number(req.query.priceFrom) };
      if (req.query.priceTo)
        priceCheck = { ...priceCheck, $lte: Number(req.query.priceTo) };
      adsCheck = {
        ...adsCheck,
        price: priceCheck,
      };
    }
    if (req.query.country) {
      adsCheck = {
        ...adsCheck,
        country: req.query.country,
      };
    }
    if (req.query.fuel) {
      adsCheck = {
        ...adsCheck,
        fuel: req.query.fuel,
      };
    }
    if (req.query.firstRegistrationFrom || req.query.firstRegistrationTo) {
      let firstRegistrationCheck: {} = {};
      if (req.query.firstRegistrationFrom)
        firstRegistrationCheck = {
          $gte: Number(req.query.firstRegistrationFrom),
        };
      if (req.query.firstRegistrationTo)
        firstRegistrationCheck = {
          ...firstRegistrationCheck,
          $lte: Number(req.query.firstRegistrationTo),
        };
      adsCheck = {
        ...adsCheck,
        firstRegistration: firstRegistrationCheck,
      };
    }
    if (req.query.mileageFrom || req.query.mileageTo) {
      let mileageCheck: {} = {};
      if (req.query.mileageFrom)
        mileageCheck = { $gte: Number(req.query.mileageFrom) };
      if (req.query.mileageTo)
        mileageCheck = { ...mileageCheck, $lte: Number(req.query.mileageTo) };
      adsCheck = {
        ...adsCheck,
        mileage: mileageCheck,
      };
    }
    if (req.query.minPower || req.query.maxPower) {
      let powerCheck: {} = {};
      if (req.query.minPower) powerCheck = { $gte: Number(req.query.minPower) };
      if (req.query.maxPower)
        powerCheck = { ...powerCheck, $lte: Number(req.query.maxPower) };
      adsCheck = {
        ...adsCheck,
        power: powerCheck,
      };
    }

    const adsList: IAd[] = await Ad.find(adsCheck);

    res.status(200).json({
      status: `success`,
      data: adsList,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
