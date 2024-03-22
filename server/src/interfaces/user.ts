import { Document } from "mongoose";
import { IAd } from "./ad";

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
  location?: string;
  country: string;
  avatar: {
    avatarURL?: string;
    uploadedAvatar: {
      imageUrl?: string;
      publicID?: string;
    };
  };
  ads?: IAd[];
  restartPasswordCode?: string;
  restartPasswordCodeExpire?: Date;
  id: string;
}
