import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addProfileData,
  removeProfileData,
  addProfileAds,
} from "../../store/slices/profile";
import { removeLoggedProfileData } from "../../store/slices/loggedProfile";
import { changeProfileAdsNo } from "../../store/slices/profile";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { deleteAllProfileImages } from "../../utilis/deleteImagesFromDB/deleteAllProfileImages";
import { deleteAvatar } from "../../utilis/deleteImagesFromDB/deleteAvatar";
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

  const { profileData, profileAds, profileAdsNo } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Fetch user data
  useEffect(() => {
    if (isChecked) {
      fetchProfileData();
    }
  }, [isChecked, page, sort]);

  //Data fetch function
  const fetchProfileData = async () => {
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
      //Deleting avatar from Mongo DB
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/deleteAvatar/`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      //Deleting avatar from Cloudinary DB
      const deleteAvatarMessage: string = await deleteAvatar(
        loggedProfileData,
        profileData?.avatar.uploadedAvatar.publicID
      );
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
      //Deleting profile (and all ads) from Mongo DB
      await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${profileData?.id}`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      //Deleting all images associated with profile (avatar and ad`s images) from Cloudinary DB
      const deleteImageMessage: string = await deleteAllProfileImages(
        loggedProfileData,
        profileData,
        profileAds
      );
      navigate(`/redirect/admin/deleteUser-${deleteImageMessage}`);
    } catch (error) {
      catchErrors(error, setError);
    }
  };

  //Redirect to ad (after clicking `See more` button)
  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  //Sorting ads function
  const handleSorting = (id: string) => {
    setSort(id);
    setPage(1);
  };

  //Restarting error text in modal after clicking on X (exit) in modal
  const handleClickX = () => {
    setEditError("");
    setEditMessage("");
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
            loggedProfileData={loggedProfileData}
            profileData={profileData}
            profileAdsNo={profileAdsNo}
            error={error}
            setError={setError}
            message={message}
          />
          {/* Profile has ads */}
          {profileAds &&
          profileAds.length > 0 &&
          profileAds.length < 9999999 ? (
            <ProfileAds
              profileAds={profileAds}
              profileAdsNo={profileAdsNo}
              page={page}
              setPage={setPage}
              setSort={setSort}
              handleSeeMoreClick={handleSeeMoreClick}
              handleSorting={handleSorting}
            />
          ) : null}
          {/* No ads */}
          {profileAds.length === 0 || profileAds.length === 9999999 ? (
            <ProfileNoAds
              loggedProfileData={loggedProfileData}
              profileAds={profileAds}
            />
          ) : null}
        </div>

        {/* Modals */}
        {profileData && (
          <ProfileModals
            loggedProfileData={loggedProfileData}
            profileData={profileData}
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
