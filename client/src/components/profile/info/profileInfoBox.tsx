import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../../../store";
import { ProfileEditDropdown } from "../dropdowns/profileEditDropdown";
import { useCreateAtToString } from "../../../hooks/useCreateAtToString";
import { useProfileAvatar } from "../../../hooks/useProfileAvatar";
import { ProfileMessages } from "../messages/profileMessages";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";

interface Props {
  error: string;
  message: string;
  setError: Dispatch<SetStateAction<string>>;
  handleOpenModal: (id: string) => void;
}

export function ProfileInfoBox({
  error,
  message,
  handleOpenModal,
}: Props) {
  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { profileData, profileAdsNo } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const params = useParams();

  const createdAt = useCreateAtToString(profileData?.createdAt);
  const avatar = useProfileAvatar(profileData?.avatar);

  //Open send mail
  const handleClickSendMail = () => {
    window.location.href = `mailto:${profileData?.email}`;
  };

  return (
    <>
      <div className="lg:w-1/3">
        {/*Dropdown menu*/}
        {loggedProfileData.username === params.id &&
        loggedProfileData.username !== `admin` ? (
          <ProfileEditDropdown handleOpenModal={handleOpenModal} />
        ) : null}

        {/* Profile info box */}
        <div
          className={`card bg-base-200 p-4 gap-2 shadow-xl mx-auto mb-4 rounded-lg w-[90vw] sm:w-[66vw] lg:w-2/3 lg:ml-auto lg:mr-4 ${
            loggedProfileData.username !== params.id &&
            (profileAdsNo !== 0 || profileAdsNo >= 9999999)
              ? "mt-2 lg:mt-10"
              : "mt-0"
          }`}
        >
          {/* Profile messages */}
          <ProfileMessages error={error} message={message} />

          {/* Avatar */}
          <div className="card-body p-4">
            {avatar ? (
              <img
                src={avatar}
                alt="avatarImage"
                className="avatar rounded w-2/3 mx-auto sm:w-1/3 sm:min-w-36"
              />
            ) : null}

            {/* Username and profile description */}
            <div>
              <p className="text-center text-3xl text-bold xl:text-4xl">
                {profileData?.username}
              </p>
              <p className="text-center text-md xxl:text-2xl">
                {profileData?.userType}, Active since: {createdAt}
              </p>
            </div>

            {/* Contact data */}
            <div>
              <p className="text-center text-md font-bold xxl:text-2xl">
                Contact:
              </p>
              {/* Mail */}
              <div className="flex justify-center gap-2 xxl:text-2xl">
                <IoMail className="my-auto" />
                <span
                  className="text-center text-md"
                  onClick={handleClickSendMail}
                >
                  {profileData?.email}
                </span>
              </div>
              {/* Tel. number */}
              <div className="flex justify-center gap-2 xxl:text-2xl">
                <BsFillTelephoneFill className="my-auto" />
                {profileData?.contact && (
                  <span className="text-md w-fit">{profileData.contact}</span>
                )}
              </div>
            </div>

            {/* Open modal buttons */}
            {/* De/activate profile */}
            {(loggedProfileData.username === `admin` ||
              loggedProfileData.username === profileData?.username) &&
              profileData?.username !== `admin` && (
                <button
                  className="btn btn-error mx-auto w-full sm:w-2/3 lg:w-full xxl:text-xl xl:w-2/3"
                  onClick={() => handleOpenModal(`deactivateProfile`)}
                >
                  {profileData?.active ? "Dea" : "A"}ctivate profile
                </button>
              )}
            {/* Delete profile */}
            {loggedProfileData.username === `admin` &&
              profileData?.username !== `admin` && (
                <button
                  className="btn btn-error mx-auto w-full sm:w-2/3 lg:w-full xxl:text-xl xl:w-2/3"
                  onClick={() => handleOpenModal(`deleteProfile`)}
                >
                  Delete profile
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
