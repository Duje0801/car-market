import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ILoggedProfileState } from "../../interfaces/slices/ILoggedProfileState";
import { ILoggedProfile } from "../../interfaces/ILoggedProfile";

export const getProfileData = createAsyncThunk(
  "profile/getProfileData",
  async () => {
    const response = JSON.parse(localStorage.getItem("userData") || "null");
    return {
      username: response.username,
      email: response.email,
      token: response.token,
    };
  }
);

const initialState: ILoggedProfileState = {
  loggedProfileData: { username: "", email: "", token: "" },
  error: null,
  isChecked: false,
};

export const loggedProfileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    addLoggedProfileData(state, action: PayloadAction<ILoggedProfile>) {
      state.loggedProfileData = { ...action.payload };
    },
    removeLoggedProfileData(state) {
      state.loggedProfileData = { username: "", email: "", token: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileData.pending, (state) => {
        state.error = null;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.isChecked = true;
        state.loggedProfileData = { ...action.payload };
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.isChecked = true;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export const { addLoggedProfileData, removeLoggedProfileData } =
  loggedProfileSlice.actions;
