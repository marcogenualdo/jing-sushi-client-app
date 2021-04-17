import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { ZipCodes } from "../../types";
import store from "../store";

const zipsInitialState: ZipCodes | null = null;

export const zipsSlice = createSlice<
  ZipCodes | null,
  SliceCaseReducers<ZipCodes | null>,
  "zipCodes"
>({
  name: "zipCodes",
  initialState: zipsInitialState,
  reducers: {
    setZipCodes: (state, action: PayloadAction<ZipCodes | null>) =>
      action.payload,
  },
});

export const updateZipCodes = (zipData: ZipCodes) =>
  store.dispatch(zipsSlice.actions.setZipCodes(zipData));
