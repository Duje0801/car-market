import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { useCreateAtToString } from "../../../hooks/useCreateAtToString";
import { IoMail } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import { useProfileAvatar } from "../../../hooks/useProfileAvatar";

export function AdSellerInfo() {
  const { adData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.ad
  );

  const navigate = useNavigate();
  const createdAt = useCreateAtToString(adData?.createdAt);

  let avatar: string = "";
  if (adData?.user) {
    avatar = useProfileAvatar(adData?.user[0].avatar);
  }

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
      <div className={`lg:flex lg:gap-4 ${avatar ? `` : `w-fit mx-auto`}`}>
        {/* Seller avatar */}
        {avatar ? (
          <div className="lg:my-auto">
            <img
              src={avatar}
              alt="user-avatar"
              className="rounded-lg w-1/4 mx-auto my-2 min-w-32 cursor-pointer lg:my-auto lg:max-h-[25vh]"
              onClick={() => handleRedirectToProfile()}
            ></img>
          </div>
        ) : null}
        <div className={`my-auto text-center lg:flex lg:flex-col lg:ml-0 ${avatar ? `lg:text-left lg:mr-auto` : ``}`}>
          {/* Username */}
          <p
            onClick={() => handleRedirectToProfile()}
            className="text-lg font-bold cursor-pointer"
          >
            {adData?.user && adData?.user[0].username}
          </p>
          <p>Active since: {createdAt}</p>
          {/* Email */}
          <div className={`flex justify-center gap-2 lg:justify-start ${avatar ? `` : `w-fit mx-auto`}`}>
            <IoMail className="my-auto" />
            {adData?.user && adData?.user[0].email ? (
              <p className="cursor-pointer" onClick={handleClickSendMail}>
                {adData?.user[0].email}
              </p>
            ) : null}
          </div>
          {/* Contact */}
          <div className={`flex justify-center gap-2 lg:justify-start ${avatar ? `` : `w-fit mx-auto`}`}>
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
