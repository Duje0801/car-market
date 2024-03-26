import { ILoggedProfile } from "../../interfaces/ILoggedProfile";
import axios from "axios";

//This function is used when avatar is deleted
//Deletes avatar from Cloudinary DB

export async function deleteAvatar(
  loggedProfileData: ILoggedProfile,
  publicID: string | undefined
) {
  try {
    await axios.delete(
      `https://car-market-production.up.railway.app/api/v1/user/deleteImage/${publicID}`,
      {
        headers: {
          authorization: `Bearer ${loggedProfileData?.token}`,
        },
      }
    );

    return " Avatar is deleted from database too.";
  } catch (error) {
    return " But maybe avatar is not deleted from database.";
  }
}
