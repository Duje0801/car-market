import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../store";
import { useCreateAtToString } from "../../hooks/useCreateAtToString";

export function AdOwnerInfo() {
  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  const navigate = useNavigate();
  const createdAt = useCreateAtToString(adData?.createdAt);

  const handleRedirectToProfile = () => {
    navigate(`/profile/${adData?.username}`);
  };

  const handleClickSendMail = () => {
    if (adData?.user) {
      window.location.href = `mailto:${adData?.user[0].email}`;
    }
  };

  return (
    <div className="card bg-base-200 p-4 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw]">
      {/* Username */}
      <p
        onClick={() => handleRedirectToProfile()}
        className="text-xl font-bold text-center"
      >
        {adData?.user && adData?.user[0].username}
      </p>
      <p className="text-center">Active since: {createdAt}</p>
      {/* Email */}
      {adData?.user && adData?.user[0].email ? (
        <p className="text-center" onClick={handleClickSendMail}>
          {adData?.user[0].email}
        </p>
      ) : null}
      {/* Contact */}
      {adData?.user && adData?.user[0].contact ? (
        <p className="text-center">{adData?.user[0].contact}</p>
      ) : null}
    </div>
  );
}
