import { MessageWarning } from "../elements/messages/messageWarning";
import { MessageError } from "../elements/messages/messageError";
import { useIsAdOld } from "../../hooks/useIsAdOld";
import { IAd } from "../../interfaces/IAd";

interface Props {
  ad: IAd;
}

export function AdDisplayMessages({ ad }: Props) {
  const adDate = useIsAdOld(ad.createdAt);

  return (
    <>
      {/* Old ad */}
      {adDate && (
        <div className="mx-auto w-full pb-2 md:mt-0">
          <MessageWarning message={"This ad is older than 180 days"} />
        </div>
      )}
      {/* Visibility message */}
      {!ad.visible && (
        <div className="mx-auto w-full pb-2 md:mt-0">
          <MessageError message={"This ad is hidden from other users"} />
        </div>
      )}
      {/* Deactivated message */}
      {!ad.active && (
        <div className="mx-auto w-full pb-2 md:mt-0">
          <MessageError message={"This ad is deactivated"} />
        </div>
      )}
    </>
  );
}
