import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";

export function RedirectAd() {
  const [message, setMessage] = useState<string>("");
  const [clickRedirect, setClickRedirect] = useState<string>("");

  const params = useParams();
  const navigate = useNavigate();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  let paramsSplit: string[];
  if (params.id) {
    paramsSplit = params.id.split("-");
  }

  useEffect(() => {
    if (params.id === `new`) {
      setMessage(`Ad is succesfully created. Go to `);
      setClickRedirect(`the home page`);
    } else if (params.id === `deactivate`) {
      setMessage(`Ad has been succesfully deactivated. Go to `);
      setClickRedirect(`the home page`);
    } else if (
      paramsSplit[0] === `deleteAd` &&
      paramsSplit[1] === `allDeleted`
    ) {
      setMessage(`Ad is succesfully deleted. All ad images too. Go to `);
      setClickRedirect(`the home page`);
    } else if (
      paramsSplit[0] === `deleteAd` &&
      paramsSplit[1] === `notAllDeleted`
    ) {
      setMessage(
        `Ad is succesfully deleted. Maybe some ad's images are not deleted. Go to `
      );
      setClickRedirect(`the home page`);
    } else {
      setMessage(`Something went wrong. Go to `);
      setClickRedirect(`the home page`);
    }
  }, []);

  const handleClick = () => {
    navigate(`/`);
  };

  if (!isChecked) {
    {
      /* Loading user data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (!loggedProfileData.username) {
    {
      /* If the user is already logged in */
    }
    return (
      <main className="mx-auto w-[90vw]">
        <MessageError
          message={"You don't have permission to view this page!"}
        />
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
