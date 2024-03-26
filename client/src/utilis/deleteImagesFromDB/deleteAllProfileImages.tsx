import axios from "axios";
import { IProfile } from "../../interfaces/IProfile";
import { IAd } from "../../interfaces/IAd";
import { ILoggedProfile } from "../../interfaces/ILoggedProfile";

//This function is used when profile is deleted
//Deletes all images associated with profile (including avatar and ad's images) from Cloudinary DB

export async function deleteAllProfileImages(
  loggedProfileData: ILoggedProfile,
  profileData: IProfile | null,
  profileAds: IAd[]
) {
  let imagesDeleteList: string[] = [];

  //Adding avatar to delete list (if exist)
  if (profileData?.avatar.uploadedAvatar.publicID) {
    imagesDeleteList = [profileData?.avatar.uploadedAvatar.publicID];
  }

  //Adding all ad`s images (if user/admin is deleting profile)
  profileAds.forEach((ad) => {
    ad.images.forEach((img) => {
      imagesDeleteList.push(img.publicID);
    });
  });

  //Creating fetch for all images
  const promises = imagesDeleteList.map((publicID) =>
    axios.delete(`https://car-market-production.up.railway.app/api/v1/user/deleteImage/${publicID}`, {
      headers: {
        authorization: `Bearer ${loggedProfileData?.token}`,
      },
    })
  );

  try {
    //Deleting images
    await Promise.all(promises);
    return "allDeleted";
  } catch (error) {
    return "notAllDeleted";
  }
}
