import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { IUserData } from "../../../interfaces/IUserData";
import { store } from "../../../store";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { WaitingDots } from "../../elements/waitingDots";
import axios from "axios";

interface Props {
  email: string;
  oldUploadedImagePublicID: string | undefined;
  setProfileData: Dispatch<SetStateAction<IUserData | null>>;
  editError: string;
  setEditError: Dispatch<SetStateAction<string>>;
  editMessage: string;
  setEditMessage: Dispatch<SetStateAction<string>>;
  handleClickX: () => void;
}

export function EditAvatar({
  email,
  oldUploadedImagePublicID,
  setProfileData,
  editError,
  setEditError,
  editMessage,
  setEditMessage,
  handleClickX,
}: Props) {
  //Form data states
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [uploadedImageURL, setUploadedImageURL] = useState<string>("");
  const [uploadedImagePublicID, setUploadedImagePublicID] =
    useState<string>("");

  //Other states
  const [uploadImage, setUploadImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  //Form data states changes
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
      const deleteAvatarMessage: string = await deleteAvatar();
      console.log(response.data.user);
      setProfileData(response.data.user);
      setEditMessage(response.data.message + deleteAvatarMessage);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setEditError(error.response.data.message);
      } else {
        setEditError("Something went wrong, please try again later.");
      }
    }
    setIsSaving(false);
  };

  //Delete avatar function (deleting from Cloudinary database, after deleting from profile)
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
        return " Old user avatar is succesfully deleted too.";
      } catch (error: any) {
        if (
          error?.response?.data?.status === "fail" &&
          typeof error?.response?.data?.message === `string`
        ) {
          return ` ${error.response.data.message}`;
        } else {
          return " Old user's avatar is not deleted";
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
      setEditError("");
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
          setEditMessage("Avatar removed");
        } catch (error: any) {
          if (
            error?.response?.data?.status === "fail" &&
            typeof error?.response?.data?.message === `string`
          ) {
            setEditError(error.response.data.message);
          } else {
            setEditError("Removing avatar error, please try again later.");
          }
        }
      }
      setAvatarURL("");
      setUploadImage(true);
      setIsSaving(false);
    }
    setEditMessage("");
  };

  //Avatar upload function
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      //Checking is uploaded file image
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (!result.startsWith("data:image/")) {
            return setEditError("Uploaded file is not an image.");
          }
        };
        reader.readAsDataURL(file);
      }

      const formData = new FormData();
      formData.append("image", file);
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
        setEditMessage("Avatar successfully uploaded.");
        setEditError("");
      } catch (error: any) {
        if (
          error?.response?.data?.status === "fail" &&
          typeof error?.response?.data?.message === `string`
        ) {
          setEditError(error.response.data.message);
          setEditMessage("");
        } else {
          setEditError("Uploading avatar error.");
          setEditMessage("");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      setEditError("Please set valid image for upload.");
      setEditMessage("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Messages */}
        {editMessage && (
          <div className="mb-2">
            <MessageSuccessfully message={editMessage} />
          </div>
        )}
        {isSaving && <WaitingDots size="sm" marginTop={2} />}
        {editError && (
          <div className="my-2">
            <MessageError message={editError} />
          </div>
        )}
        <p className="text-center text-sm mb-2">
          The new avatar will be confirmed after clicking the submit button
        </p>
        {/* Image upload */}
        {uploadImage ? (
          <label className="form-control w-full max-w-xs mt-2">
            {/* Password input */}
            <div className="label p-0">
              <span className="label-text">URL</span>
            </div>
            <input
              type="text"
              maxLength={200}
              id="avatarURL"
              value={avatarURL}
              onChange={handleChangeAvatarURL}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
        ) : (
          <div>
            {/* Image upload input */}
            {uploadedImageURL && (
              <div className="avatar rounded flex justify-center my-2">
                <div className="rounded">
                  <img src={uploadedImageURL} alt="uploadedImage" />
                </div>
              </div>
            )}
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={handleUploadAvatar}
            />
          </div>
        )}
        {/* Change Copy URL / upload image */}
        <div>
          <p className="text-center mt-2">
            <a className="link" onClick={handleChangeUpload}>
              {uploadImage ? "Upload avatar" : "Copy avatar URL"}
            </a>
          </p>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn mt-2 w-full">
          Submit
        </button>
      </form>
      {/* Close button */}
      <form method="dialog">
        <button onClick={handleClickX} className="btn btn-error mt-2 w-full">
          Close
        </button>
      </form>
    </>
  );
}
