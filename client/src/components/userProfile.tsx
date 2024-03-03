import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { EditAvatar } from "./edit/user/editAvatar";
import { EditContact } from "./edit/user/editContact";
import { EditPassword } from "./edit/user/editPassword";
import { EditEmail } from "./edit/user/editEmail";
import { IUserData } from "../interfaces/IUserData";
import { useCreateAtToString } from "../hooks/useCreateAtToString";
import { useProfileAvatar } from "../hooks/useProfileAvatar";
import { store } from "../store";
import axios from "axios";

export function UserProfile() {
  const [profileData, setProfileData] = useState<IUserData | null>(null);
  const [openEditAvatar, setOpenEditAvatar] = useState<boolean>(false);
  const [openEditEmail, setOpenEditEmail] = useState<boolean>(false);
  const [openEditContact, setOpenEditContact] = useState<boolean>(false);
  const [openEditPassword, setOpenEditPassword] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const params = useParams();
  const createdAt = useCreateAtToString(profileData?.createdAt);
  const avatar = useProfileAvatar(profileData?.avatar);

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/profile/${params.id}`
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
    };
    fetchData();
    setIsLoaded(true);
  }, [params.id]);

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

  const handleBtnClick = (id: string) => {
    navigate(`/ad/${id}`);
  };

  if (!isLoaded) return <div>Loading...</div>;
  else {
    return (
      <>
        {error && <div className="text-red-500">{error}</div>}
        {profileData ? (
          <div className="border-black border-2 m-2 p-2">
            <p>Profile info:</p>
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
                      <p>Price: {ad.price}€</p>
                      <img
                        src={ad.images[0].imageUrl}
                        width={200}
                        height={200}
                        alt="adImage"
                      />
                      <button
                        className="btn"
                        onClick={() => handleBtnClick(ad.id)}
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
