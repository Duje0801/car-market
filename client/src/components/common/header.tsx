import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCheckProfileText } from "../../hooks/useCheckProfileText";
import { removeLoggedProfileData } from "../../store/slices/loggedProfile";
import { Link } from "react-router-dom";
import { store } from "../../store";
import logoImage from "../../assets/images/header/logo-image.png";
import logoTitle from "../../assets/images/header/logo-title.png";

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
              className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2 xxl:text-xl"
              onClick={() => handleRedirect(``)}
            >
              Home
            </button>
          ) : (
            <div className="dropdown dropdown-bottom">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2 xxl:text-xl"
              >
                Options
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow border-[0.8px] border-white bg-black rounded-box w-52"
              >
                <Link to={`/`} className="my-auto">
                  <li className="text-sm font-bold py-2 xxl:text-xl">Home</li>
                </Link>
                {loggedProfileData.username === `admin` ? (
                  <Link to="/admin/userList" className="my-auto">
                    <li className="text-sm font-bold py-2 xxl:text-xl"> User List</li>
                  </Link>
                ) : null}
                {loggedProfileData.username &&
                loggedProfileData.username !== `admin` ? (
                  <>
                    <Link
                      to={`/profile/${loggedProfileData.username}`}
                      className="my-auto"
                    >
                      <li className="text-sm font-bold py-2 xxl:text-xl">My Profile</li>
                    </Link>
                    <Link to={`/newAd`} className="my-auto">
                      <li className="text-sm font-bold py-2 xxl:text-xl">New Ad</li>
                    </Link>
                  </>
                ) : null}
              </ul>
            </div>
          )}
        </div>
        {/* Header 1st row - Right */}
        <div className="flex">
          <p className="my-auto text-sm font-bold xxl:text-xl">{checkProfileText}</p>
          {isChecked && loggedProfileData.username ? (
            <button
              className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2 xxl:text-xl"
              onClick={() => handleLogOut()}
            >
              Log out
            </button>
          ) : null}
          {isChecked && !loggedProfileData.username ? (
            <button
              className="btn btn-sm my-auto bg-black text-white text-sm font-bold ml-2 xxl:text-xl"
              onClick={() => handleRedirect(`logIn`)}
            >
              Log in
            </button>
          ) : null}
        </div>
      </div>
      {/* Header 2nd row */}
      <div
        onClick={() => handleRedirect(``)}
        className="flex w-fit m-auto my-2 hover:cursor-pointer"
      >
        <img src={logoImage} alt="logo" className="h-[10vh] sm:h-[12.5vh] lg:h-[14vh]" />
        <img src={logoTitle} alt="logo" className="h-[5vh] m-auto" />
      </div>
    </header>
  );
}
