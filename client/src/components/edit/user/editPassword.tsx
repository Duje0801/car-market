import React, { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { Hourglass } from "react-loader-spinner";
import { store } from "../../../store";
import axios from "axios";

interface Props {
  setOpenEditPassword: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function EditPassword({ setOpenEditPassword, setError }: Props) {
  const [email, setEmail] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editPasswordError, setEditPasswordError] = useState<string>("");

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangeOldPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOldPassword(event.target.value);
  };

  const handleChangeNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };

  const handleChangeConfirmNewPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    if (newPassword !== confirmNewPassword) {
      setNewPassword("");
      setConfirmNewPassword("");
      setIsSaving(false);
      setEditPasswordError("New passwords must be identical");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/password",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setEmail("");
      setError(response.data.message);
      setOpenEditPassword(false);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setEditPasswordError(error.response.data.message);
      } else {
        setEditPasswordError("Something went wrong, please try again later.");
      }
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsSaving(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="border-2 border-black m-4">
        <p>Edit Password Form</p>
        {editPasswordError && (
          <p className="text-red-500">{editPasswordError}</p>
        )}
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
          <label htmlFor="passwordField">Old Password:</label>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            id="oldPasswordField"
            value={oldPassword}
            onChange={handleChangeOldPassword}
            className="border-2 border-black"
            required
          />{" "}
        </div>
        <div>
          <label htmlFor="confirmPasswordField">New Password:</label>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            id="newPasswordField"
            value={newPassword}
            onChange={handleChangeNewPassword}
            className="border-2 border-black"
            required
          />{" "}
        </div>
        <div>
          <label htmlFor="confirmPasswordField">Confirm New Password:</label>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            id="newPasswordField"
            value={confirmNewPassword}
            onChange={handleChangeConfirmNewPassword}
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
