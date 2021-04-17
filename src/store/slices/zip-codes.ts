import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { ZipCodes } from "../../types";

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
