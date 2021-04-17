import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { InfoCollection } from "../../types";

const infoInitialState: InfoCollection | null = null;

export const infoSlice = createSlice<
  InfoCollection | null,
  SliceCaseReducers<InfoCollection | null>,
  "info"
>({
  name: "info",
  initialState: infoInitialState,
  reducers: {
    setInfo: (state, action: PayloadAction<InfoCollection | null>) =>
      action.payload,
  },
});
