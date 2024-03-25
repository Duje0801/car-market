import { useParams } from "react-router-dom";
import { MessageWarning } from "../../elements/messages/messageWarning";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  loggedProfileData: ILoggedProfile;
  profileAds: IAd[];
}

export function ProfileNoAds({ loggedProfileData, profileAds }: Props) {
  const params = useParams();

  return (
    <div className="lg:w-2/3">
      {/* Profile has no ads */}
      {profileAds && profileAds.length === 0 ? (
        <div
          className={`mx-auto w-[90vw] sm:w-[66vw] lg:w-5/6 lg:mx-auto ${
            params.id === loggedProfileData.username ? "mt-10" : ""
          }`}
        >
          <MessageWarning message={"This user has no ads"} />
        </div>
      ) : null}
      {/* Can't get the total number of profile ads */}
      {profileAds && profileAds.length === 9999999 ? (
        <div
          className={`mx-auto w-[90vw] sm:w-[66vw] lg:w-5/6 lg:mx-auto ${
            params.id === loggedProfileData.username ? "mt-10" : ""
          }`}
        >
          <MessageWarning
            message={"Can't get all ads data, please try again."}
          />
        </div>
      ) : null}
    </div>
  );
}
