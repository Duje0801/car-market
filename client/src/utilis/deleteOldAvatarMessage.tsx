import { IProfile } from "../interfaces/IProfile";
import { ILoggedProfile } from "../interfaces/ILoggedProfile";
import axios from "axios";

export async function deleteOldAvatarMessage(
  profileData: IProfile,
  loggedProfileData: ILoggedProfile
) {
  if (profileData?.avatar.uploadedAvatar.publicID) {
    try {
      //Deleting avatar from Cloudinary database
      await axios.delete(
        `http://localhost:4000/api/v1/user/deleteImage/${profileData?.avatar.uploadedAvatar.publicID}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      return " Old user avatar is succesfully deleted too.";
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        return ` ${error.response.data.message}`;
      } else {
        return " Old user's avatar is not deleted";
      }
    }
  } else return "";
}
