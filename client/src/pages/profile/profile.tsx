import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../store";
import {
  addProfileData,
  removeProfileData,
  addProfileAds,
} from "../../store/slices/profile";
import { removeLoggedProfileData } from "../../store/slices/loggedProfile";
import { changeProfileAdsNo } from "../../store/slices/profile";
import { catchErrors } from "../../utilis/catchErrors";
import { WaitingDots } from "../../components/elements/waitingDots";
import { MessageError } from "../../components/elements/messages/messageError";
import { ProfileModals } from "../../components/profile/modals/profileModals";
import { ProfileAds } from "../../components/profile/info/profileAds";
import { ProfileNoAds } from "../../components/profile/messages/profileNoAds";
import { ProfileInfoBox } from "../../components/profile/info/profileInfoBox";
import axios from "axios";

export function Profile() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("-createdAt");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const { profileData, profileAds } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Fetch user data
  useEffect(() => {
    if (isChecked) {
      fetchData();
    }
  }, [isChecked, page, sort]);

  //Data fetch function
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/profile/${
          params.id
        }/?sort=${sort}&page=${(page - 1) * 5}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      dispatch(addProfileData({ ...response.data.user, ads: undefined }));
      dispatch(addProfileAds(response.data.user.ads));
      dispatch(changeProfileAdsNo(response.data.adsNo));
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  //Deleting avatar function
  const handleDeleteAvatar = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/deleteAvatar/`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      const deleteAvatarMessage: string = await deleteImage("deleteAvatar");
      setMessage(response.data.message + deleteAvatarMessage);
      dispatch(addProfileData(response.data.user));
    } catch (error) {
      catchErrors(error, setError);
    }
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
        dispatch(removeProfileData());
        dispatch(addProfileData(response.data.user));
      } else {
        localStorage.removeItem("userData");
        dispatch(removeLoggedProfileData());
        navigate(`/redirect/auth/deactivate`);
      }
    } catch (error) {
      catchErrors(error, setError);
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
      const deleteImageMessage: string = await deleteImage("deleteProfile");
      navigate(`/redirect/admin/deleteUser-${deleteImageMessage}`);
    } catch (error) {
      catchErrors(error, setError);
    }
  };

  //Delete images function (avatar and ad's images)
  const deleteImage = async (operation: string) => {
    let imagesDeleteList: string[] = [];

    //Adding avatar to delete list (if exist)
    if (profileData?.avatar.uploadedAvatar.publicID) {
      imagesDeleteList = [profileData?.avatar.uploadedAvatar.publicID];
    }

    //Adding all ad`s images (if user/admin is deleting profile)
    if (operation === `deleteProfile`) {
      profileAds.forEach((ad) => {
        ad.images.forEach((img) => {
          imagesDeleteList.push(img.publicID);
        });
      });
    }

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
      return operation === "deleteProfile" ? "allDeleted" : "";
    } catch (error) {
      return operation === "deleteProfile"
        ? "notAllDeleted"
        : " But maybe avatar is not deleted from database.";
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

  //Sorting function
  const handleSorting = (id: string) => {
    setSort(id);
    setPage(1);
  };

  if (!isChecked || !isLoaded) {
    {
      /* Loading user data */
    }
    return (
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
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
        <div className="pb-2 lg:flex">
          {/* Profile info box */}
          <ProfileInfoBox
            setError={setError}
            handleOpenModal={handleOpenModal}
            error={error}
            message={message}
          />
          {/* Profile has ads */}
          {profileAds &&
          profileAds.length > 0 &&
          profileAds.length < 9999999 ? (
            <ProfileAds
              page={page}
              setPage={setPage}
              setSort={setSort}
              handleSeeMoreClick={handleSeeMoreClick}
              handleSorting={handleSorting}
            />
          ) : null}
          {/* No ads */}
          {profileAds.length === 0 || profileAds.length === 9999999 ? (
            <ProfileNoAds />
          ) : null}
        </div>

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
            handleDeleteAvatar={handleDeleteAvatar}
          />
        )}
      </>
    );
  }
}
