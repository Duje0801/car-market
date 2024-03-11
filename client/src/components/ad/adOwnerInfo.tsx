import { useNavigate } from "react-router-dom";
import { useCreateAtToString } from "../../hooks/useCreateAtToString";
import { IAd } from "../../interfaces/IAd";

interface Props {
  adInfo: IAd;
}

export function AdOwnerInfo({ adInfo }: Props) {
  const navigate = useNavigate();
  const createdAt = useCreateAtToString(adInfo.createdAt);

  const handleRedirectToProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleClickSendMail = () => {
    if (adInfo.user) {
      window.location.href = `mailto:${adInfo.user[0].email}`;
    }
  };

  return (
    <div className="card bg-base-200 p-4 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw]">
      {/* Username */}
      <p
        onClick={() => handleRedirectToProfile(adInfo.username)}
        className="text-xl font-bold text-center"
      >
        {adInfo.user && adInfo.user[0].username}
      </p>
      <p className="text-center">Active since: {createdAt}</p>
      {/* Email */}
      {adInfo.user && adInfo.user[0].email ? (
        <p className="text-center" onClick={handleClickSendMail}>
          {adInfo.user[0].email}
        </p>
      ) : null}
      {/* Contact */}
      {adInfo.user && adInfo.user[0].contact ? (
        <p className="text-center">{adInfo.user[0].contact}</p>
      ) : null}
    </div>
  );
}
