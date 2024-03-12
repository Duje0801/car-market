import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../store";
import { addProfileData, removeProfileData } from "../../store/slices/profile";
import { removeLoggedProfileData } from "../../store/slices/loggedProfile";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { MessageWarning } from "../../components/elements/messages/messageWarning";
import { ProfileModals } from "../../components/profile/profileModals";
import { ProfileEditDropdown } from "../../components/profile/profileEditDropdown";
import { ProfileAds } from "../../components/profile/profileAds";
import { ProfileInfoBox } from "../../components/profile/profileInfoBox";
import { ProfileMessages } from "../../components/profile/profileMessages";
import axios from "axios";

export function Profile() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");

  const params = useParams();

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { profileData } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Fetch user data
  useEffect(() => {
    if (isChecked) {
      fetchData();
    }
  }, [isChecked]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/profile/${params.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      dispatch(addProfileData(response.data.user));
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again later.");
      }
    }
    setIsLoaded(true);
  };

  //Deactivate profile function
  const handleDeactivateProfile = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/deactivate/${profileData?.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      if (loggedProfileData.username === `admin`) {
        setMessage(response.data.message);
        dispatch(removeProfileData(response.data.user))
      } else {
        localStorage.removeItem("userData");
        dispatch(removeLoggedProfileData());
        navigate(`/redirect/auth/deactivate`);
      }
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  //Delete user function
  const handleDeleteProfile = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${profileData?.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      //Deleting all images associated with profile (avatar and ads images)
      const deleteImageMessage: string = await deleteImage();
      navigate(`/redirect/admin/deleteUser-${deleteImageMessage}`);
    } catch (error: any) {
      if (
        error?.response?.data?.status === "fail" &&
        typeof error?.response?.data?.message === `string`
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  //Delete images function (avatar and ad's images)
  const deleteImage = async () => {
    let imagesDeleteList: string[] = [];

    //Adding avatar to delete list (if exist)
    if (profileData?.avatar.uploadedAvatar.publicID) {
      imagesDeleteList = [profileData?.avatar.uploadedAvatar.publicID];
    }

    //Adding all ad`s images
    profileData?.ads?.forEach((ad) => {
      ad.images.forEach((img) => {
        imagesDeleteList.push(img.publicID);
      });
    });

    //Creating fetch for all images
    const promises = imagesDeleteList.map((publicID) =>
      axios.delete(
        `http://localhost:4000/api/v1/user/deleteImage/${publicID}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      )
    );

    try {
      //Deleting images
      await Promise.all(promises);
      return "allDeleted";
    } catch (error: any) {
      return "notAllDeleted";
    }
  };

  //Open modals
  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(
      `${id}Modal`
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  //Restarting error text after clicking on X (exit) in modal
  const handleClickX = () => {
    setEditError("");
    setEditMessage("");
  };

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  if (!isChecked || !isLoaded) {
    {
      /* Loading user data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (!profileData && isLoaded) {
    return (
      <div className="mx-auto w-[90vw]">
        <MessageError message={error} />
      </div>
    );
  } else if (profileData && isLoaded) {
    return (
      <>
        <main className="pb-2">
          {/*Dropdown menu*/}
          {loggedProfileData.username === params.id &&
          loggedProfileData.username !== `admin` ? (
            <ProfileEditDropdown handleOpenModal={handleOpenModal} />
          ) : null}

          {/* Profile deactivated message */}
          <ProfileMessages
            error={error}
            profileData={profileData}
            message={message}
          />

          {/* Profile info box */}
          <ProfileInfoBox
            profileData={profileData}
            setError={setError}
            handleOpenModal={handleOpenModal}
          />

          {/* Profile ads */}
          {profileData.ads && profileData.ads.length > 0 ? (
            <ProfileAds
              profileData={profileData}
              handleSeeMoreClick={handleSeeMoreClick}
            />
          ) : (
            <div className="mx-auto w-[90vw]">
              <MessageWarning message={"This user has no ads"} />
            </div>
          )}
        </main>

        {/* Modals */}
        {profileData && (
          <ProfileModals
            editError={editError}
            setEditError={setEditError}
            editMessage={editMessage}
            setEditMessage={setEditMessage}
            handleClickX={handleClickX}
            handleDeactivateProfile={handleDeactivateProfile}
            handleDeleteProfile={handleDeleteProfile}
          />
        )}
      </>
    );
  }
}
