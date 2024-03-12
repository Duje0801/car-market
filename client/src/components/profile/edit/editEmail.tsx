import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../../../store";
import { addLoggedProfileData } from "../../../store/slices/loggedProfile";
import { addProfileData } from "../../../store/slices/profile";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { WaitingDots } from "../../elements/waitingDots";
import { IProfileData } from "../../../interfaces/IProfileData";
import axios from "axios";

interface Props {
  editError: string;
  setEditError: Dispatch<SetStateAction<string>>;
  editMessage: string;
  setEditMessage: Dispatch<SetStateAction<string>>;
  handleClickX: () => void;
}

export function EditEmail({
  editError,
  setEditError,
  editMessage,
  setEditMessage,
  handleClickX,
}: Props) {
  //Form data states
  const [newEmail, setNewEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Other states
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
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
      formData.append("oldEmail", loggedProfileData.email);
      formData.append("newEmail", newEmail);
      formData.append("password", password);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/email",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );

      const profileData: IProfileData = {
        ...loggedProfileData,
        email: response.data.user.email,
      };

      localStorage.setItem("userData", JSON.stringify(profileData));
      dispatch(addLoggedProfileData(profileData));
      dispatch(addProfileData(response.data.user));
      setEditMessage(response.data.message);
      setEditError("");
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
    setNewEmail("");
    setPassword("");
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
        {isSaving && <WaitingDots size="sm" marginTop={0} />}
        {editError && (
          <div className="my-2">
            <MessageError message={editError} />
          </div>
        )}
        {/* New email input */}
        <label className="form-control w-full max-w-xs">
          <div className="label p-0">
            <span className="label-text">New Email</span>
          </div>
          <input
            type="email"
            maxLength={30}
            value={newEmail}
            onChange={handleNewEmail}
            className="input input-bordered w-full max-w-xs"
            required
          />
        </label>
        {/* Password input */}
        <label className="form-control w-full max-w-xs mt-2">
          <div className="label p-0">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={password}
            onChange={handleChangePassword}
            className="input input-bordered w-full max-w-xs"
            required
          />
        </label>
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
      </form>{" "}
    </>
  );
}
