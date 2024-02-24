import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { SignUp } from "./components/signUp.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/signUp" element={<SignUp />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
