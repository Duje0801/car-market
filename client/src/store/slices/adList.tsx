import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { IAdListState } from "../../interfaces/slices/IAdListState";
import { IAd } from "../../interfaces/IAd";

const initialState: IAdListState = {
  adListData: null,
  adListDataNo: 0,
};

export const adListSlice = createSlice({
  name: "adListData",
  initialState,
  reducers: {
    addAdListData(state, action: PayloadAction<IAd[]>) {
      state.adListData =  [...action.payload] 
    },
    removeAdListData(state) {
      state.adListData = null;
    },
    changeAdListDataNo(state, action: PayloadAction<number>) {
      state.adListDataNo = action.payload;
    },
    resetAdListDataNo(state) {
      state.adListDataNo = 0;
    },
  },
});

export const { addAdListData, removeAdListData, changeAdListDataNo, resetAdListDataNo } =
adListSlice.actions;
