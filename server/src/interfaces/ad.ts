import { IUser } from "./user";

export interface IAd {
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
  images: {
    imageUrl: string;
    publicID: string;
  }[];
  user?: IUser
}