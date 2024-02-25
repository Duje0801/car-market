import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProfileData } from "../store/slices/profile";
import { store } from "../store";
import { IProfileData } from "../interfaces/IProfileData";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";

const userTypesID = [{ id: "Company" }, { id: "Person" }];

export function SignUp() {
  //Form data states
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [uploadedImageURL, setUploadedImageURL] = useState<string>("");
  const [uploadedImagePublicID, setUploadedImagePublicID] =
    useState<string>("");

  //Other states
  const [uploadImage, setUploadImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Form data states changes
  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleChangeContact = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact(event.target.value);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  const handleChangeAvatarURL = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarURL(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    if (password !== confirmPassword) {
      setIsSaving(false);
      return setError("Passwords must be identical");
    }

    try {
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      data.append("confirmPassword", confirmPassword);
      data.append("contact", contact);
      data.append("userType", userType);
      data.append("avatarURL", avatarURL);
      data.append("uploadedAvatarURL", uploadedImageURL);
      data.append("uploadedPublicID", uploadedImagePublicID);

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/signUp",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const profileData: IProfileData = response.data.data;
      localStorage.setItem("userData", JSON.stringify(profileData));
      dispatch(addProfileData(profileData));
      navigate("/");
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again later.");
      }
      setPassword("");
      setConfirmPassword("");
      setIsSaving(false);
    }
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
          await axios.post(
            "http://localhost:4000/api/v1/user/avatarDelete",
            { data: uploadedImagePublicID },
            {
              headers: {
                "Content-Type": "application/json",
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
      const data = new FormData();
      data.append("image", e.target.files[0]);
      setIsSaving(true);

      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/user/avatarUpload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUploadedImageURL(response.data.imageUrl);
        setUploadedImagePublicID(response.data.publicID);
        setError("Avatar successfully uploaded.");
      } catch (error: any) {
        if (
          error?.response?.data?.status === "fail" &&
          typeof error?.response?.data?.message === `string`
        ) {
          setError(error.response.data.message);
        } else {
          setError("Uploading avatar error, please try again later.");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      setError("Please set valid image for upload.");
    }
  };

  if (!isChecked) return <div>Loading...</div>;
  else if (data.username) return <div>You are already logged in!</div>;
  else
    return (
      <>
        <form onSubmit={handleSubmit} className="border-2 border-black m-4">
          <p>SignUp Form</p>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="usernameField">Username:</label>
            <input
              type="text"
              minLength={3}
              maxLength={20}
              id="usernameField"
              value={username}
              onChange={handleChangeUsername}
              className="border-2 border-black"
              required
            />
          </div>
          <div>
            <label htmlFor="emailField">Email:</label>
            <input
              type="email"
              maxLength={40}
              id="emailField"
              value={email}
              onChange={handleChangeEmail}
              className="border-2 border-black"
              required
            />
          </div>
          <div>
            <label htmlFor="passwordField">Password:</label>
            <input
              type="password"
              minLength={9}
              maxLength={20}
              id="passwordField"
              value={password}
              onChange={handleChangePassword}
              className="border-2 border-black"
              required
            />{" "}
          </div>
          <div>
            <label htmlFor="confirmPasswordField">Confirm Password:</label>
            <input
              type="password"
              minLength={9}
              maxLength={20}
              id="confirmPasswordField"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              className="border-2 border-black"
              required
            />{" "}
          </div>
          <div>
            <label htmlFor="contactField">Contact (Mob/Tel):</label>
            <input
              type="text"
              maxLength={30}
              id="contactField"
              value={contact}
              onChange={handleChangeContact}
              className="border-2 border-black"
            />{" "}
          </div>
          <div>
            <label htmlFor="avatarURL">User type:</label>
            {userTypesID.map((type) => (
              <div key={type.id}>
                <input
                  type="radio"
                  id={type.id}
                  name="user_type"
                  value={type.id}
                  checked={userType === type.id}
                  onChange={handleOptionChange}
                  className="border-2 border-black"
                  required
                />
                <label htmlFor={type.id}>{type.id}</label>
              </div>
            ))}
          </div>
          <div>
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
          </div>
          <button type="button" onClick={handleChangeUpload} className="btn">
            {uploadImage ? "Upload avatar" : "Avatar URL"}
          </button>
          <div>
            <button type="submit" className="btn">
              Submit
            </button>
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
