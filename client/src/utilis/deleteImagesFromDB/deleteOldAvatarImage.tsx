import { IProfile } from "../../interfaces/IProfile";
import { ILoggedProfile } from "../../interfaces/ILoggedProfile";
import axios from "axios";

//This function is used when new avatar is submitted
//Deletes old avatar from Cloudinary DB 

export async function deleteOldAvatarImage(
  profileData: IProfile,
  loggedProfileData: ILoggedProfile
) {
  if (profileData?.avatar.uploadedAvatar.publicID) {
    try {
      //Deleting avatar from Cloudinary database
      await axios.delete(
        `https://car-market-production.up.railway.app/api/v1/user/deleteImage/${profileData?.avatar.uploadedAvatar.publicID}`,
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
