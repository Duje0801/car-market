import { Response } from "express";
import { User } from "../../models/userModel";
import { errorResponse } from "../../utilis/errorHandling/errorResponse";
import { IUser } from "../../interfaces/user";
import { ReqUser } from "../../interfaces/reqUser";

export const deleteAvatar: any = async function (req: ReqUser, res: Response) {
  const user: IUser = await User.findById(req.user.id).select(
    "+active -updatedAt -__v"
  );

  //Checking if the user exists
  if (!user) {
    return errorResponse("Can't find this user", res, 404);
  }

  if (user.id !== req.user.id) {
    return errorResponse(
      "You don't have permission for this operation",
      res,
      401
    );
  }

  //Removing all data
  user.avatar.avatarURL = "";
  user.avatar.uploadedAvatar.imageUrl = "";
  user.avatar.uploadedAvatar.publicID = "";

  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    status: `success`,
    message: `Avatar has been successfully deleted.`,
    user,
  });
};
