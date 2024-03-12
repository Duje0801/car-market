import React, { FormEvent, useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { WaitingDots } from "../../elements/waitingDots";
import axios from "axios";

interface Props {
  editError: string;
  setEditError: Dispatch<SetStateAction<string>>;
  editMessage: string;
  setEditMessage: Dispatch<SetStateAction<string>>;
  handleClickX: () => void;
}

export function EditPassword({
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

  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

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

    if (newPassword !== confirmNewPassword) {
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsSaving(false);
      setEditError("New passwords must be identical");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", loggedProfileData.email);
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/password",
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
        <label className="form-control w-full max-w-xs">
          <div className="label p-0">
            <span className="label-text">Old Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={oldPassword}
            onChange={handleChangeOldPassword}
            className="input input-bordered w-full max-w-xs"
            required
          />
        </label>

        {/* New Password input */}
        <label className="form-control w-full max-w-xs">
          <div className="label p-0">
            <span className="label-text">New Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={newPassword}
            onChange={handleChangeNewPassword}
            className="input input-bordered w-full max-w-xs"
            required
          />
        </label>

        {/* New password confirm input */}
        <label className="form-control w-full max-w-xs">
          <div className="label p-0">
            <span className="label-text">Confirm New Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={confirmNewPassword}
            onChange={handleChangeConfirmNewPassword}
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
