import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IAdState } from "../../interfaces/IAdState";
import { IAd } from "../../interfaces/IAd";

const initialState: IAdState = {
  adData: null,
};

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
  },
});

export const { addAdData, removeAdData } = adSlice.actions;
