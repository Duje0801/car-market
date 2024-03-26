import axios from "axios";
import { ILoggedProfile } from "../../interfaces/ILoggedProfile";
import { IAd } from "../../interfaces/IAd";

//This function is used when ad is deleted
//Deletes all images from Cloudinary DB associated with ad

export async function deleteAdImages(
  loggedProfileData: ILoggedProfile,
  adData: IAd | null,
) {
  let imagesDeleteList: string[] = [];

  //Adding all ad`s images
  adData?.images?.forEach((img) => {
    imagesDeleteList.push(img.publicID);
  });

  //Creating fetch for all images
  const promises = imagesDeleteList.map((publicID) =>
    axios.delete(`https://car-market-production.up.railway.app/api/v1/ad/deleteImage/${publicID}`, {
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
