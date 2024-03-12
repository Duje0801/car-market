import { IProfileData } from "./IProfileData";

export interface ILoggedProfileState {
  loggedProfileData: IProfileData;
  error: string | null;
  isChecked: boolean;
}
