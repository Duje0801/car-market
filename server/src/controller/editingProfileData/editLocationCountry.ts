import { Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel";
import { Ad } from "../../models/adModel";
import { ReqUser } from "../../interfaces/reqUser";
import { IUser } from "../../interfaces/user";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const editLocationCountry: any = async function (
  req: ReqUser,
  res: Response
) {
  try {
    const { email, newLocation, newCountry, password } = req.body;

    //Checking location length
    if (newLocation.length > 20) {
      return errorResponse(
        "Maximum number of the characters allowed in the location is 20.",
        res,
        400
      );
    }

    //Checking country
    const allowedCountries: string[] = [
      "Austria",
      "Belgium",
      "Croatia",
      "France",
      "Germany",
      "Italy",
      "Luxembourg",
      "Netherlands",
      "Slovenia",
      "Spain",
    ];
    if (!allowedCountries.includes(newCountry)) {
      return errorResponse("The country you entered is not allowed.", res, 400);
    }

    //Checking password length
    if (password.length < 9) {
      return errorResponse(
        "Password must contain 9 or more characters",
        res,
        400
      );
    }

    //Getting user
    const user: IUser | null = await User.findOne({ email })
      .select(`+active +password -updatedAt -__v`)
      .populate({
        path: `ads`,
        options: { sort: { createdAt: -1 } },
        select: {
          updatedAt: 0,
          __v: 0,
        },
      });

    //Checking does user exist, is user active and is password correct
    if (!user || !user.active) {
      return errorResponse(
        "This user is deactivated or does not exist.",
        res,
        401
      );
    }

    //Checking if the user has permission to change the password
    if (user.id !== req.user.id) {
      return errorResponse(
        "You don't have permission for this operation.",
        res,
        401
      );
    }

    //Checking password
    if (!(await bcrypt.compare(password, user.password))) {
      return errorResponse("Password is incorrect.", res, 401);
    }

    //Adding new user data (location and country)
    user.location = newLocation;
    user.country = newCountry;

    //Saving new user data (location and country)
    await user.save({ validateBeforeSave: true });

    //Updating location and country in all user ads
    await Ad.updateMany(
      { username: user.username },
      { $set: { location: newLocation, country: newCountry } }
    )
      .exec()
      .catch((err: any) => {
        return errorResponse(
          `Location and country in user data have been updated, but locations and country in the 
        ads have not been updated. To change the location and country in the ads, 
        please edit the user data again`,
          res,
          400
        );
      });

    res.status(200).json({
      status: "success",
      message: "Location and country are succesfully changed!",
      user,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
