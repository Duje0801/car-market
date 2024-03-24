import { ILoggedProfile } from "../interfaces/ILoggedProfile";
import { IAd } from "../interfaces/IAd";
import { IImage } from "../interfaces/IImage";
import axios from "axios";

//Deleting images (from Cloudinary DB)
export async function deleteImageEditingAd(
  loggedProfileData: ILoggedProfile,
  adData: IAd | null,
  adImages: IImage[]
) {
  let imagesDeleteList: string[] = [];

  //Looking to images that are deleted during editing ad
  const adImagesMapped = adImages.map((img) => img.publicID);
  adData?.images.forEach((img) => {
    if (!adImagesMapped.includes(img.publicID)) {
      imagesDeleteList.push(img.publicID);
    }
  });

  if (imagesDeleteList.length === 0) return "";

  //Creating fetch for all images
  const promises = imagesDeleteList.map((publicID) =>
    axios.delete(`http://localhost:4000/api/v1/user/deleteImage/${publicID}`, {
      headers: {
        authorization: `Bearer ${loggedProfileData?.token}`,
      },
    })
  );

  try {
    //Deleting images message
    await Promise.all(promises);
    return "All ad images designated for deletion have been deleted";
  } catch (error) {
    return "Some of the ad images designated for deletion have not been deleted";
  }
}
