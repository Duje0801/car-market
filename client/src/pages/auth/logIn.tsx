import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProfileData } from "../../store/slices/profile";
import { store } from "../../store";
import { IProfileData } from "../../interfaces/IProfileData";
import { WaitingDots } from "../../components/elements/waitingDots";
import { ErrorMessage } from "../../components/elements/errorMessage";
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
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/logIn",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const profileData: IProfileData = response.data.data;
      localStorage.setItem("userData", JSON.stringify(profileData));
      dispatch(addProfileData(profileData));
      navigate("/redirect/auth/logIn");
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
  const handleClick = (to: string) => {
    navigate(`/${to}`);
  };

  {
    /* Loading user data */
  }
  if (!isChecked) {
    return (
      <main>
        <WaitingDots size={"md"} />{" "}
      </main>
    );
  } else if (data.username) {
    {
      /* If the user is already logged in */
    }
    return (
      <main>
        <ErrorMessage text={"You are already logged in!"} />{" "}
      </main>
    );
  } else {
    {
      /* Log in form */
    }
    return (
      <main className="pb-4">
        {isLogging ? (
          <WaitingDots size={"md"} />
        ) : (
          <>
            {error && <ErrorMessage text={error} />}
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
                  <a
                    className="link"
                    onClick={() => handleClick(`forgotPassword`)}
                  >
                    Forgot password?
                  </a>
                </p>
                <p className="text-center">
                  Not a member yet?{" "}
                  <a className="link" onClick={() => handleClick(`signUp`)}>
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
