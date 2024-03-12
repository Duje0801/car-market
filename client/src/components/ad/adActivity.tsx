import { useSelector } from "react-redux";
import { store } from "../../store";
import { MessageError } from "../elements/messages/messageError";

export function AdActivity() {
  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  return (
    <div className="flex flex-col gap-2">
      {/* If ad is not visible */}
      {adData &&
      !adData.visible &&
      (loggedProfileData.username === `admin` ||
        loggedProfileData.username === adData.username) ? (
        <div className="w-[90vw] mx-auto">
          <MessageError message={"This ad is not visible to other users"} />
        </div>
      ) : null}
      {/* If ad is not active */}
      {adData && !adData.active && loggedProfileData.username === `admin` ? (
        <div className="w-[90vw] mx-auto">
          <MessageError message={"This ad is deactivated"} />
        </div>
      ) : null}
    </div>
  );
}
