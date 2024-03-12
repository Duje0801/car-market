import { ILoggedProfile } from "../ILoggedProfile";

export interface ILoggedProfileState {
  loggedProfileData: ILoggedProfile;
  error: string | null;
  isChecked: boolean;
}
