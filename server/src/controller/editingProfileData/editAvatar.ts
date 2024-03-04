import { Response } from "express";
import { User } from "../../models/userModel";
import { ReqUser } from "../../interfaces/reqUser";
import { IUser } from "../../interfaces/user";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const editAvatar: any = async function (req: ReqUser, res: Response) {
  try {
    const { email, avatarURL, uploadedAvatarURL, uploadedPublicID } = req.body;

    //Getting user
    const user: IUser = await User.findOne({ email }).select(
      `+active -updatedAt -__v`
    );

    //Checking does user exist and is user active
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

    //Checking avatar links length
    if (
      avatarURL.length > 200 ||
      uploadedAvatarURL.length > 200 ||
      uploadedPublicID.length > 200
    ) {
      return errorResponse(
        "URL links are too long, the maximum number of characters in links is 200.",
        res,
        401
      );
    }

    //Adding new avatar links
    if (avatarURL) {
      user.avatar.avatarURL = avatarURL;
      user.avatar.uploadedAvatar.imageUrl = "";
      user.avatar.uploadedAvatar.publicID = "";
    } else if (uploadedAvatarURL && uploadedPublicID) {
      user.avatar.avatarURL = "";
      user.avatar.uploadedAvatar.imageUrl = uploadedAvatarURL;
      user.avatar.uploadedAvatar.publicID = uploadedPublicID;
    } else {
      return errorResponse("Can't save images, please try again.", res, 401);
    }

    //Saving new avatar links
    await user.save({ validateBeforeSave: true });

    const userToReturn: IUser | null = await User.findById(user._id)
      .select("+active -updatedAt -__v")
      .populate({
        path: `ads`,
        options: { sort: { createdAt: -1 } },
        select: {
          updatedAt: 0,
          __v: 0,
        },
      });

    res.status(200).json({
      status: "success",
      message: "Avatar succesfully changed!",
      user: userToReturn,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
