import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IUserData } from "../interfaces/IUserData";
import { store } from "../store";
import { Hourglass } from "react-loader-spinner";
import axios from "axios";

export function UserList() {
  const [users, setUsers] = useState<IUserData[]>([]);
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [openingLoading, setOpeningLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { data, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
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
            authorization: `Bearer ${data?.token}`,
          },
        }
      );
      const users = response.data.users.sort((a: IUserData, b: IUserData) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      });
      setUsers(users);
      setOpeningLoading(true);
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

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  } else if (!isChecked || !openingLoading) {
    return (
      //In case user data is not checked or waiting for first fetch to be completed
      <div>
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
      </div>
    );
  } else if (isChecked && data.username === `admin`) {
    return (
      <div>
        <div>
          <form>
            <div>
              <label>
                Show only active users:
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={handleActiveUsersChange}
                />
              </label>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search user..."
                maxLength={10}
                onChange={(e) => handleInputSearch(e.target.value)}
              />
            </div>
          </form>
        </div>{" "}
        {users.length === 0 ? (
          <p>No user matches the requested requirements</p>
        ) : (
          <table className="userListTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((userInfo, i) => {
                  return (
                    <tr
                      onClick={() => handleUserClick(userInfo.username)}
                      key={i}
                    >
                      <td>{userInfo.username}</td>
                      <td>{userInfo.email}</td>
                      <td>{userInfo.active ? `Yes` : `No`}</td>
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
