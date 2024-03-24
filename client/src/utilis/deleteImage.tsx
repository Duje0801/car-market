import axios from "axios";
import { ILoggedProfile } from "../interfaces/ILoggedProfile";
import { IAd } from "../interfaces/IAd";

export async function deleteImage(
  adData: IAd | null,
  loggedProfileData: ILoggedProfile
) {
  let imagesDeleteList: string[] = [];

  //Adding all ad`s images
  adData?.images?.forEach((img) => {
    imagesDeleteList.push(img.publicID);
  });

  //Creating fetch for all images
  const promises = imagesDeleteList.map((publicID) =>
    axios.delete(`http://localhost:4000/api/v1/ad/deleteImage/${publicID}`, {
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
