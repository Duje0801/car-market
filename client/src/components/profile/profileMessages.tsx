import { MessageSuccessfully } from "../elements/messages/messageSuccessfully";
import { MessageError } from "../elements/messages/messageError";
import { IProfile } from "../../interfaces/IProfile";

interface Props {
  profileData: IProfile;
  error: string;
  message: string;
}

export function ProfileMessages({ error, profileData, message }: Props) {
  return (
    <>
      {error && (
        <div className="mx-auto w-[90vw]">
          <MessageSuccessfully message={error} />
        </div>
      )}
      {!profileData.active && (
        <div className="mx-auto w-[90vw]">
          <MessageError message={"This profile is deactivated"} />
        </div>
      )}
      {message && (
        <div className="mx-auto w-[90vw]">
          <MessageSuccessfully message={message} />
        </div>
      )}
    </>
  );
}
