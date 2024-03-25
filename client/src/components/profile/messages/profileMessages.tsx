import { MessageSuccessfully } from "../../elements/messages/messageSuccessfully";
import { MessageError } from "../../elements/messages/messageError";
import { IProfile } from "../../../interfaces/IProfile";

interface Props {
  profileData:IProfile;
  error: string;
  message: string;
}

export function ProfileMessages({ profileData, error, message }: Props) {
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
