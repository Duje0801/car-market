import { IAd } from "../IAd";
import { IProfile } from "../IProfile";

export interface IProfileState {
  profileData: IProfile | null;
  profileAds: IAd[]
}
