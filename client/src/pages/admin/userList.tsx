import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IProfile } from "../../interfaces/IProfile";
import { store } from "../../store";
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

  const handleredirectProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  if (!isChecked || !isLoaded) {
    {
      /* Loading user list data */
    }
    return (
      <main>
        <WaitingDots size={"md"} marginTop={8} />{" "}
      </main>
    );
  } else if (isChecked && isLoaded && loggedProfileData.username !== `admin`) {
    {
      /* User don't have permission */
    }
    return (
      <main className="mt-2 mx-auto w-[90vw]">
        <MessageError message={"You don't have permission to see this page"} />
      </main>
    );
  } else if (isChecked && isLoaded && error) {
    {
      /* Error message */
    }
    return (
      <main className="mt-2 mx-auto w-[90vw]">
        <MessageError message={error} />
      </main>
    );
  } else if (isChecked && isLoaded && loggedProfileData.username === `admin`) {
    {
      /* User list with filters */
    }
    return (
      <main className="p-2">
        <div className="card bg-base-200 p-4 gap-2 shadow-xl mx-auto mt-2 mb-4 rounded-lg w-[90vw]">
          <form>
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
            {/* Search profile input */}
            <label className="form-control w-full max-w-xs">
              <div className="label p-0">
                <span className="label-text">Search profile</span>
              </div>
              <input
                type="text"
                maxLength={10}
                value={userSearchText}
                onChange={(e) => handleInputSearch(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </label>{" "}
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
                          onClick={() =>
                            handleredirectProfile(userInfo.username)
                          }
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
        </div>{" "}
      </main>
    );
  }
}
