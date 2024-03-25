import axios from "axios";
import { IProfile } from "../interfaces/IProfile";
import { IAd } from "../interfaces/IAd";
import { ILoggedProfile } from "../interfaces/ILoggedProfile";

export async function deleteProfileImages(
  loggedProfileData: ILoggedProfile,
  profileData: IProfile | null,
  profileAds: IAd[],
  operation: string
) {
  let imagesDeleteList: string[] = [];

  //Adding avatar to delete list (if exist)
  if (profileData?.avatar.uploadedAvatar.publicID) {
    imagesDeleteList = [profileData?.avatar.uploadedAvatar.publicID];
  }

  //Adding all ad`s images (if user/admin is deleting profile)
  if (operation === `deleteProfile`) {
    profileAds.forEach((ad) => {
      ad.images.forEach((img) => {
        imagesDeleteList.push(img.publicID);
      });
    });
  }

  //Creating fetch for all images
  const promises = imagesDeleteList.map((publicID) =>
    axios.delete(`http://localhost:4000/api/v1/user/deleteImage/${publicID}`, {
      headers: {
        authorization: `Bearer ${loggedProfileData?.token}`,
      },
    })
  );

  try {
    //Deleting images
    await Promise.all(promises);
    return operation === "deleteProfile" ? "allDeleted" : "";
  } catch (error) {
    return operation === "deleteProfile"
      ? "notAllDeleted"
      : " But maybe avatar is not deleted from database.";
  }
}
