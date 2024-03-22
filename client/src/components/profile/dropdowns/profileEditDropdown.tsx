interface Props {
  handleOpenModal: (id: string) => void;
}

export function ProfileEditDropdown({ handleOpenModal }: Props) {
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
          className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52"
        >
          <li>
            <a
              onClick={() => handleOpenModal(`editAvatar`)}
              className="text-sm font-bold py-2 text-white"
            >
              Avatar
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editEmail`)}
              className="text-sm font-bold py-2 text-white"
            >
              Email
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editContact`)}
              className="text-sm font-bold py-2 text-white"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editLocationCountry`)}
              className="text-sm font-bold py-2 text-white"
            >
              Location and country
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOpenModal(`editPassword`)}
              className="text-sm font-bold py-2 text-white"
            >
              Password
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
