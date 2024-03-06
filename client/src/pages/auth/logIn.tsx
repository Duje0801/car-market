import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProfileData } from "../../store/slices/profile";
import { store } from "../../store";
import { IProfileData } from "../../interfaces/IProfileData";
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

  //Redirect to Sign Up
  const handleSignUp = () => {
    navigate(`/signUp`);
  };

  {
    /* Loading user data */
  }
  if (!isChecked) {
    return (
      <main>
        <div className="flex justify-center mt-8">
          <span className="loading loading-ball loading-md"></span>
          <span className="loading loading-ball loading-md"></span>
          <span className="loading loading-ball loading-md"></span>
        </div>
      </main>
    );
  } else if (data.username) {
    {
      /* If the user is already logged in */
    }
    return (
      <main>
        <div className="badge badge-error flex flex-justify gap-2 rounded-lg p-4 m-auto h-fit max-w-[80vw]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-8 h-8 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <p className="text-sm text-center">You are already logged in!</p>
        </div>
      </main>
    );
  } else {
    {/* Log in form */}
    return (
      <main>
        {isLogging ? (
          <div className="flex justify-center mt-8">
            <span className="loading loading-ball loading-md"></span>
            <span className="loading loading-ball loading-md"></span>
            <span className="loading loading-ball loading-md"></span>
          </div>
        ) : (
          <>
            {error && (
              <div className="badge badge-error flex flex-justify gap-2 rounded-lg p-4 m-auto h-fit max-w-[80vw]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <p className="text-sm text-center">{error}</p>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw]"
            >
              <div className="card-body p-4">
                <p className="card-title text-3xl">Log in</p>
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Email</span>
                  </div>
                  <input
                    type="email"
                    maxLength={40}
                    id="emailField"
                    value={email}
                    onChange={handleChangeEmail}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Password</span>
                  </div>
                  <input
                    type="password"
                    minLength={9}
                    maxLength={20}
                    id="passwordField"
                    value={password}
                    onChange={handleChangePassword}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                  <div className="label"></div>
                </label>
                <p className="text-center">
                  Not a member yet?{" "}
                  <a className="link" onClick={handleSignUp}>
                    Sign up
                  </a>
                </p>
                <div className="card-actions justify-end mt-4">
                  <button type="submit" className="btn bg-black text-white">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </main>
    );
  }
}
