import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProfileData } from "../../store/slices/profile";
import { store } from "../../store";
import { userTypes as userTypesList } from "../../data/userTypes";
import { IProfileData } from "../../interfaces/IProfileData";
import { WaitingDots } from "../../components/elements/waitingDots";
import { ErrorMessage } from "../../components/elements/errorMessage";
import axios from "axios";

export function SignUp() {
  //Form data states
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [userType, setUserType] = useState<string>("");

  //Other states
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Form data states changes
  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

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

  const handleChangeContact = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact(event.target.value);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSigningUp(true);

    if (password !== confirmPassword) {
      setIsSigningUp(false);
      setPassword("");
      setConfirmPassword("");
      setError("Passwords must be identical");
      window.scrollTo(0, 0);
      return;
    }

    try {
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      data.append("confirmPassword", confirmPassword);
      data.append("contact", contact);
      data.append("userType", userType);

      const response = await axios.post(
        "http://localhost:4000/api/v1/user/signUp",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const profileData: IProfileData = response.data.userData;
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
      setConfirmPassword("");
    }
    setIsSigningUp(false);
  };

  {
    /* Loading user data */
  }
  if (!isChecked)
    return (
      <main>
        <WaitingDots size={"md"} />{" "}
      </main>
    );
  else if (data.username) {
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
        {isSigningUp ? (
          <WaitingDots size={"md"} />
        ) : (
          <>
            {error && <ErrorMessage text={error} />}
            {/* Sign Up form */}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 rounded-lg w-[90vw]"
            >
              <div className="card-body p-4">
                <p className="card-title text-3xl">Sign Up</p>
                {/* Username input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Username</span>
                  </div>
                  <input
                    type="text"
                    minLength={3}
                    maxLength={20}
                    id="usernameField"
                    value={username}
                    onChange={handleChangeUsername}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                </label>
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
                  <div className="label"></div>
                </label>
                {/* Password input */}
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
                {/* Confirm Password input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Confirm Password</span>
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
                  <div className="label"></div>
                </label>
                {/* Contact input */}
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Contact (Mob/Tel)</span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    id="contactField"
                    value={contact}
                    onChange={handleChangeContact}
                    className="input input-bordered w-full max-w-xs"
                    required
                  />
                  <div className="label pt-1">
                    <span className="label-text-alt text-[0.6rem]">
                      Contact number can contain only numbers, +, /, ( and )
                    </span>
                  </div>
                </label>
                {/* User type radio */}
                <div>
                  <label className="text-sm">User type:</label>
                  {userTypesList.map((type) => (
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text text-sm">{type}</span>
                        <input
                          type="radio"
                          id={type}
                          name="user_type"
                          value={type}
                          checked={userType === type}
                          onChange={handleOptionChange}
                          className="radio checked:bg-black"
                          required
                        />
                      </label>
                    </div>
                  ))}
                </div>
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
