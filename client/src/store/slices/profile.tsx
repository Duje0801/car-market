import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IProfileState } from "../../interfaces/slices/IProfileState";
import { IProfile } from "../../interfaces/IProfile";
import { IAd } from "../../interfaces/IAd";

const initialState: IProfileState = {
  profileData: null,
  profileAds: [],
  profileAdsNo: 0,
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
    addProfileAds(state, action: PayloadAction<IAd[]>) {
      state.profileAds = [...action.payload];
    },
    removeProfileAds(state) {
      state.profileAds = [];
    },
    changeProfileAdsNo(state, action: PayloadAction<number>) {
      state.profileAdsNo = action.payload
    },
    removeProfileAdsNo(state) {
      state.profileAdsNo = 0
    },

  },
});

export const {
  addProfileData,
  removeProfileData,
  addProfileAds,
  removeProfileAds,
  changeProfileAdsNo,
  removeProfileAdsNo
} = profileSlice.actions;
