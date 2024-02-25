import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProfileData } from "../store/slices/profile";
import { store } from "../store";
import { IProfileData } from "../interfaces/IProfileData";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";

export function LogIn() {
  //Form data states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Other states
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Form data states changes
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLogging(true);

    try {
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/logIn",
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
      setIsLogging(false);
    }
  };

  if (!isChecked) return <div>Loading...</div>;
  else if (data.username) return <div>You are already logged in!</div>;
  else
    return (
      <>
        <form onSubmit={handleSubmit} className="border-2 border-black m-4">
          <p>LogIn Form</p>
          {error && <p className="text-red-500">{error}</p>}
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
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
        {isLogging && (
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
