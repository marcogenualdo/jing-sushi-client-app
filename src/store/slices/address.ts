import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import firebase from "firebase";
import { getUserAddress } from "../../tools/firestore";
import { Address } from "../../types";
import store from "../store";

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

export const updateAddress = (newAddress: Address | null) =>
  store.dispatch(addressSlice.actions.setAddress(newAddress));

export const fetchAddress = async (user: firebase.User) => {
  const newAddress = await getUserAddress(user);
  updateAddress(newAddress);
};
