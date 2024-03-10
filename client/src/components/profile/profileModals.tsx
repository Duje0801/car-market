import { Dispatch, SetStateAction } from "react";
import { EditAvatar } from "./edit/editAvatar";
import { EditContact } from "./edit/editContact";
import { EditEmail } from "./edit/editEmail";
import { EditPassword } from "./edit/editPassword";
import { IUserData } from "../../interfaces/IUserData";

interface Props {
  profileData: IUserData;
  setProfileData: Dispatch<SetStateAction<IUserData | null>>;
  editError: string;
  setEditError: Dispatch<SetStateAction<string>>;
  editMessage: string;
  setEditMessage: Dispatch<SetStateAction<string>>;
  handleClickX: () => void;
  handleDeactivateProfile: () => void;
  handleDeleteProfile: () => void;
}

export function ProfileModals({
  profileData,
  setProfileData,
  editError,
  setEditError,
  editMessage,
  setEditMessage,
  handleClickX,
  handleDeactivateProfile,
  handleDeleteProfile,
}: Props) {
  return (
    <>
      {/* Edit Avatar modal */}
      <dialog id="editAvatarModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={handleClickX}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Edit Avatar</h3>
          <EditAvatar
            email={profileData.email}
            oldUploadedImagePublicID={
              profileData.avatar.uploadedAvatar.publicID
            }
            setProfileData={setProfileData}
            editError={editError}
            setEditError={setEditError}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleClickX={handleClickX}
          />
        </div>
      </dialog>

      {/* Edit Email modal */}
      <dialog id="editEmailModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={handleClickX}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Edit Email</h3>
          <EditEmail
            email={profileData.email}
            setProfileData={setProfileData}
            editError={editError}
            setEditError={setEditError}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleClickX={handleClickX}
          />
        </div>
      </dialog>

      {/* Edit Contact modal */}
      <dialog id="editContactModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={handleClickX}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Edit Contact</h3>
          <EditContact
            email={profileData.email}
            setProfileData={setProfileData}
            editError={editError}
            setEditError={setEditError}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleClickX={handleClickX}
          />
        </div>
      </dialog>

      {/* Edit Password modal */}
      <dialog id="editPasswordModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={handleClickX}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">Edit Password</h3>
          <EditPassword
            email={profileData.email}
            editError={editError}
            setEditError={setEditError}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleClickX={handleClickX}
          />
        </div>
      </dialog>

      {/* Deactivate profile modal */}
      <dialog id="deactivateProfileModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={handleClickX}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to {profileData.active ? "de" : ""}
            activate {profileData.username}?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button onClick={handleClickX} className="btn w-full">
                No
              </button>
            </form>
            <form method="dialog">
              <button
                onClick={handleDeactivateProfile}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Delete profile modal */}
      <dialog id="deleteProfileModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              onClick={handleClickX}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-2">
            Are you sure you want to delete {profileData.username}?
          </h3>
          <div className="flex flex-col gap-2">
            <form method="dialog">
              <button onClick={handleClickX} className="btn w-full">
                No
              </button>
            </form>
            <form method="dialog">
              <button
                onClick={handleDeleteProfile}
                className="btn btn-error w-full"
              >
                Yes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
