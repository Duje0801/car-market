import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  contact?: string;
  password: string;
  active?: boolean;
  role?: string;
  userType: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: {
    avatarURL?: string;
    uploadedAvatar: {
      imageUrl?: string;
      publicID?: string;
    };
  };
  restartPasswordCode?: string;
  restartPasswordCodeExpire?: Date;
  id: string;
}
