import { useSelector } from "react-redux";
import { store } from "../store";

export function useCheckProfileText() {
  const { data, error, isChecked } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.profile
  );

  if (!isChecked) return "Checking if user is logged in";
  else if (data.username) return `Hello, ${data.username}!`;
  else if (isChecked && !data.username) return `You are not logged in`;
  else if (isChecked && error) return error;
  else return ""
}
