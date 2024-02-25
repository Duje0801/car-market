import React, { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store";
import { Hourglass } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function ForgotPassword() {
  //Form data states
  const [email, setEmail] = useState<string>("");

  //Other states
  const [isSending, setIsSending] = useState<boolean>(false);
  const [codeSended, setCodeSended] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const navigate = useNavigate()

  //Form data states changes
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSending(true);

    try {
      const data = new FormData();
      data.append("email", email);

      await axios.post(
        "http://localhost:4000/api/v1/user/forgotPassword",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCodeSended(true);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again later.");
      }
    } finally {
      setIsSending(false);
    }
  };

  //Next step, password restarting
  const handleClick = () => {
    navigate("/resetPassword")
  };

  if (!isChecked) return <div>Loading...</div>;
  else if (data.username) return <div>You are already logged in!</div>;
  else
    return (
      <>
        {!codeSended ? (
          <>
            <form onSubmit={handleSubmit} className="border-2 border-black m-4">
              <p>Forgot Password Form</p>
              <p>Please type your email:</p>
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
                <button type="submit" className="btn">
                  Submit
                </button>
              </div>
            </form>
            {isSending && (
              <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={["#306cce", "#72a1ed"]}
              />
            )}{" "}
          </>
        ) : (
          <div>
            <button onClick={handleClick} className="btn">
              Go to reset password page
            </button>
          </div>
        )}
      </>
    );
}
