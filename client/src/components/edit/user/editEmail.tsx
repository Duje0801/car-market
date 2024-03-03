import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IUserData } from "../../../interfaces/IUserData";
import { Hourglass } from "react-loader-spinner";
import { store } from "../../../store";
import axios from "axios";
import { addProfileData } from "../../../store/slices/profile";
import { IProfileData } from "../../../interfaces/IProfileData";

interface Props {
  email: string;
  setProfileData: Dispatch<SetStateAction<IUserData | null>>;
  setOpenEditEmail: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function EditEmail({
  email,
  setProfileData,
  setOpenEditEmail,
  setError,
}: Props) {
  const [newEmail, setNewEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editEmailError, setEditEmailError] = useState<string>("");

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();

  //Form data states changes
  const handleNewEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("oldEmail", email);
      formData.append("newEmail", newEmail);
      formData.append("password", password);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/editEmail",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data?.token}`,
          },
        }
      );

      const profileData: IProfileData = {
        ...data,
        email: response.data.user.email,
      };

      localStorage.setItem("userData", JSON.stringify(profileData));
      dispatch(addProfileData(profileData));
      setProfileData(response.data.user);
      setError(response.data.message);
      setOpenEditEmail(false);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setEditEmailError(error.response.data.message);
      } else {
        setEditEmailError("Something went wrong, please try again later.");
      }
    }
    setNewEmail("")
    setPassword("");
    setIsSaving(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="border-2 border-black m-4">
        <p>Edit Email Form</p>
        {editEmailError && <p className="text-red-500">{editEmailError}</p>}
        <div>
          <label htmlFor="newEmailField">New Email:</label>
          <input
            type="email"
            maxLength={30}
            id="newEmailField"
            value={newEmail}
            onChange={handleNewEmail}
            className="border-2 border-black"
            required
          />{" "}
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
