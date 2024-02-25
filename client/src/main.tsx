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
import { SignUp } from "./components/signUp.tsx";
import { LogIn } from "./components/logIn.tsx";
import { ForgotPassword } from "./components/forgotPassword.tsx";
import { ResetPassword } from "./components/resetPassword.tsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/logIn" element={<LogIn />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
