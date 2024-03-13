import { useSelector } from "react-redux";
import { store } from "../../store";
import { MessageSuccessfully } from "../elements/messages/messageSuccessfully";
import { MessageError } from "../elements/messages/messageError";
import { IAd } from "../../interfaces/IAd";

interface Props {
  adData: IAd;
  error: string;
  message: string;
}

export function AdMessages({ error, adData, message }: Props) {
  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );
  return (
    <>
      {adData &&
      !adData.visible &&
      (loggedProfileData.username === `admin` ||
        loggedProfileData.username === adData.username) ? (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageError message={"This ad is not visible to other users"} />
        </div>
      ) : null}

      {!adData.active && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageError message={"This ad is deactivated"} />
        </div>
      )}
      {error && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageError message={error} />
        </div>
      )}
      {message && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageSuccessfully message={message} />
        </div>
      )}
    </>
  );
}
