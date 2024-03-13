import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { addProfileData } from "../../../store/slices/profile";
import { catchErrors } from "../../../utilis/catchErrors";
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

export function EditContact({
  editError,
  setEditError,
  editMessage,
  setEditMessage,
  handleClickX,
}: Props) {
  //Form data states
  const [newContact, setNewContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Other states
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const dispatch = useDispatch();

  //Form data states changes
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
      formData.append("email", loggedProfileData.email);
      formData.append("newContact", newContact);
      formData.append("password", password);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/contact",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      dispatch(addProfileData(response.data.user));
      setEditMessage(response.data.message);
      setEditError("");
    } catch (error) {
      catchErrors(error, setEditError);
    }
    setNewContact("");
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
        {/* New contact input */}
        <label className="form-control w-full max-w-xs">
          <div className="label p-0">
            <span className="label-text">New Contact</span>
          </div>
          <input
            type="text"
            maxLength={30}
            value={newContact}
            onChange={handleNewContact}
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
