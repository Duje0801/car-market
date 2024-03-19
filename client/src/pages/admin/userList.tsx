import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IProfile } from "../../interfaces/IProfile";
import { store } from "../../store";
import { catchErrors } from "../../utilis/catchErrors";
import { MessageError } from "../../components/elements/messages/messageError";
import { WaitingDots } from "../../components/elements/waitingDots";
import axios from "axios";

export function UserList() {
  const [users, setUsers] = useState<IProfile[]>([]);
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isChecked) {
      fetchData();
    }
  }, [isChecked, onlyActive, userSearchText]);

  const handleActiveUsersChange = () => {
    setOnlyActive(!onlyActive);
  };

  const handleInputSearch = (value: string) => {
    setUserSearchText(value);
  };

  const fetchData = async () => {
    try {
      let url: string = "/?";
      if (onlyActive) {
        url += "onlyActive=true";
      }
      if (userSearchText.length > 0) {
        url += `contains=${userSearchText}`;
      }

      const response = await axios.get(
        `http://localhost:4000/api/v1/user/admin/userList${
          url.length > 2 ? url : ""
        }`,
        {
          headers: {
            authorization: `Bearer ${loggedProfileData?.token}`,
          },
        }
      );
      const users = response.data.users.sort((a: IProfile, b: IProfile) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      });
      setUsers(users);
    } catch (error) {
      catchErrors(error, setError);
    }
    setIsLoaded(true);
  };

  const handleredirectProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  if (!isChecked || !isLoaded) {
    {
      /* Loading user list data */
    }
    return (
      <div>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </div>
    );
  } else if (isChecked && isLoaded && loggedProfileData.username !== `admin`) {
    {
      /* User don't have permission */
    }
    return (
      <div className="mt-2 mx-auto w-[90vw]">
        <MessageError message={"You don't have permission to see this page"} />
      </div>
    );
  } else if (isChecked && isLoaded && error) {
    {
      /* Error message */
    }
    return (
      <div className="mt-2 mx-auto w-[90vw]">
        <MessageError message={error} />
      </div>
    );
  } else if (isChecked && isLoaded && loggedProfileData.username === `admin`) {
    {
      /* User list with filters */
    }
    return (
      <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mb-4 rounded-lg w-[90vw] md:w-[75vw] lg:w-[60vw]">
        <form>
           {/* Search profile input */}
           <label className="form-control mx-auto w-full sm:w-1/2 lg:w-1/3">
            <div className="label p-0">
              <span className="label-text">Search profile</span>
            </div>
            <input
              type="text"
              maxLength={10}
              value={userSearchText}
              onChange={(e) => handleInputSearch(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>{" "}
          {/* Show only active users checkbox */}
          <div className="flex justify-center mb-2">
            <label>
              Show only active users
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={handleActiveUsersChange}
                className="ml-2"
              />
            </label>
          </div>
        </form>
        {users.length === 0 ? (
          <div className="mt-2 mx-auto w-[90vw]">
            {/* If no user matches the requested requirements  */}
            <MessageError
              message={"No user matches the requested requirements"}
            />
          </div>
        ) : (
          <table className="table">
            {/* User list table */}
            <thead>
              <tr>
                <th className="text-center">Username</th>
                <th className="text-center">Email</th>
                <th className="text-center">Active</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((userInfo, i) => {
                  if (userInfo.username === `admin`) return;
                  else
                    return (
                      <tr
                        onClick={() => handleredirectProfile(userInfo.username)}
                        key={i}
                      >
                        <td className="text-center">{userInfo.username}</td>
                        <td className="text-center">{userInfo.email}</td>
                        <td className="text-center">
                          {userInfo.active ? `Yes` : `No`}
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
