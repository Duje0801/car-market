import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import axios from "axios";

export function ResetPassword() {
  //Form data states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");

  //Other states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const navigate = useNavigate();

  //Form data states changes
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("token", token);

      await axios.post(
        "https://car-market-production.up.railway.app/api/v1/user/resetPassword",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/redirect/auth/resetPassword");
    } catch (error) {
      catchErrors(error, setError);
      setPassword("");
      setConfirmPassword("");
      setToken("");
      setIsSaving(false);
    }
  };

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
    return (
      <>
        {/* Waiting while the token is checked for validity */}
        {isSaving ? (
          <WaitingDots size={"md"} marginTop={8} />
        ) : (
          <>
            {error && (
              <div className="mx-auto mt-8 w-[80vw] md:w-[50vw] lg:w-[30vw]">
                <MessageError message={error} />
              </div>
            )}
            {/* Reset password form */}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-8 rounded-lg w-[80vw] md:w-[50vw] lg:w-[30vw]"
            >
              <div className="card-body p-4">
                <p className="card-title mx-auto text-3xl xxl:text-4xl">
                  Reset Password
                </p>
                {/* Email input */}
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
                {/* Password input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">New Password</span>
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
                </label>
                {/* Confirm password input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">
                      Confirm New Password
                    </span>
                  </div>
                  <input
                    type="password"
                    minLength={9}
                    maxLength={20}
                    id="confirmPasswordField"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                    required
                  />
                </label>
                {/* Token input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">Token</span>
                  </div>
                  <input
                    type="password"
                    minLength={1}
                    maxLength={20}
                    id="tokenField"
                    value={token}
                    onChange={handleChangeToken}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                    required
                  />
                </label>
                {/* Submit button */}
                <div className="card-actions justify-end mt-4">
                  <button
                    type="submit"
                    className="btn bg-black text-white xxl:text-xl"
                  >
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
