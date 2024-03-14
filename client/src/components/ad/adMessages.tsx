import { useSelector } from "react-redux";
import { store } from "../../store";
import { useIsAdOld } from "../../hooks/useIsAdOld";
import { MessageSuccessfully } from "../elements/messages/messageSuccessfully";
import { MessageWarning } from "../elements/messages/messageWarning";
import { MessageError } from "../elements/messages/messageError";

interface Props {
  error: string;
  message: string;
}

export function AdMessages({ error, message }: Props) {
  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  //Checking is ad older than 180 days
  const isAdOld = adData?.createdAt && useIsAdOld(adData.createdAt);

  return (
    <>
      {/* Old ad */}
      {isAdOld && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageWarning message={"This ad is older than 180 days"} />
        </div>
      )}

      {/* Visible ad */}
      {adData &&
      !adData.visible &&
      (loggedProfileData.username === `admin` ||
        loggedProfileData.username === adData.username) ? (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageError message={"This ad is not visible to other users"} />
        </div>
      ) : null}

      {/* Active ad */}
      {!adData?.active && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageError message={"This ad is deactivated"} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageError message={error} />
        </div>
      )}

      {/* Successfull change */}
      {message && (
        <div className="mx-auto w-[90vw] mb-2">
          <MessageSuccessfully message={message} />
        </div>
      )}
    </>
  );
}
