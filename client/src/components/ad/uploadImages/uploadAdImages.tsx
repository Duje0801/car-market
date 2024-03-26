import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { WaitingDots } from "../../elements/waitingDots";
import { useCalcPhotosNumber } from "../../../hooks/useCalcPhotosNumber";
import { catchErrors } from "../../../utilis/catchErrors";
import { handleOpenModal } from "../../../utilis/handleOpenModal";
import { IImage } from "../../../interfaces/IImage";
import axios from "axios";

interface Props {
  setError: Dispatch<SetStateAction<string>>;
  adImages: IImage[];
  setAdImages: Dispatch<SetStateAction<IImage[]>>;
  imgToShow: number;
  setImgToShow: Dispatch<SetStateAction<number>>;
  messageImgSuccess: string;
  setMessageImgSuccess: Dispatch<SetStateAction<string>>;
  messageImgError: string;
  setMessageImgError: Dispatch<SetStateAction<string>>;
  fileInputRef: RefObject<HTMLInputElement>;
}

export function UploadAdImages({
  setError,
  adImages,
  setAdImages,
  imgToShow,
  setImgToShow,
  messageImgSuccess,
  setMessageImgSuccess,
  messageImgError,
  setMessageImgError,
  fileInputRef,
}: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);

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
          "https://car-market-production.up.railway.app/api/v1/ad/uploadImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${loggedProfileData?.token}`,
            },
          }
        );
        setAdImages([...adImages, response.data.image]);
        setMessageImgSuccess(response.data.message);
        setMessageImgError("");
        setImgToShow(adImages.length);
      } catch (error) {
        catchErrors(error, setMessageImgError);
        setMessageImgSuccess("");
      }
    } else {
      setMessageImgError("Please set valid image for upload.");
      setMessageImgSuccess("");
    }
    setIsSaving(false);
  };

  //Changing position od image in images array
  function handleChangeImgOrder(index1: number, index2: number) {
    if (index1 === -1 && index2 === 0) return;
    if (index1 === adImages.length && index2 === adImages.length - 1) return;
    const newAdImagesArray = [...adImages];
    newAdImagesArray.splice(index2, 0, newAdImagesArray.splice(index1, 1)[0]);
    setAdImages(newAdImagesArray);
    setImgToShow(index1);
  }

  return (
    <section className="flex flex-col gap-2">
      {/* Upload image messages (successfully and error) */}
      {messageImgSuccess && (
        <div className="mx-auto w-full max-w-lg xxl:max-w-2xl">
          <MessageSuccessfully message={messageImgSuccess} />
        </div>
      )}
      {messageImgError && (
        <div className="mx-auto w-full max-w-lg xxl:max-w-2xl">
          <MessageError message={messageImgError} />
        </div>
      )}
      {/* Show images (box) */}
      {adImages.length > 0 && (
        <div className="flex">
          <div className="carousel carousel-item h-[40vh] w-full bg-black rounded-lg relative mx-auto max-w-lg xxl:max-w-2xl">
            <img
              src={adImages[imgToShow].imageUrl}
              className="w-auto h-full object-cover m-auto"
            />
            {/* Delete image button */}
            <div className="card-actions absolute flex right-1 top-1">
              <div>
                <button
                  type="button"
                  className="btn btn-error w-full"
                  onClick={() => handleOpenModal(`deleteOneAdImage`)}
                >
                  Delete One
                </button>
              </div>
              {/* Delete all images button */}
              {adImages.length > 1 && (
                <div>
                  <button
                    type="button"
                    className="btn btn-error w-full"
                    onClick={() => handleOpenModal(`deleteAllAdImages`)}
                  >
                    Delete All
                  </button>
                </div>
              )}
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
            {/* Changing image order */}
            {adImages.length > 1 && (
              <div className="absolute flex bottom-2 right-2 p-2 bg-slate-100 gap-2 text-xl rounded-md cursor-pointer transition-transform">
                <div>
                  {imgToShow + 1}/{adImages.length}
                </div>
                <div
                  onClick={() => handleChangeImgOrder(imgToShow - 1, imgToShow)}
                >
                  ❮
                </div>
                <div
                  onClick={() => handleChangeImgOrder(imgToShow + 1, imgToShow)}
                >
                  ❯
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Upload image message */}
      {adImages.length === 0 ? (
        <div className="mx-auto w-full max-w-lg xxl:max-w-2xl">
          {" "}
          <MessageWarning message={"Ad must have at least 1 image"} />
        </div>
      ) : null}
      {/* Three dots while saving image */}
      {isSaving && (
        <div className="my-4">
          <WaitingDots size="md" marginTop={0} />
        </div>
      )}
      {/* If maximum number of images (10) is reached / upload image input */}
      {adImages.length >= 10 ? (
        <div className="mx-auto w-full max-w-lg xxl:max-w-2xl">
          <MessageWarning
            message={"You have reached maximum od 10 uploaded images per ad!"}
          />
        </div>
      ) : (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUploadImage}
          className="file-input file-input-bordered w-full mx-auto max-w-lg xxl:max-w-2xl"
        />
      )}
    </section>
  );
}
