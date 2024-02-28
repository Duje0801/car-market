import { useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { IImageData } from "../interfaces/IImageData";
import { Hourglass } from "react-loader-spinner";
import { store } from "../store";
import axios from "axios";

interface Props {
  setError: Dispatch<SetStateAction<string>>;
  adImages: IImageData[];
  setAdImages: Dispatch<SetStateAction<IImageData[]>>;
}

export function UploadAdImages({ setError, adImages, setAdImages }: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  //Avatar upload function
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
              authorization: `Bearer ${data?.token}`,
            },
          }
        );
        setAdImages([...adImages, response.data.image]);
        setError("Image successfully uploaded.");
      } catch (error: any) {
        if (
          error?.response?.data?.status === "fail" &&
          typeof error?.response?.data?.message === `string`
        ) {
          setError(error.response.data.message);
        } else {
          setError("Uploading avatar error, please try again later.");
        }
      }
    } else {
      setError("Please set valid image for upload.");
    }
    setIsSaving(false);
  };

  //Deleting image (from array and cloudinary database)
  const handleDeleteImage = async (image: IImageData, index: number) => {
    setIsSaving(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/ad/imageDelete",
        { data: image.publicID },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setError(response.data.message);
      //Removing image from images array
      const updatedadImagesArray = [...adImages];
      updatedadImagesArray.splice(index, 1);
      setAdImages(updatedadImagesArray);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Removing avatar error.");
      }
    }
    setIsSaving(false);
  };

  return (
    <>
      <div className="flex gap-2">
        {adImages.length > 0 &&
          adImages.map((image, i) => {
            return (
              <div key={i}>
                {" "}
                <img
                  width="200"
                  height="200"
                  src={image.imageUrl}
                  alt="avatar"
                ></img>
                <button
                  className="btn btn-error"
                  onClick={() => handleDeleteImage(image, i)}
                >
                  Delete
                </button>
              </div>
            );
          })}
      </div>
      {adImages.length >= 10 ? (
        <div>You have reached maximum amount of 10 images per ad</div>
      ) : (
        <div>
          <input type="file" onChange={handleUploadAvatar} />
        </div>
      )}
      {isSaving && (
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
      )}
    </>
  );
}
