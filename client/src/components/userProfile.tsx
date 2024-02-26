import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCreateAtToString } from "../hooks/useCreateAtToString";
import { useProfileAvatar } from "../hooks/useProfileAvatar";
import { IUserData } from "../interfaces/IUserData";
import { store } from "../store";
import axios from "axios";

export function UserProfile() {
  const [profileData, setProfileData] = useState<IUserData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const params = useParams();
  const createdAt = useCreateAtToString(profileData?.createdAt);
  const avatar = useProfileAvatar(profileData?.avatar);

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/profile/${params.id}`
        );
        console.log(response)
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
    if (data.username) {
      fetchData();
    }
    setIsLoaded(true);
  }, [data.username, params.id]);

  const handleEditData = () => {};

  if (!isLoaded) return <div>Loading...</div>;
  else if (!data.username) {
    return <div>Only logged in users can see profile</div>;
  } else {
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
            <p>Username: {profileData.username}</p>
            <p>Email: {profileData.email}</p>
            <p>Seller type: {profileData.userType}</p>
            {profileData.contact && (
              <p>Contact (tel/mob): {profileData.contact}</p>
            )}
            <p>Active since: {createdAt}</p>
            {data.username === params.id && (
              <div>
                <button onClick={handleEditData} className="btn">
                  Edit data
                </button>
              </div>
            )}
          </div>
        ) : null}
      </>
    );
  }
}
