import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { Order } from "../../types";

const userOrdersInitialState: Order[] | null = null;

export const userOrdersSlice = createSlice<
  Order[] | null,
  SliceCaseReducers<Order[] | null>,
  "userOrders"
>({
  name: "userOrders",
  initialState: userOrdersInitialState,
  reducers: {
    setUserOrderCodes: (state, action: PayloadAction<Order[] | null>) =>
      action.payload,
  },
});
