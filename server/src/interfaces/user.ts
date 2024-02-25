import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  contact?: string;
  password: string;
  active: boolean;
  role: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: {
    avatarURL?: string;
    uploadedAvatar: {
      imageUrl?: string;
      publicID?: string;
    };
  };
  id: String;
  restartPasswordCode?: string;
  restartPasswordCodeExpire?: Date;
}
