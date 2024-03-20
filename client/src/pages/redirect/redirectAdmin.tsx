import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";

export function RedirectAdmin() {
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
    if (paramsSplit[0] === `deleteUser` && paramsSplit[1] === `allDeleted`) {
      setMessage(
        `User is succesfully deleted. All ads, ad images and avatar too. Go to `
      );
      setClickRedirect(`the home page`);
    } else if (
      paramsSplit[0] === `deleteUser` &&
      paramsSplit[1] === `notAllDeleted`
    ) {
      setMessage(
        `User is succesfully deleted. Maybe avatar and ad's images are not deleted. Go to `
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
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (loggedProfileData.username !== `admin`) {
    {
      /* If the user is not admin */
    }
    return (
      <div className="mx-auto">
        <MessageError
          message={"You don't have permission to view this page!"}
        />
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
