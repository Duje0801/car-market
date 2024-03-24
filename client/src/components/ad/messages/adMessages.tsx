import { useIsAdOld } from "../../../hooks/useIsAdOld";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { MessageError } from "../../elements/messages/messageError";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  loggedProfileData: ILoggedProfile;
  adData: IAd;
  error: string;
  message: string;
}

export function AdMessages({
  loggedProfileData,
  adData,
  error,
  message,
}: Props) {
  //Checking is ad older than 180 days
  const isAdOld = adData?.createdAt && useIsAdOld(adData.createdAt);

  return (
    <>
      {/* Old ad */}
      {isAdOld && (
        <div className="mx-auto w-[90vw] mb-2 md:w-full">
          <MessageWarning message={"This ad is older than 180 days"} />
        </div>
      )}

      {/* Visible ad */}
      {adData &&
      !adData.visible &&
      (loggedProfileData.username === `admin` ||
        loggedProfileData.username === adData.username) ? (
        <div className="mx-auto w-[90vw] mb-2 md:w-full">
          <MessageError message={"This ad is not visible to other users"} />
        </div>
      ) : null}

      {/* Active ad */}
      {!adData?.active && (
        <div className="mx-auto w-[90vw] mb-2 md:w-full">
          <MessageError message={"This ad is deactivated"} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-auto w-[90vw] mb-2 md:w-full">
          <MessageError message={error} />
        </div>
      )}

      {/* Successfull change */}
      {message && (
        <div className="mx-auto w-[90vw] mb-2 md:w-full">
          <MessageSuccessfully message={message} />
        </div>
      )}
    </>
  );
}
