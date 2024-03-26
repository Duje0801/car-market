import React, { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { catchErrors } from "../../../utilis/catchErrors";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { WaitingDots } from "../../elements/waitingDots";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import axios from "axios";

interface Props {
  loggedProfileData: ILoggedProfile;
  editError: string;
  setEditError: Dispatch<SetStateAction<string>>;
  editMessage: string;
  setEditMessage: Dispatch<SetStateAction<string>>;
  handleClickX: () => void;
}

export function EditPassword({
  loggedProfileData,
  editError,
  setEditError,
  editMessage,
  setEditMessage,
  handleClickX,
}: Props) {
  //Form data states
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  //Other states
  const [isSaving, setIsSaving] = useState<boolean>(false);

  //Form data states changes
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

    try {
      const formData = new FormData();
      formData.append("email", loggedProfileData.email);
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        "https://car-market-production.up.railway.app/api/v1/user/edit/password",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      setEditMessage(response.data.message);
      setEditError("");
    } catch (error) {
      catchErrors(error, setEditError);
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
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

        {/* Old password input */}
        <label className="form-control w-full">
          <div className="label p-0">
            <span className="label-text">Old Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={oldPassword}
            onChange={handleChangeOldPassword}
            className="input input-bordered w-full"
            required
          />
        </label>

        {/* New Password input */}
        <label className="form-control w-full">
          <div className="label p-0">
            <span className="label-text">New Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={newPassword}
            onChange={handleChangeNewPassword}
            className="input input-bordered w-full"
            required
          />
        </label>

        {/* New password confirm input */}
        <label className="form-control w-full">
          <div className="label p-0">
            <span className="label-text">Confirm New Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={confirmNewPassword}
            onChange={handleChangeConfirmNewPassword}
            className="input input-bordered w-full"
            required
          />
        </label>
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
      </form>{" "}
    </>
  );
}
