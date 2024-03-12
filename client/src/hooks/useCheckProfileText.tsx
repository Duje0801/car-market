import { useSelector } from "react-redux";
import { store } from "../store";

export function useCheckProfileText() {
  const { loggedProfileData, error, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.loggedProfile
  );

  if (!isChecked) return "Checking if user is logged in";
  else if (loggedProfileData.username)
    return `Hello, ${loggedProfileData.username}!`;
  else if (isChecked && !loggedProfileData.username)
    return `You are not logged in`;
  else if (isChecked && error) return error;
  else return "";
}
