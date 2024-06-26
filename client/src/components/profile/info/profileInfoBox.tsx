import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { handleOpenModal } from "../../../utilis/handleOpenModal";
import { ProfileEditDropdown } from "../dropdowns/profileEditDropdown";
import { useCreateAtToString } from "../../../hooks/useCreateAtToString";
import { useProfileAvatar } from "../../../hooks/useProfileAvatar";
import { ProfileMessages } from "../messages/profileMessages";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";
import { ILoggedProfile } from "../../../interfaces/ILoggedProfile";
import { IProfile } from "../../../interfaces/IProfile";

interface Props {
  loggedProfileData: ILoggedProfile;
  profileData: IProfile;
  profileAdsNo: number;
  error: string;
  message: string;
  setError: Dispatch<SetStateAction<string>>;
}

export function ProfileInfoBox({
  loggedProfileData,
  profileData,
  profileAdsNo,
  error,
  message,
}: Props) {
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
          <ProfileEditDropdown profileData={profileData} />
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
          <ProfileMessages
            profileData={profileData}
            error={error}
            message={message}
          />

          {/* Avatar */}
          <div className="card-body p-0">
            {avatar ? (
              <img
                src={avatar}
                alt="avatarImage"
                className="rounded-lg w-2/3 mx-auto sm:w-1/3 sm:min-w-36"
              />
            ) : null}

            {/* Username */}
            <div className="flex flex-col">
              <p className="text-center text-3xl text-bold xl:text-4xl">
                {profileData?.username}
              </p>
            </div>

            {/* Profile description */}
            <div className="flex flex-col">
              <p className="text-center text-md xxl:text-2xl">
                {profileData?.userType}
              </p>
              <p className="text-center text-md xxl:text-2xl">
                Active since: {createdAt}
              </p>
              <p className="text-center text-md xxl:text-2xl">
                {profileData?.location ? `${profileData?.location},` : ``}{" "}
                {profileData?.country}
              </p>
            </div>
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
                className="text-center text-md hover:cursor-pointer"
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

          {/* Buttons */}
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
    </>
  );
}
