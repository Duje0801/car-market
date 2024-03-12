import { useSelector } from "react-redux";
import { store } from "../../store";
import { IAd } from "../../interfaces/IAd";

interface Props {
  adInfo: IAd;
  handleOpenModal: (id: string) => void;
}

export function AdDropdowns({ adInfo, handleOpenModal }: Props) {
  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  return (
    <div className="flex justify-end mx-auto w-[90vw]">
      {/* Dropdown */}
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-sm my-2 bg-black text-white text-sm font-bold"
        >
          Ad options
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52"
        >
          {/* Hide ad */}
          {data.username === adInfo.username ? (
            <li>
              <a
                onClick={() => handleOpenModal(`hideAd`)}
                className="text-sm font-bold py-2 text-white"
              >
                {adInfo.visible ? "Hide Ad" : "Show Ad"}
              </a>
            </li>
          ) : null}
          {/* Deactivate ad */}
          <li>
            <a
              onClick={() => handleOpenModal(`deactivateAd`)}
              className="text-sm font-bold py-2 text-white"
            >
              {adInfo.active ? `Deactivate` : `Activate`} Ad
            </a>
          </li>
          {data.username === "admin" ? (
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
          {data.username === adInfo.username ? (
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
    </div>
  );
}
