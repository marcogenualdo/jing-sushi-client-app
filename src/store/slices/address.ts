import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { Address } from "../../types";

const addressInitialState: Address | null = null;

export const addressSlice = createSlice<
  Address | null,
  SliceCaseReducers<Address | null>,
  "userAddress"
>({
  name: "userAddress",
  initialState: addressInitialState,
  reducers: {
    setAddress: (state, action: PayloadAction<Address | null>) =>
      action.payload,
  },
});
