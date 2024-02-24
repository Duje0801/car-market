import { configureStore, createAction } from "@reduxjs/toolkit";
import { profileSlice } from "./slices/profile";

const reset = createAction("app/reset");

const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
  },
});

export { store, reset };
