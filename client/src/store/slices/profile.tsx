import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IProfileState } from "../../interfaces/slices/IProfileState";
import { IProfile } from "../../interfaces/IProfile";

const initialState: IProfileState = {
  profileData: null,
};

export const profileSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    addProfileData(state, action: PayloadAction<IProfile>) {
      state.profileData = { ...action.payload };
    },
    removeProfileData(state) {
      state.profileData = null;
    },
  },
});

export const { addProfileData, removeProfileData } = profileSlice.actions;
