import { useNavigate } from "react-router-dom";
import { handleOpenModal } from "../../../utilis/handleOpenModal";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import { IAd } from "../../../interfaces/IAd";

interface Props {
  loggedProfileData: ILoggedProfile;
  adData: IAd;
}

export function AdDropdowns({ loggedProfileData, adData }: Props) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-between mx-auto w-[90vw] md:w-full">
      {/* Go back button - top left */}
      <button
        className="btn btn-sm bg-black text-white text-sm font-bold"
        onClick={handleGoBack}
      >
        Go back
      </button>
      {/* Dropdown - Ad options - top right */}
      {loggedProfileData.username === adData.username ||
      loggedProfileData.username === `admin` ? (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm bg-black text-white text-sm font-bold"
          >
            Ad options
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52"
          >
            {/* Hide ad */}
            {adData && loggedProfileData.username === adData.username ? (
              <li>
                <a
                  onClick={() => handleOpenModal(`hideAd`)}
                  className="text-sm font-bold py-2 text-white"
                >
                  {adData.visible ? "Hide Ad" : "Show Ad"}
                </a>
              </li>
            ) : null}
            {/* Deactivate ad */}
            <li>
              <a
                onClick={() => handleOpenModal(`deactivateAd`)}
                className="text-sm font-bold py-2 text-white"
              >
                {adData && adData.active ? `Deactivate` : `Activate`} Ad
              </a>
            </li>
            {loggedProfileData.username === "admin" ? (
              <li>
                <a
                  onClick={() => handleOpenModal(`deleteAd`)}
                  className="text-sm font-bold py-2 text-white"
                >
                  Delete Ad
                </a>
              </li>
            ) : null}
            {/* Edit ad */}
            {adData && loggedProfileData.username === adData.username ? (
              <li>
                <a
                  onClick={() => handleOpenModal(`editAd`)}
                  className="text-sm font-bold py-2 text-white"
                >
                  Edit Ad
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
