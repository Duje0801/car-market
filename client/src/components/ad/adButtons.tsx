import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { IAd } from "../../interfaces/IAd";

interface Props {
  adInfo: IAd | null;
  handleOpenModal: (id: string) => void;
}

export function AdButtons({ adInfo, handleOpenModal }: Props) {
  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const params = useParams();
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/editAd/${params.id}`);
  };

  return (
    <>
      {/* Hide ad button */}
      {adInfo &&
      adInfo.user &&
      adInfo.active &&
      data.username === adInfo.user[0].username ? (
        <div>
          <button
            className="btn btn-error w-full"
            onClick={() => handleOpenModal(`hideAd`)}
          >
            {adInfo.visible ? "Hide Ad" : "Show Ad"}
          </button>
        </div>
      ) : null}
      {/* Deactivate ad button */}
      {adInfo &&
      adInfo.user &&
      (data.username === adInfo.user[0].username ||
        data.username === "admin") ? (
        <div>
          <button
            className="btn btn-error w-full"
            onClick={() => handleOpenModal(`deactivateAd`)}
          >
            {adInfo.active ? `Deactivate` : `Activate`} Ad
          </button>
        </div>
      ) : null}
      {/* Delete ad button */}
      {data.username === "admin" ? (
        <div>
          <button
            className="btn btn-error w-full"
            onClick={() => handleOpenModal(`deleteAd`)}
          >
            Delete Ad
          </button>
        </div>
      ) : null}
      {/* Edit ad button */}
      {adInfo && data.username === adInfo.username ? (
        <div>
          <button
            className="btn bg-black text-white w-full"
            onClick={() => handleEditClick()}
          >
            Edit
          </button>
        </div>
      ) : null}
    </>
  );
}
