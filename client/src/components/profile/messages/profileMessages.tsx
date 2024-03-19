import { useSelector } from "react-redux";
import { store } from "../../../store";
import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";

interface Props {
  error: string;
  message: string;
}

export function ProfileMessages({ error, message }: Props) {
  const { profileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );
  return (
    <>
      {/* Error */}
      {error && (
        <div className={`mx-auto w-full mb-2`}>
          <MessageError message={error} />
        </div>
      )}
      {/* Is user active */}
      {!profileData?.active && (
        <div className="mx-auto w-full mb-2">
          <MessageError message={"This profile is deactivated"} />
        </div>
      )}
      {/* Message */}
      {message && (
        <div className="mx-auto w-full mb-2">
          <MessageSuccessfully message={message} />
        </div>
      )}
    </>
  );
}
