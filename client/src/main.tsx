import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.tsx";
import { App } from "./App.tsx";
import { Home } from "./pages/home.tsx";
import { ShowAdsList } from "./components/showAdsList.tsx";
import { AdView } from "./components/adView.tsx";
import { EditAdData } from "./components/edit/ad/editAdData.tsx";
import { UserProfile } from "./components/userProfile.tsx";
import { SignUp } from "./pages/auth/signUp.tsx";
import { LogIn } from "./pages/auth/logIn.tsx";
import { ForgotPassword } from "./pages/auth/forgotPassword.tsx";
import { ResetPassword } from "./pages/auth/resetPassword.tsx";
import { NewAd } from "./components/createNewAd.tsx";
import { UserList } from "./components/userList.tsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/ads/:id?" element={<ShowAdsList />} />
      <Route path="/ad/:id?" element={<AdView />} />
      <Route path="/editAd/:id?" element={<EditAdData />} />
      <Route path="/profile/:id" element={<UserProfile />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/newAd" element={<NewAd />} />
      <Route path="/admin/userList" element={<UserList />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
