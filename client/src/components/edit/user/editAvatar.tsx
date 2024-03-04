import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { IUserData } from "../../../interfaces/IUserData";
import { Hourglass } from "react-loader-spinner";
import { store } from "../../../store";
import axios from "axios";

interface Props {
  email: string;
  oldUploadedImagePublicID: string | undefined;
  setProfileData: Dispatch<SetStateAction<IUserData | null>>;
  setOpenEditAvatar: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function EditAvatar({
  email,
  oldUploadedImagePublicID,
  setProfileData,
  setOpenEditAvatar,
  setError,
}: Props) {
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [uploadedImageURL, setUploadedImageURL] = useState<string>("");
  const [uploadedImagePublicID, setUploadedImagePublicID] =
    useState<string>("");

  const [uploadImage, setUploadImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editAvatarError, setEditAvatarError] = useState<string>("");

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const handleChangeAvatarURL = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarURL(event.target.value);
  };

  //Submit avatar function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("avatarURL", avatarURL);
      formData.append("uploadedAvatarURL", uploadedImageURL);
      formData.append("uploadedPublicID", uploadedImagePublicID);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/avatar",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data?.token}`,
          },
        }
      );

      //Deleting old avatar
      const delAvatarMessage: string = await deleteAvatar();
      
      setProfileData(response.data.user);
      setError(response.data.message + delAvatarMessage);
      setOpenEditAvatar(false);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again later.");
      }
      setIsSaving(false);
    }
  };

  //Delete avatar function (deleting from Cloudinary database, after deleting user profile)
  const deleteAvatar = async () => {
    if (oldUploadedImagePublicID) {
      try {
        //Deleting avatar from Cloudinary database
        await axios.delete(
          `http://localhost:4000/api/v1/user/deleteImage/${oldUploadedImagePublicID}`,
          {
            headers: {
              authorization: `Bearer ${data?.token}`,
            },
          }
        );
        return ". Old user avatar is succesfully deleted too.";
      } catch (error: any) {
        if (
          error?.response?.data?.status === "fail" &&
          typeof error?.response?.data?.message === `string`
        ) {
          return `. ${error.response.data.message}`;
        } else {
          return ". Old user's avatar is not deleted";
        }
      }
    } else return "";
  };

  //Changing from copy/paste avatar URL to upload avatar (and vice versa)
  const handleChangeUpload = async () => {
    if (uploadImage) {
      setUploadedImageURL("");
      setUploadedImagePublicID("");
      setUploadImage(false);
      setError("");
    } else {
      if (uploadedImageURL && uploadedImagePublicID) {
        setIsSaving(true);
        try {
          await axios.delete(
            `http://localhost:4000/api/v1/user/deleteImage/${uploadedImagePublicID}`,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${data?.token}`,
              },
            }
          );
          setError("Avatar removed");
        } catch (error: any) {
          if (
            error?.response?.data?.status === "fail" &&
            typeof error?.response?.data?.message === `string`
          ) {
            setError(error.response.data.message);
          } else {
            setError("Removing avatar error, please try again later.");
          }
        }
      }
      setAvatarURL(``);
      setUploadImage(true);
      setIsSaving(false);
    }
  };

  //Avatar upload function
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      setIsSaving(true);

      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/user/uploadAvatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${data?.token}`,
            },
          }
        );
        setUploadedImageURL(response.data.image.imageUrl);
        setUploadedImagePublicID(response.data.image.publicID);
        setError("Avatar successfully uploaded.");
      } catch (error: any) {
        if (
          error?.response?.data?.status === "fail" &&
          typeof error?.response?.data?.message === `string`
        ) {
          setEditAvatarError(error.response.data.message);
        } else {
          setEditAvatarError("Uploading avatar error, please try again later.");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      setEditAvatarError("Please set valid image for upload.");
    }
  };

  return (
    <>
      {editAvatarError && <div className="text-red-500">{editAvatarError}</div>}
      <form onSubmit={handleSubmit}>
        {uploadImage ? (
          <>
            <label htmlFor="avatarURL">Avatar URL:</label>
            <input
              type="text"
              maxLength={200}
              id="avatarURL"
              value={avatarURL}
              onChange={handleChangeAvatarURL}
              className="border-2 border-black"
            />
          </>
        ) : (
          <div>
            {uploadedImageURL && (
              <img src={uploadedImageURL} alt="avatar"></img>
            )}
            <input type="file" onChange={handleUploadAvatar} />
          </div>
        )}
        <div>
          <button type="button" onClick={handleChangeUpload} className="btn">
            {uploadImage ? "Upload avatar" : "Avatar URL"}
          </button>
          <div>
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </div>
      </form>
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
