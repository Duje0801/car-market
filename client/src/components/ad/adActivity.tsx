import { useSelector } from "react-redux";
import { store } from "../../store";
import { MessageError } from "../elements/messages/messageError";
import { IAd } from "../../interfaces/IAd";

interface Props {
  adInfo: IAd;
}

export function AdActivity({ adInfo }: Props) {
  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  return (
    <div className="flex flex-col gap-2">
      {/* If ad is not visible */}
      {!adInfo.visible &&
      (data.username === `admin` || data.username === adInfo.username) ? (
        <div className="w-[90vw] mx-auto">
          <MessageError message={"This ad is not visible to other users"} />
        </div>
      ) : null}
      {/* If ad is not active */}
      {!adInfo.active && data.username === `admin` ? (
        <div className="w-[90vw] mx-auto">
          <MessageError message={"This ad is deactivated"} />
        </div>
      ) : null}
    </div>
  );
}
