import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { ErrorMessage } from "../../components/elements/errorMessage";
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

  const navigate = useNavigate();

  //Form data states changes
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      await axios.post(
        "http://localhost:4000/api/v1/user/forgotPassword",
        formData,
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

  //Click to next step, password restarting
  const handleClick = () => {
    navigate("/resetPassword");
  };

  if (!isChecked) {
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
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
  } else if (codeSended) {
    {
      /* Password reset link, once the code has been sent */
    }
    return (
      <main>
        <p className="text-center mx-auto mt-2 w-[90vw]">
          A recovery code has been sent to your email address. Go to{" "}
          <a onClick={handleClick} className="link">
            reset password page
          </a>
          .
        </p>
      </main>
    );
  } else {
    return (
      <main className="pb-4">
        {/* Waiting while code is sent to email */}
        {isSending ? (
          <WaitingDots size={"md"} marginTop={8} />
        ) : (
          <>
            {error && <ErrorMessage text={error} />}
            {/* Forgot password form */}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw]"
            >
              <div className="card-body p-4">
                <p className="card-title text-3xl">Forgot Password</p>
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text mt-4">
                      Please type your email:
                    </span>
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
                  <div className="label pt-1">
                    <span className="label-text-alt text-[0.6rem]">
                      A recovery code will be sent to your email.
                    </span>
                  </div>
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
}
