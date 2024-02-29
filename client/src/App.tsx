import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { getProfileData } from "./store/slices/profile";
import { Header } from "./components/header";

export function App() {
  const dispatch: typeof store.dispatch = useDispatch();

  const { data } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

  return (
    <>
      <Header />
      <Link to="/">Home</Link> |
      {data.username ? (
        <Link to={`/profile/${data.username}`}>My Profile</Link>
      ) : (
        <>
          <Link to="/signUp">Sign Up</Link> | <Link to="/logIn">Log In</Link> |{" "}
          <Link to="/forgotPassword">Forgot Password</Link>
        </>
      )}
      <Outlet />
    </>
  );
}
