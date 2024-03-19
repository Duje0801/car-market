import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { IImage } from "../../../interfaces/IImage";
import { store } from "../../../store";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { WaitingDots } from "../../elements/waitingDots";
import { useCalcPhotosNumber } from "../../../hooks/useCalcPhotosNumber";
import { catchErrors } from "../../../utilis/catchErrors";
import axios from "axios";

interface Props {
  setError: Dispatch<SetStateAction<string>>;
  adImages: IImage[];
  setAdImages: Dispatch<SetStateAction<IImage[]>>;
  imgToShow: number;
  setImgToShow: Dispatch<SetStateAction<number>>;
}

export function UploadAdImages({
  setError,
  adImages,
  setAdImages,
  imgToShow,
  setImgToShow,
}: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [messageGreen, setMessageGreen] = useState<string>("");
  const [messageRed, setMessageRed] = useState<string>("");

  const photoNumbers = useCalcPhotosNumber(imgToShow, adImages.length);

  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  //Changing visible image (in uploaded images box)
  const handleChangeImage = (iteration: number) => {
    setImgToShow(iteration);
  };

  //Image upload function (add to adImages and Cloudinary DB)
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (adImages.length >= 10) {
      return setError("You have reached the maximum amount of 10 images");
    }
    setIsSaving(true);
    if (e.target.files) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/ad/uploadImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${loggedProfileData?.token}`,
            },
          }
        );
        setAdImages([...adImages, response.data.image]);
        setMessageGreen(response.data.message);
        setMessageRed("");
        setImgToShow(adImages.length);
      } catch (error) {
        catchErrors(error, setMessageRed);
        setMessageGreen("");
      }
    } else {
      setMessageRed("Please set valid image for upload.");
      setMessageGreen("");
    }
    setIsSaving(false);
  };

  //Deleting image (from adImages array and Cloudinary DB)
  const handleDeleteImage = async (index: number) => {
    //Removing image from images array (adImages)
    const updatedadImagesArray = [...adImages];
    updatedadImagesArray.splice(index, 1);
    setAdImages([...updatedadImagesArray]);
    setImgToShow(0);
  };

  return (
    <section className="flex flex-col gap-2">
      {/* Upload image messages (successfully and error) */}
      {messageGreen && <MessageSuccessfully message={messageGreen} />}
      {messageRed && <MessageError message={messageRed} />}
      {/* Show images (box) */}
      {adImages.length > 0 && (
        <div className="flex">
          <div className="carousel carousel-item h-[33vh] w-full bg-black rounded-lg relative">
            <img
              src={adImages[imgToShow].imageUrl}
              className="w-auto h-full object-cover m-auto"
            />
            <div className="absolute top-2 right-2 text-3xl bg-slate-100 rounded-md cursor-pointer transition-transform"></div>
            {/* Delete image button */}
            <div className="card-actions absolute right-1	top-1">
              <button
                type="button"
                className="btn btn-error w-full"
                onClick={() => handleDeleteImage(imgToShow)}
              >
                Delete
              </button>
            </div>
            {/* Changing visible image (left and right arrows) */}
            {adImages.length > 1 && (
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  onClick={() => handleChangeImage(photoNumbers.before)}
                  className="btn btn-circle bg-slate-100"
                >
                  ❮
                </a>
                <a
                  onClick={() => handleChangeImage(photoNumbers.after)}
                  className="btn btn-circle bg-slate-100"
                >
                  ❯
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Upload image message */}
      {adImages.length === 0 ? (
        <MessageWarning message={"Ad must have at least 1 image"} />
      ) : null}
      {/* Three dots while saving image */}
      {isSaving && (
        <div className="my-4">
          <WaitingDots size="md" marginTop={0} />
        </div>
      )}
      {/* If maximum number of images (10) is reached / upload image input */}
      {adImages.length >= 10 ? (
        <MessageWarning
          message={"You have reached maximum od 10 uploaded images per ad!"}
        />
      ) : (
        <input
          type="file"
          onChange={handleUploadImage}
          className="file-input file-input-bordered w-full"
        />
      )}
    </section>
  );
}
