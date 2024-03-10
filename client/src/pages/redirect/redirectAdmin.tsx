import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { WaitingDots } from "../../components/elements/waitingDots";
import { ErrorMessage } from "../../components/elements/errorMessage";

export function RedirectAdmin() {
  const [message, setMessage] = useState<string>("");
  const [clickRedirect, setClickRedirect] = useState<string>("");

  const params = useParams();
  const navigate = useNavigate();

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  let paramsSplit: string[];
  if (params.id) {
    paramsSplit = params.id.split("-");
  }

  useEffect(() => {
    if (paramsSplit[0] === `deleteUser` && paramsSplit[1] === `allDeleted`) {
      setMessage(
        `User is succesfully deleted. All ads, ad images and avatar. Go to `
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
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (data.username !== `admin`) {
    {
      /* If the user is not admin */
    }
    return (
      <main>
        <ErrorMessage text={"You don't have permission to view this page!"} />
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
