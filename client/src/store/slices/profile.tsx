import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IProfileState } from "../../interfaces/slices/IProfileState";
import { IUserData } from "../../interfaces/IUserData";

const initialState: IProfileState = {
  profileData: null,
};

export const profileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    addProfileData(state, action: PayloadAction<IUserData>) {
      state.profileData = { ...action.payload };
    },
    removeProfileData(state) {
      state.profileData = null;
    },
  },
});

export const { addProfileData, removeProfileData } = profileSlice.actions;
