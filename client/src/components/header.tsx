import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCheckProfileText } from "../hooks/useCheckProfileText";
import { removeProfileData } from "../store/slices/profile";
import { store } from "../store";

export function Header() {
  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkProfileText = useCheckProfileText();

  const handleLogOut = () => {
    localStorage.removeItem("userData");
    dispatch(removeProfileData());
  };

  const handleNewAd = () => {
    navigate("/newAd");
  };

  return (
    <>
      <header className="bg-red-500 text-white">
        <h1 className="text-4xl">Car market</h1>
        <p>{checkProfileText}</p>
        {data.username ? (
          <>
            <button className="btn" onClick={handleLogOut}>
              Log out
            </button>
            <button className="btn ml-4" onClick={handleNewAd}>
              Create new ad
            </button>
          </>
        ) : null}
      </header>
    </>
  );
}
