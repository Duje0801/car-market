import { IProfile } from "./IProfile";

export interface IAd {
  _id: string;
  username: string;
  title: string;
  condition: string;
  make: string;
  model: string;
  firstRegistration: number;
  mileage: number;
  fuel: string;
  gearbox: string;
  power: number;
  price: number;
  description: string;
  location?: string;
  country: string;
  createdAt: Date;
  id: string;
  images: {
    imageUrl: string;
    publicID: string;
    id: string;
    _id: string;
  }[];
  user?: IProfile[];
  active: boolean;
  visible: boolean
}
