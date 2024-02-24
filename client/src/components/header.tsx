import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { store } from "../store";
import { removeProfileData } from "../store/slices/profile";
import { useCheckProfileText } from "../hooks/useCheckProfileText";

export function Header() {
  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  const dispatch = useDispatch();

  const checkProfileText = useCheckProfileText();

  const handleLogOut = () => {
    localStorage.removeItem("userData");
    dispatch(removeProfileData());
  };

  return (
    <>
      <header className="bg-red-500 text-white">
        <h1 className="text-4xl">Car market</h1>
        <p>{checkProfileText}</p>
        {data.username ? (
          <button className="btn ml-auto" onClick={handleLogOut}>
            Log out
          </button>
        ) : null}
      </header>
    </>
  );
}
