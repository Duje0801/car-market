import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { IUserData } from "../../../interfaces/IUserData";
import { Hourglass } from "react-loader-spinner";
import { store } from "../../../store";
import axios from "axios";

interface Props {
  email: string;
  setProfileData: Dispatch<SetStateAction<IUserData | null>>;
  setOpenEditContact: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function EditContact({
  email,
  setProfileData,
  setOpenEditContact,
  setError,
}: Props) {
  const [newContact, setNewContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editContactError, setEditContactError] = useState<string>("");

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const handleNewContact = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewContact(event.target.value);
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
      formData.append("email", email);
      formData.append("newContact", newContact);
      formData.append("password", password);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/contact",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setProfileData(response.data.user);
      setError(response.data.message);
      setOpenEditContact(false);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setEditContactError(error.response.data.message);
      } else {
        setEditContactError("Something went wrong, please try again later.");
      }
    }
    setPassword("");
    setIsSaving(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="border-2 border-black m-4">
        <p>Edit Contact Form</p>
        {editContactError && <p className="text-red-500">{editContactError}</p>}
        <div>
          <label htmlFor="newContactField">New Contact:</label>
          <input
            type="text"
            maxLength={30}
            id="newContactField"
            value={newContact}
            onChange={handleNewContact}
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
