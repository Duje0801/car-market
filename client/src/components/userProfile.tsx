import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EditAvatar } from "./edit/user/editAvatar";
import { EditContact } from "./edit/user/editContact";
import { EditPassword } from "./edit/user/editPassword";
import { EditEmail } from "./edit/user/editEmail";
import { IUserData } from "../interfaces/IUserData";
import { useCreateAtToString } from "../hooks/useCreateAtToString";
import { useProfileAvatar } from "../hooks/useProfileAvatar";
import { removeProfileData } from "../store/slices/profile";
import { store } from "../store";
import axios from "axios";

export function UserProfile() {
  const [profileData, setProfileData] = useState<IUserData | null>(null);
  const [openEditAvatar, setOpenEditAvatar] = useState<boolean>(false);
  const [openEditEmail, setOpenEditEmail] = useState<boolean>(false);
  const [openEditContact, setOpenEditContact] = useState<boolean>(false);
  const [openEditPassword, setOpenEditPassword] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const params = useParams();
  const createdAt = useCreateAtToString(profileData?.createdAt);
  const avatar = useProfileAvatar(profileData?.avatar);

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/profile/${params.id}`,
          {
            headers: {
              authorization: `Bearer ${data?.token}`,
            },
          }
        );
        setProfileData(response.data.user);
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
    if (isChecked) {
      fetchData();
    }
  }, [isChecked]);

  const handleEditAvatar = () => {
    return openEditAvatar ? setOpenEditAvatar(false) : setOpenEditAvatar(true);
  };

  const handleEditEmail = () => {
    return openEditEmail ? setOpenEditEmail(false) : setOpenEditEmail(true);
  };

  const handleEditContact = () => {
    return openEditContact
      ? setOpenEditContact(false)
      : setOpenEditContact(true);
  };

  const handleEditPassword = () => {
    return openEditPassword
      ? setOpenEditPassword(false)
      : setOpenEditPassword(true);
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/deactivate/${id}`,
        {
          headers: {
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      if (data.username === `admin`) setMessage(response.data.message);
      else {
        localStorage.removeItem("userData");
        dispatch(removeProfileData());
        setError(response.data.message);
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

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/user/delete/${id}`,
        {
          headers: {
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      setError(response.data.message);
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

  const handleSeeMoreClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  if (error) return <div className="text-red-500">{error}</div>;
  else if (!isLoaded) return <div>Loading...</div>;
  else {
    return (
      <>
        {message && <div className="text-red-500">{message}</div>}
        {profileData ? (
          <div className="border-black border-2 m-2 p-2">
            <p>
              <b>Profile info:</b>
            </p>
            {!profileData.active && (
              <p className="text-red-500">User is deactivated</p>
            )}
            <div>
              {data.username === `admin` &&
                profileData.username !== `admin` && (
                  <button
                    className="btn btn-error"
                    onClick={() => handleDeleteUser(profileData.id)}
                  >
                    Delete user
                  </button>
                )}
              {(data.username === `admin` ||
                data.username === profileData.username) &&
                profileData.username !== `admin` && (
                  <button
                    className="btn btn-error"
                    onClick={() => handleDeactivateUser(profileData.id)}
                  >
                    {profileData.active ? "Dea" : "A"}ctivate user
                  </button>
                )}
            </div>
            {avatar ? (
              <img src={avatar} alt="avatarImage"></img>
            ) : (
              <p>No avatar</p>
            )}
            {data.username === params.id && (
              <div>
                <button onClick={handleEditAvatar} className="btn">
                  Edit avatar
                </button>
              </div>
            )}
            {openEditAvatar && (
              <EditAvatar
                email={profileData.email}
                oldUploadedImagePublicID={
                  profileData.avatar.uploadedAvatar.publicID
                }
                setProfileData={setProfileData}
                setOpenEditAvatar={setOpenEditAvatar}
                setError={setError}
              />
            )}
            <p>Username: {profileData.username}</p>
            <p>Email: {profileData.email}</p>
            {data.username === params.id && (
              <div>
                <button onClick={handleEditEmail} className="btn">
                  Edit email
                </button>
              </div>
            )}
            {openEditEmail && (
              <EditEmail
                email={profileData.email}
                setProfileData={setProfileData}
                setOpenEditEmail={setOpenEditEmail}
                setError={setError}
              />
            )}
            <p>Seller type: {profileData.userType}</p>
            {profileData.contact && (
              <p>Contact (tel/mob): {profileData.contact}</p>
            )}
            {openEditContact && (
              <EditContact
                email={profileData.email}
                setProfileData={setProfileData}
                setOpenEditContact={setOpenEditContact}
                setError={setError}
              />
            )}
            {data.username === params.id && (
              <div>
                <button onClick={handleEditContact} className="btn">
                  Edit contact
                </button>
              </div>
            )}
            <p>Active since: {createdAt}</p>
            {data.username === params.id && (
              <div>
                <button onClick={handleEditPassword} className="btn">
                  Edit password
                </button>
              </div>
            )}
            {openEditPassword && (
              <EditPassword
                setOpenEditPassword={setOpenEditPassword}
                setError={setError}
              />
            )}
            {profileData.ads && profileData.ads.length > 0 ? (
              <div>
                Ads:
                {profileData.ads.map((ad, i) => {
                  return (
                    <div key={i} className="border-black border-2">
                      <p>Title: {ad.title}</p>
                      {!ad.active && (
                        <div className="text-red-500">
                          This ad is deactivated
                        </div>
                      )}
                      {!ad.visible && (
                        <div className="text-red-500">
                          This ad is hidden from other users
                        </div>
                      )}
                      <p>Price: {ad.price}€</p>
                      <img
                        src={ad.images[0].imageUrl}
                        width={200}
                        height={200}
                        alt="adImage"
                      />
                      <button
                        className="btn"
                        onClick={() => handleSeeMoreClick(ad.id)}
                      >
                        See more
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    );
  }
}
