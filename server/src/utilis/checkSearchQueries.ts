import { Request } from "express";

export const checkSearchQueries = (req: Request) => {
  let adsCheck: {} = {};

  //Adding queries to adsCheck object

  //Checking make
  if (req.query.make) {
    adsCheck = {
      make: req.query.make,
    };
  }

  //Checking model
  if (req.query.model) {
    adsCheck = {
      ...adsCheck,
      model: { $regex: req.query.model, $options: "i" },
    };
  }

  //Checking priceFrom and priceTo
  if (req.query.priceFrom || req.query.priceTo) {
    let priceCheck: {} = {};
    if (req.query.priceFrom) priceCheck = { $gte: Number(req.query.priceFrom) };
    if (req.query.priceTo)
      priceCheck = { ...priceCheck, $lte: Number(req.query.priceTo) };
    adsCheck = {
      ...adsCheck,
      price: priceCheck,
    };
  }

  //Checking country
  if (req.query.country) {
    adsCheck = {
      ...adsCheck,
      country: req.query.country,
    };
  }

  //Checking condition
  if (req.query.condition) {
    adsCheck = {
      ...adsCheck,
      condition: req.query.condition,
    };
  }

  //Checking fuel
  if (req.query.fuel) {
    adsCheck = {
      ...adsCheck,
      fuel: req.query.fuel,
    };
  }

  //Checking gearbox
  if (req.query.gearbox) {
    adsCheck = {
      ...adsCheck,
      gearbox: req.query.gearbox,
    };
  }

  //Checking firstRegistrationFrom and firstRegistrationTo
  if (req.query.firstRegistrationFrom || req.query.firstRegistrationTo) {
    let firstRegistrationCheck: {} = {};
    if (req.query.firstRegistrationFrom === "1999. and before") {
      firstRegistrationCheck = {
        $gte: 1999,
      };
    } else if (req.query.firstRegistrationFrom) {
      firstRegistrationCheck = {
        $gte: Number(req.query.firstRegistrationFrom),
      };
    }
    if (req.query.firstRegistrationTo) {
      firstRegistrationCheck = {
        ...firstRegistrationCheck,
        $lte: Number(req.query.firstRegistrationTo),
      };
    }
    adsCheck = {
      ...adsCheck,
      firstRegistration: firstRegistrationCheck,
    };
  }

  //Checking mileageFrom and mileageTo
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

  //Checking minPower and maxPower
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

  return adsCheck;
};
