import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { ErrorMessage } from "../../components/elements/errorMessage";
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

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
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

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setToken("");
      setIsSaving(false);
      setError("Passwords must be identical");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("token", token);

      await axios.post(
        "http://localhost:4000/api/v1/user/resetPassword",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
      setConfirmPassword("");
      setToken("");
      setIsSaving(false);
    }
  };

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
        <ErrorMessage text={"You are already logged in!"} />
      </main>
    );
  } else
    return (
      <main className="pb-4">
        {/* Waiting while the token is checked for validity */}
        {isSaving ? (
          <WaitingDots size={"md"} />
        ) : (
          <>
            {error && <ErrorMessage text={error} />}
            {/* Reset password form */}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw]"
            >
              <div className="card-body p-4">
                <p className="card-title text-3xl">Reset Password</p>
                {/* Email input */}
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
                {/* Password input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">New Password</span>
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
                </label>
                {/* Confirm password input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Confirm New Password</span>
                  </div>
                  <input
                    type="password"
                    minLength={9}
                    maxLength={20}
                    id="confirmPasswordField"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* Token input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Token</span>
                  </div>
                  <input
                    type="password"
                    minLength={1}
                    maxLength={20}
                    id="tokenField"
                    value={token}
                    onChange={handleChangeToken}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
                {/* Submit button */}
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
