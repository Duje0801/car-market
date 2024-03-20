import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";

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
      setMessage(`You have logged in as ${loggedProfileData.username}. Go to `);
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
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (loggedProfileData.username && params.id !== `logIn`) {
    {
      /* If the profile is already logged in */
    }
    return (
      <div className="mx-auto">
        <MessageError message={"You are logged in!"} />
      </div>
    );
  } else {
    {
      /* Show message */
    }
    return (
      <div className="flex justify-center mt-8">
        <p className="xxl:text-xl">
          {message}
          <a onClick={handleClick} className="link">
            {clickRedirect}
          </a>
          .
        </p>
      </div>
    );
  }
}
