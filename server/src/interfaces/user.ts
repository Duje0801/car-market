export interface IUser {
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
}
