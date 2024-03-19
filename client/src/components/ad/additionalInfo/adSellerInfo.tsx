import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { useCreateAtToString } from "../../../hooks/useCreateAtToString";
import { IoMail } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";

export function AdSellerInfo() {
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
    <div className="bg-base-200 p-4 shadow-xl mx-auto rounded-lg w-[90vw] md:w-full lg:w-1/2 lg:ml-0 lg:mr-auto">
      <p className="text-xl font-bold text-center lg:mb-2">Seller Info:</p>
      <div className="lg:flex lg:gap-4">
        {/* Seller avatar */}
        <div className="lg:my-auto">
          <img
            src={
              (adData?.user &&
                adData?.user[0].avatar.uploadedAvatar.imageUrl) ||
              (adData?.user && adData?.user[0].avatar.avatarURL)
            }
            alt="user-avatar"
            className="w-1/4 mx-auto py-2 min-w-32 cursor-pointer lg:ml-auto lg:mr-0 lg:my-auto lg:h-auto lg:w-auto lg:max-h-[25vh]"
            onClick={() => handleRedirectToProfile()}
          ></img>
        </div>
        <div className="my-auto text-center lg:flex lg:flex-col lg:ml-0 lg:mr-auto lg:text-left">
          {/* Username */}
          <p
            onClick={() => handleRedirectToProfile()}
            className="text-lg font-bold cursor-pointer"
          >
            {adData?.user && adData?.user[0].username}
          </p>
          <p>Active since: {createdAt}</p>
          {/* Email */}
          <div className="flex justify-center gap-2 lg:justify-start">
            <IoMail className="my-auto" />
            {adData?.user && adData?.user[0].email ? (
              <p className="cursor-pointer" onClick={handleClickSendMail}>
                {adData?.user[0].email}
              </p>
            ) : null}
          </div>
          {/* Contact */}
          <div className="flex justify-center gap-2 lg:justify-start">
            <BsFillTelephoneFill className="my-auto" />
            {adData?.user && adData?.user[0].contact ? (
              <p>{adData?.user[0].contact}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
