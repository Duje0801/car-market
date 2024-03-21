import { Document } from "mongodb";
import { IUser } from "./user";

export interface IAd extends Document {
  username: string;
  title: string;
  condition: string;
  country: string;
  make: string;
  model: string;
  firstRegistration: number;
  mileage: number;
  fuel: string;
  gearbox: string;
  power: number;
  price: number;
  location: string;
  description: string;
  images: {
    imageUrl: string;
    publicID: string;
  }[];
  user?: IUser[];
  active: boolean;
  visible: boolean
}
