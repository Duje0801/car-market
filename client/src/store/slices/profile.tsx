import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IProfileState } from "../../interfaces/IProfileState";
import { IProfileData } from "../../interfaces/IProfileData";

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

const initialState: IProfileState = {
  data: { username: "", email: "", token: "" },
  error: null,
  isChecked: false,
};

export const profileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    addProfileData(state, action: PayloadAction<IProfileData>) {
      state.data = { ...action.payload };
    },
    removeProfileData(state) {
      state.data = { username: "", email: "", token: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileData.pending, (state) => {
        state.error = null;
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        state.isChecked = true;
        state.data = { ...action.payload };
      })
      .addCase(getProfileData.rejected, (state, action) => {
        state.isChecked = true;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export const { addProfileData, removeProfileData } = profileSlice.actions;
