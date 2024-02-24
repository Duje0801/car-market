import { IProfileData } from "./IProfileData";

export interface IProfileState {
  data: IProfileData;
  error: string | null;
  isChecked: boolean;
}
