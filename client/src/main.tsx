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
import { AdsList } from "./pages/adsList/adsList.tsx";
import { AdView } from "./pages/ad/ad.tsx";
import { Profile } from "./pages/profile/profile.tsx";
import { SignUp } from "./pages/auth/signUp.tsx";
import { LogIn } from "./pages/auth/logIn.tsx";
import { ForgotPassword } from "./pages/auth/forgotPassword.tsx";
import { ResetPassword } from "./pages/auth/resetPassword.tsx";
import { NewAd } from "./pages/ad/new.tsx";
import { RedirectAuth } from "./pages/redirect/redirectAuth.tsx";
import { RedirectAd } from "./pages/redirect/redirectAd.tsx";
import { RedirectAdmin } from "./pages/redirect/redirectAdmin.tsx";
import { UserList } from "./pages/admin/userList.tsx";
import { AboutUs } from "./pages/info/aboutUs.tsx";
import { Contact } from "./pages/info/contact.tsx";
import { Jobs } from "./pages/info/jobs.tsx";
import { PrivacyPolicy } from "./pages/info/privacyPolicy.tsx";
import { TermsOfUse } from "./pages/info/termsOfUse.tsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/ads/:id?" element={<AdsList />} />
      <Route path="/ad/:id?" element={<AdView />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/newAd" element={<NewAd />} />
      <Route path="/redirect/auth/:id" element={<RedirectAuth />} />
      <Route path="/redirect/ad/:id" element={<RedirectAd />} />
      <Route path="/redirect/admin/:id" element={<RedirectAdmin />} />
      <Route path="/admin/userList" element={<UserList />} />
      <Route path="/info/aboutUs" element={<AboutUs />} />
      <Route path="/info/contact" element={<Contact />} />
      <Route path="/info/jobs" element={<Jobs />} />
      <Route path="/info/privacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/info/termsOfUse" element={<TermsOfUse />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
