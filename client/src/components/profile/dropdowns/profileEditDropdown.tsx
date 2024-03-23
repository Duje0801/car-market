import { useSelector } from "react-redux";
import { store } from "../../../store";

interface Props {
  handleOpenModal: (id: string) => void;
}

export function ProfileEditDropdown({ handleOpenModal }: Props) {
  const { profileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  return (
    <div className="flex justify-end mx-auto w-[90vw] mb-2 sm:w-[66vw] lg:w-2/3 lg:ml-auto lg:mr-4">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-sm my-auto bg-black text-white text-sm font-bold xl:text-xl"
        >
          Edit profile
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-64"
        >
          <li>
            <a
              onClick={() => handleOpenModal(`editAvatar`)}
              className="text-sm font-bold py-2 text-white"
            >
              Edit avatar
            </a>
          </li>
          {(profileData?.avatar.avatarURL ||
            profileData?.avatar.uploadedAvatar.imageUrl) && (
            <li>
              <a
                onClick={() => handleOpenModal(`deleteAvatar`)}
                className="text-sm font-bold py-2 text-white"
              >
                Delete avatar
              </a>
            </li>
          )}
          <li>
            <a
              onClick={() => handleOpenModal(`editEmail`)}
              className="text-sm font-bold py-2 text-white"
            >
              Edit email
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editContact`)}
              className="text-sm font-bold py-2 text-white"
            >
              Edit contact
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editLocationCountry`)}
              className="text-sm font-bold py-2 text-white"
            >
              Edit location and country
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editPassword`)}
              className="text-sm font-bold py-2 text-white"
            >
              Edit password
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
