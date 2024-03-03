import { IUserData } from "./IUserData";

export interface IAd {
  _id: string;
  username: string;
  title: string;
  condition: string;
  country: string;
  make: string;
  model: string;
  firstRegistration: number;
  mileage: number;
  fuel: string;
  power: number;
  price: number;
  description: string;
  createdAt: Date;
  id: string;
  images: {
    imageUrl: string;
    publicID: string;
    id: string;
    _id: string;
  }[];
  user?: IUserData[];
  active: boolean;
  visible: boolean
}
