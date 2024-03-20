import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addLoggedProfileData } from "../../store/slices/loggedProfile";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { ILoggedProfile } from "../../interfaces/ILoggedProfile";
import axios from "axios";

export function LogIn() {
  //Form data states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Other states
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
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
      const profileData: ILoggedProfile = response.data.data;
      localStorage.setItem("userData", JSON.stringify(profileData));
      dispatch(addLoggedProfileData(profileData));
      navigate("/redirect/auth/logIn");
    } catch (error) {
      catchErrors(error, setError);
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
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (loggedProfileData.username) {
    {
      /* If the user is already logged in */
    }
    return (
      <div className="mx-auto w-[90vw]">
        <MessageError message={"You are already logged in!"} />
      </div>
    );
  } else {
    {
      /* Log in form */
    }
    return (
      <>
        {isLogging ? (
          <WaitingDots size={"md"} marginTop={8} />
        ) : (
          <>
            {error && (
              <div className="mx-auto mt-8 w-[80vw] md:w-[50vw] lg:w-[30vw]">
                <MessageError message={error} />
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-8 rounded-lg w-[80vw] md:w-[50vw] lg:w-[30vw]"
            >
              <div className="card-body p-4">
                <p className="card-title mx-auto text-3xl xxl:text-4xl">Log in</p>
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">Email</span>
                  </div>
                  <input
                    type="email"
                    maxLength={40}
                    id="emailField"
                    value={email}
                    onChange={handleChangeEmail}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                    required
                  />
                </label>
                <label className="form-control w-full max-w-md mx-auto xxl:text-xl">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">Password</span>
                  </div>
                  <input
                    type="password"
                    minLength={9}
                    maxLength={20}
                    id="passwordField"
                    value={password}
                    onChange={handleChangePassword}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                    required
                  />
                  <div className="label"></div>
                </label>
                <p className="text-center">
                  <a
                    className="link xxl:text-xl"
                    onClick={() => handleClick(`forgotPassword`)}
                  >
                    Forgot password?
                  </a>
                </p>
                <p className="text-center xxl:text-xl">
                  Not a member yet?{" "}
                  <a className="link xxl:text-xl" onClick={() => handleClick(`signUp`)}>
                    Sign up
                  </a>
                </p>
                <div className="card-actions justify-end mt-4">
                  <button type="submit" className="btn bg-black text-white xxl:text-xl">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </>
    );
  }
}
