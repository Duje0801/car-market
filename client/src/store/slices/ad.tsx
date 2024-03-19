import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IAdState } from "../../interfaces/slices/IAdState";
import { IAd } from "../../interfaces/IAd";

const initialState: IAdState = {
  adData: null,
  imgToShowInCarousel: 0,
};

//imgToShowInCarousel is in slice because if ad image is deleted in editAd,
//in ad image carousel the first image will automatically be displayed,
//this avoids the problem if for example the 5th image is deleted then we will get an error
//because now the 5th image in the array no longer exists

export const adSlice = createSlice({
  name: "adData",
  initialState,
  reducers: {
    addAdData(state, action: PayloadAction<IAd>) {
      state.adData = { ...action.payload };
    },
    removeAdData(state) {
      state.adData = null;
    },
    changeImgToShow(state, action: PayloadAction<number>) {
      state.imgToShowInCarousel = action.payload;
    },
    resetImgToShow(state) {
      state.imgToShowInCarousel = 0;
    },
  },
});

export const { addAdData, removeAdData, changeImgToShow, resetImgToShow } =
  adSlice.actions;
