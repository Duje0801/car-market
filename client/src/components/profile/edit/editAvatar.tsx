import { Dispatch, FormEvent, SetStateAction, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addProfileData } from "../../../store/slices/profile";
import { catchErrors } from "../../../utilis/catchErrors";
import { deleteOldAvatarMessage } from "../../../utilis/deleteOldAvatarMessage";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { WaitingDots } from "../../elements/waitingDots";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import { IProfile } from "../../../interfaces/IProfile";
import axios from "axios";

interface Props {
  loggedProfileData: ILoggedProfile;
  profileData: IProfile;
  editError: string;
  setEditError: Dispatch<SetStateAction<string>>;
  editMessage: string;
  setEditMessage: Dispatch<SetStateAction<string>>;
  handleClickX: () => void;
}

export function EditAvatar({
  loggedProfileData,
  profileData,
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

  const dispatch = useDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  //Form data states changes
  const handleChangeAvatarURL = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarURL(event.target.value);
  };

  //Changing from copy/paste avatar URL to upload avatar (and vice versa), after click on gray underlined text
  const handleChangeUpload = async () => {
    if (uploadImage) {
      setUploadedImageURL("");
      setUploadedImagePublicID("");
      setUploadImage(false);
      setEditError("");
    } else {
      if (uploadedImageURL && uploadedImagePublicID) {
        await removeAvatar();
      }
      setAvatarURL("");
      setUploadImage(true);
    }
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

      setIsSaving(true);

      const formData = new FormData();
      formData.append("image", file);

      //Uploading image in Cloudinary DB
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/user/uploadAvatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${loggedProfileData?.token}`,
            },
          }
        );
        setEditError("");
        setUploadedImageURL(response.data.image.imageUrl);
        setUploadedImagePublicID(response.data.image.publicID);
        setEditMessage("Avatar successfully uploaded.");
      } catch (error: any) {
        catchErrors(error, setEditError);
        setEditMessage("");
      }
      setIsSaving(false);
    } else {
      setEditError("Please set valid image for upload.");
      setEditMessage("");
    }
  };

  //Avatar remove function (after remove avatar button is clicked or after Copy avatar URL text is clicked)
  const removeAvatar = async () => {
    setIsSaving(true);
    try {
      //Removing image from Cloudinary DB
      await axios.delete(
        `http://localhost:4000/api/v1/user/deleteImage/${uploadedImagePublicID}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setUploadedImageURL("");
      setUploadedImagePublicID("");
      setEditMessage("Avatar removed");
    } catch (error) {
      catchErrors(error, setEditError);
    }
    setIsSaving(false);
  };

  //Submit avatar (final confirmation)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("email", loggedProfileData.email);
      formData.append("avatarURL", avatarURL);
      formData.append("uploadedAvatarURL", uploadedImageURL);
      formData.append("uploadedPublicID", uploadedImagePublicID);

      //Saving new avatar and deleting old one (Mongo DB)
      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/avatar",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );

      //Removing old avatar from Cloudinary DB
      const deleteAvatarText: string = await deleteOldAvatarMessage(
        profileData,
        loggedProfileData
      );
      dispatch(addProfileData(response.data.user));
      setEditMessage(response.data.message + deleteAvatarText);
      setAvatarURL("");
      setUploadedImageURL("");
      setUploadedImagePublicID("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      catchErrors(error, setEditError);
    }
    setIsSaving(false);
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
        {editError && (
          <div className="my-2">
            <MessageError message={editError} />
          </div>
        )}
        {isSaving && <WaitingDots size="sm" marginTop={2} />}
        {uploadedImageURL && (
          <p className="text-center text-sm mb-2">
            The new avatar will be confirmed after clicking the submit button
          </p>
        )}

        {/* Image upload */}
        {uploadImage ? (
          <label className="form-control w-full mt-2">
            {/* Avatar URL input */}
            <div className="label p-0">
              <span className="label-text">URL</span>
            </div>
            <input
              type="text"
              maxLength={200}
              id="avatarURL"
              value={avatarURL}
              onChange={handleChangeAvatarURL}
              className="input input-bordered w-full"
            />
          </label>
        ) : (
          <div>
            {/* Image upload input */}
            {uploadedImageURL && (
              <>
                <div className="flex justify-center my-2">
                  <img
                    src={uploadedImageURL}
                    alt="uploadedImage"
                    className="rounded-lg w-2/3 mx-auto sm:w-1/3 sm:min-w-36"
                  />
                </div>
                {/* Remove avatar button */}
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="btn btn-error mt-2 w-full"
                >
                  Remove uploaded avatar
                </button>
              </>
            )}
            <input
              type="file"
              className="file-input file-input-bordered w-full mt-2"
              onChange={handleUploadAvatar}
              ref={fileInputRef}
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
        <button type="submit" className="btn btn-error mt-2 w-full">
          Submit
        </button>
      </form>

      {/* Close button */}
      <form method="dialog">
        <button onClick={handleClickX} className="btn mt-2 w-full">
          Close
        </button>
      </form>
    </>
  );
}
