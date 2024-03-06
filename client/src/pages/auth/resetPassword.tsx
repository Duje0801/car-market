import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { Hourglass } from "react-loader-spinner";
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
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);
      data.append("confirmPassword", confirmPassword);
      data.append("token", token);

      await axios.post(
        "http://localhost:4000/api/v1/user/resetPassword",
        data,
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

  if (!isChecked) return <div>Loading...</div>;
  else if (data.username) return <div>You are already logged in!</div>;
  else
    return (
      <>
        <form onSubmit={handleSubmit} className="border-2 border-black m-4">
          <p>Reset Password Form</p>
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
            <label htmlFor="confirmPasswordField">Confirm Password:</label>
            <input
              type="password"
              minLength={9}
              maxLength={20}
              id="confirmPasswordField"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              className="border-2 border-black"
              required
            />{" "}
          </div>
          <div>
            <label htmlFor="tokenField">Token:</label>
            <input
              type="password"
              minLength={1}
              maxLength={20}
              id="tokenField"
              value={token}
              onChange={handleChangeToken}
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
        {isSaving && (
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
