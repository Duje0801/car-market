import { configureStore, createAction } from "@reduxjs/toolkit";
import { loggedProfileSlice } from "./slices/loggedProfile";
import { adSlice } from "./slices/ad";
import { profileSlice } from "./slices/profile";

const reset = createAction("app/reset");

const store = configureStore({
  reducer: {
    loggedProfile: loggedProfileSlice.reducer,
    ad: adSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export { store, reset };
