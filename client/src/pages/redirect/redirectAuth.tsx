import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { ErrorMessage } from "../../components/elements/errorMessage";

export function RedirectAuth() {
  const [message, setMessage] = useState<string>("");
  const [clickRedirect, setClickRedirect] = useState<string>("");

  const params = useParams();
  const navigate = useNavigate();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  useEffect(() => {
    if (params.id === `logIn`) {
      setMessage(`You have logged in. Go to `);
      setClickRedirect(`the home page`);
    } else if (params.id === `signUp`) {
      setMessage(`Profile has been created. Go to `);
      setClickRedirect(`log in`);
    } else if (params.id === `resetPassword`) {
      setMessage(`The password has been successfully changed. Go to `);
      setClickRedirect(`log in`);
    } else if (params.id === `logOut`) {
      setMessage(`You have been succesfully logged out. Go to `);
      setClickRedirect(`the home page`);
    } else if (params.id === `deactivate`) {
      setMessage(`Your profile has been succesfully deactivated. Go to `);
      setClickRedirect(`the home page`);
    } else {
      setMessage(`Something went wrong. Go to `);
      setClickRedirect(`the home page`);
    }
  }, []);

  const handleClick = () => {
    if (params.id === `signUp` || params.id === `resetPassword`)
      navigate(`/logIn`);
    else navigate(`/`);
  };

  if (!isChecked) {
    {
      /* Loading profile data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (loggedProfileData.username && params.id !== `logIn`) {
    {
      /* If the profile is already logged in */
    }
    return (
      <main>
        <ErrorMessage text={"You are logged in!"} />
      </main>
    );
  } else {
    {
      /* Showing message */
    }
    return (
      <main>
        <p className="text-center mx-auto mt-2 w-[90vw]">
          {message}
          <a onClick={handleClick} className="link">
            {clickRedirect}
          </a>
          .
        </p>
      </main>
    );
  }
}
