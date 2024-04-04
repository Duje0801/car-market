import { IImage } from "../../interfaces/IImage";
import { ILoggedProfile } from "../../interfaces/ILoggedProfile";
import axios from "axios";

//This function is used when clear all button is clicked while creating new ad
//Deletes all recently uploaded images from Cloudinary DB

export async function deleteNewAdImages(
  loggedProfileData: ILoggedProfile,
  adImages: IImage[],
  publicID?: string
) {
  let imagesDeleteList: string[] = [];

  if (publicID) {
    //Deleting only one ad image
    imagesDeleteList = [publicID];
  } else {
    //Deleting all ad`s images
    adImages.forEach((img) => {
      imagesDeleteList.push(img.publicID);
    });
  }

  //Creating fetch for all images
  const promises = imagesDeleteList.map((publicID) =>
    axios.delete(`https://car-market-production.up.railway.app/api/v1/car/deleteImage/${publicID}`, {
      headers: {
        authorization: `Bearer ${loggedProfileData?.token}`,
      },
    })
  );

  try {
    //Deleting images
    await Promise.all(promises);
    if (publicID) return "Image is deleted!";
    else return "All images are deleted!";
  } catch (error) {
    if (publicID) return "Image is not deleted!";
    else return "Maybe some uploaded images are not deleted!!";
  }
}
