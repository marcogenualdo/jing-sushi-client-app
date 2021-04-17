import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { InfoCollection } from "../../types";
import store from "../store";

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

export const updateInfo = (info: InfoCollection | null) =>
  store.dispatch(infoSlice.actions.setInfo(info));
