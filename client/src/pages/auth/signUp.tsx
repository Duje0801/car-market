import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { userTypes as userTypesList } from "../../data/userTypes";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { countries as countriesList } from "../../data/countries";
import axios from "axios";

export function SignUp() {
  //Form data states
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [userType, setUserType] = useState<string>("");

  //Other states
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

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

  const handleChangeLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(event.target.value);
  };

  //Submit function
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("contact", contact);
      formData.append("location", location);
      formData.append("country", country);
      formData.append("userType", userType);

      await axios.post("http://localhost:4000/api/v1/user/signUp", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/redirect/auth/signUp");
    } catch (error) {
      catchErrors(error, setError);
      setPassword("");
      setConfirmPassword("");
    }
    setIsSigningUp(false);
  };

  if (!isChecked) {
    {
      /* Loading user data */
    }
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
  } else
    return (
      <>
        {isSigningUp ? (
          <WaitingDots size={"md"} marginTop={8} />
        ) : (
          <>
            {error && (
              <div className="mx-auto mt-8 w-[80vw] md:w-[50vw] lg:w-[30vw]">
                <MessageError message={error} />
              </div>
            )}
            {/* Sign Up form */}
            <form
              onSubmit={handleSubmit}
              className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-8 rounded-lg w-[80vw] md:w-[50vw] lg:w-[30vw]"
            >
              <div className="card-body p-4">
                <p className="card-title mx-auto text-3xl xxl:text-4xl">
                  Sign Up
                </p>
                {/* Username input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">Username</span>
                  </div>
                  <input
                    type="text"
                    minLength={3}
                    maxLength={20}
                    id="usernameField"
                    value={username}
                    onChange={handleChangeUsername}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                    required
                  />
                </label>
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
                  <div className="label"></div>
                </label>
                {/* Password input */}
                <label className="form-control w-full max-w-md mx-auto">
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
                {/* Confirm Password input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">
                      Confirm Password
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
                  <div className="label"></div>
                </label>
                {/* Contact input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">
                      Contact (Mob/Tel)
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    id="contactField"
                    value={contact}
                    onChange={handleChangeContact}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                    required
                  />
                  <div className="label pt-1">
                    <span className="label-text-alt text-[0.6rem] xxl:text-lg">
                      Contact number can contain only numbers, +, /, ( and )
                    </span>
                  </div>
                </label>
                {/* Location input */}
                <label className="form-control w-full max-w-md mx-auto">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">Location</span>
                  </div>
                  <input
                    type="text"
                    minLength={3}
                    maxLength={20}
                    id="locationField"
                    value={location}
                    onChange={handleChangeLocation}
                    className="input input-bordered w-full max-w-md xxl:text-xl"
                  />
                </label>
                {/* Country select */}
                <label className="form-control w-full mx-auto max-w-lg xxl:max-w-2xl">
                  <div className="label p-0">
                    <span className="label-text xxl:text-xl">Country</span>
                  </div>
                  <select
                    value={country}
                    onChange={handleSelectCountry}
                    className="input input-bordered w-full xxl:text-xl"
                    required
                  >
                    <option key={0}></option>
                    {countriesList.map((c, i) => {
                      return (
                        <option key={i + 1} value={c}>
                          {c}
                        </option>
                      );
                    })}
                  </select>
                </label>
                {/* User type radio */}
                <div>
                  <div className="flex justify-center">
                    <label className="text-sm xxl:text-xl">User type:</label>
                  </div>
                  {userTypesList.map((type, i) => (
                    <div key={i} className="form-control mx-auto max-w-md">
                      <label className="label cursor-pointer">
                        <span className="label-text text-sm xxl:text-xl">
                          {type}
                        </span>
                        <input
                          type="radio"
                          id={type}
                          key={i}
                          name="user_type"
                          value={type}
                          checked={userType === type}
                          onChange={handleOptionChange}
                          className="radio checked:bg-black xxl:text-xl"
                          required
                        />
                      </label>
                    </div>
                  ))}
                </div>
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
