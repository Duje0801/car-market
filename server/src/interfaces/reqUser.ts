import { Request } from "express";

export interface ReqUser extends Request {
  user: {
    _id: string;
    username: string;
    email: string;
    contact?: string;
    active?: boolean;
    role?: string;
    userType: string;
    location?: string;
    country: string;  
    createdAt: Date;
    avatar: {
      avatarURL?: string;
      uploadedAvatar: {
        imageUrl?: string;
        publicID?: string;
      };
    };
    id: string;
  };
}
