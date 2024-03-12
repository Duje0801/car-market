import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { useCreateAtToString } from "../../hooks/useCreateAtToString";
import { useProfileAvatar } from "../../hooks/useProfileAvatar";
import { IProfile } from "../../interfaces/IProfile";
import { store } from "../../store";

interface Props {
  profileData: IProfile;
  setError: Dispatch<SetStateAction<string>>;
  handleOpenModal: (id: string) => void;
}

export function ProfileInfoBox({ profileData, handleOpenModal }: Props) {
  const { loggedProfileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const createdAt = useCreateAtToString(profileData?.createdAt);
  const avatar = useProfileAvatar(profileData?.avatar);

  //Open send mail
  const handleClickSendMail = () => {
    window.location.href = `mailto:${profileData?.email}`;
  };

  return (
    <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw]">
      {" "}
      <div className="card-body p-4">
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="avatarImage"
            className="avatar rounded w-2/3 mx-auto"
          />
        ) : null}

        {/* Username and description */}
        <div>
          <p className="text-center text-3xl text-bold">
            {profileData.username}
          </p>
          <p className="text-center text-md">
            {profileData.userType}, Active since: {createdAt}
          </p>
        </div>

        {/* Contact data */}
        <div>
          <p className="text-center text-md font-bold">Contact:</p>
          <p className="text-center text-md" onClick={handleClickSendMail}>
            {profileData.email}
          </p>
          {profileData?.contact && (
            <p className="text-center text-md">{profileData.contact}</p>
          )}
        </div>
        {(loggedProfileData.username === `admin` ||
          loggedProfileData.username === profileData.username) &&
          profileData.username !== `admin` && (
            <button
              className="btn btn-error w-full"
              onClick={() => handleOpenModal(`deactivateProfile`)}
            >
              {profileData.active ? "Dea" : "A"}ctivate profile
            </button>
          )}
        {loggedProfileData.username === `admin` &&
          profileData.username !== `admin` && (
            <button
              className="btn btn-error"
              onClick={() => handleOpenModal(`deleteProfile`)}
            >
              Delete profile
            </button>
          )}
      </div>
    </div>
  );
}
