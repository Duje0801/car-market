import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { store } from "./store";
import { getProfileData } from "./store/slices/loggedProfile";
import { Header } from "./components/header";

export function App() {
  const dispatch: typeof store.dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
