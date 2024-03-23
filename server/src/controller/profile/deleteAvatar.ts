import { Response } from "express";
import { User } from "../../models/userModel";
import { IUser } from "../../interfaces/user";
import { ReqUser } from "../../interfaces/reqUser";

export const deleteAvatar: any = async function (req: ReqUser, res: Response) {
  const user: IUser = await User.findById(req.user.id).select(
    "+active -updatedAt -__v"
  );

  user.avatar.avatarURL = "";
  user.avatar.uploadedAvatar.imageUrl = "";
  user.avatar.uploadedAvatar.publicID = "";

  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    status: `success`,
    message: `Avatar has been successfully deleted.`,
    user
  });
};
