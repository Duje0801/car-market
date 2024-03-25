import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { addProfileData } from "../../../store/slices/profile";
import { catchErrors } from "../../../utilis/catchErrors";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { WaitingDots } from "../../elements/waitingDots";
import { countries as countriesList } from "../../../data/countries";
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

export function EditLocationCountry({
  loggedProfileData,
  editError,
  setEditError,
  editMessage,
  setEditMessage,
  handleClickX,
}: Props) {
  //Form data states
  const [newLocation, setNewLocation] = useState<string>("");
  const [newCountry, setNewCountry] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Other states
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const dispatch = useDispatch();

  //Form data states changes
  const handleChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation(event.target.value);
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCountry(event.target.value);
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
      formData.append("newLocation", newLocation);
      formData.append("newCountry", newCountry);
      formData.append("password", password);

      const response = await axios.patch(
        "http://localhost:4000/api/v1/user/edit/locationCountry",
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
    setNewLocation("");
    setNewCountry("");
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
        {/* Location input */}
        <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
          <div className="label p-0">
            <span className="label-text xxl:text-xl">New Location</span>
          </div>
          <input
            type="text"
            minLength={3}
            maxLength={20}
            placeholder="Town/City/Region"
            id="locationField"
            value={newLocation}
            onChange={handleChangeLocation}
            className="input input-bordered w-full xxl:text-xl"
          />
        </label>
        {/* Country select */}
        <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
          <div className="label p-0">
            <span className="label-text xxl:text-xl">New Country</span>
          </div>
          <select
            value={newCountry}
            onChange={handleSelectCountry}
            className="input input-bordered w-full xxl:text-xl"
            required
          >
            <option key={0}></option>
            {countriesList.map((c, i) => {
              return (
                <option key={i + 1} value={c}>
                  {c}
                </option>
              );
            })}
          </select>
        </label>
        {/* Password input */}
        <label className="form-control w-full mt-2">
          <div className="label p-0">
            <span className="label-text">Password</span>
          </div>
          <input
            type="password"
            minLength={9}
            maxLength={20}
            value={password}
            onChange={handleChangePassword}
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
