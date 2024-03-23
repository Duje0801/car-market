import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { store } from "./store";
import { getProfileData } from "./store/slices/loggedProfile";
import { Header } from "./components/common/header";
import { Footer } from "./components/common/footer";
import { ErrorBoundary } from "react-error-boundary";
import { PageDontExist } from "./pages/error/pageDontExist";

export function App() {
  const dispatch: typeof store.dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileData());
  }, []);

  return (
    <>
      <Header />
      <main className="pb-8">
        <ErrorBoundary FallbackComponent={PageDontExist}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
