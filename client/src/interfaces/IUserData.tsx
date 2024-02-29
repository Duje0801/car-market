import { IAd } from "./IAd";

export interface IUserData {
  _id: string;
  username: string;
  email: string;
  contact?: string;
  active: boolean;
  createdAt: Date;
  userType: string;
  avatar: {
    avatarURL?: string;
    uploadedAvatar: {
      imageUrl?: string;
      publicID?: string;
    };
  };
  ads?: IAd[];
  id: string;
}
