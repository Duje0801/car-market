export interface IUserData {
  _id: string;
  username: string;
  email: string;
  contact?: string;
  active: boolean;
  type: string;
  createdAt: Date;
  userType: string;
  avatar: {
    avatarURL?: string;
    uploadedAvatar: {
      imageUrl?: string;
      publicID?: string;
    };
  };
  id: String;
}
