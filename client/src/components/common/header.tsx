import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCheckProfileText } from "../../hooks/useCheckProfileText";
import { removeLoggedProfileData } from "../../store/slices/loggedProfile";
import { Link } from "react-router-dom";
import { store } from "../../store";
import logoImage from "../../assets/images/logo-image.png";
import logoTitle from "../../assets/images/logo-title.png";

export function Header() {
  const { loggedProfileData, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkProfileText = useCheckProfileText();

  const handleRedirect = (to: string) => {
    navigate(`/${to}`);
  };

  const handleLogOut = () => {
    localStorage.removeItem("userData");
    dispatch(removeLoggedProfileData());
    navigate(`redirect/auth/logOut`);
  };

  return (
    <header>
      {/* Header 1st row */}
      <div className="flex justify-between bg-black text-white p-2 min-h-12">
        {/* Header 1st row - Left */}
        <div className="flex gap-2">
          {!loggedProfileData.username ? (
            <button
              className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2"
              onClick={() => handleRedirect(``)}
            >
              Home
            </button>
          ) : (
            <div className="dropdown dropdown-bottom">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2"
              >
                Options
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52"
              >
                <Link to={`/`} className="my-auto">
                  <li className="text-sm font-bold py-2">Home</li>
                </Link>
                {loggedProfileData.username === `admin` ? (
                  <Link to="/admin/userList" className="my-auto">
                    <li className="text-sm font-bold py-2"> User List</li>
                  </Link>
                ) : null}
                {loggedProfileData.username &&
                loggedProfileData.username !== `admin` ? (
                  <>
                    <Link
                      to={`/profile/${loggedProfileData.username}`}
                      className="my-auto"
                    >
                      <li className="text-sm font-bold py-2">My Profile</li>
                    </Link>
                    <Link to={`/newAd`} className="my-auto">
                      <li className="text-sm font-bold py-2">New Ad</li>
                    </Link>
                  </>
                ) : null}
              </ul>
            </div>
          )}
        </div>
        {/* Header 1st row - Right */}
        <div className="flex">
          <p className="my-auto text-sm font-bold">{checkProfileText}</p>
          {isChecked && loggedProfileData.username ? (
            <button
              className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2"
              onClick={() => handleLogOut()}
            >
              Log out
            </button>
          ) : null}
          {isChecked && !loggedProfileData.username ? (
            <button
              className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2"
              onClick={() => handleRedirect(`logIn`)}
            >
              Log in
            </button>
          ) : null}
        </div>
      </div>
      {/* Header 2nd row */}
      <div className="flex w-fit m-auto my-2">
        <img src={logoImage} alt="logo" className="h-[12.5vh]" />
        <img src={logoTitle} alt="logo" className="h-[5vh] m-auto" />
      </div>
    </header>
  );
}
