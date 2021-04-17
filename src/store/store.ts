import { configureStore } from "@reduxjs/toolkit";
import firebase from "firebase";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getUserAddress } from "../tools/firestore";
import {
  Address,
  CartItemData,
  InfoCollection,
  MenuCategoryData,
  Order,
  ZipCodes,
} from "../types";
import { addressSlice } from "./slices/address";
import { cartSlice } from "./slices/cart";
import { infoSlice } from "./slices/info";
import { menuSlice } from "./slices/menu";
import { userOrdersSlice } from "./slices/user-orders";
import { zipsSlice } from "./slices/zip-codes";

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    menu: menuSlice.reducer,
    address: addressSlice.reducer,
    zipCodes: zipsSlice.reducer,
    info: infoSlice.reducer,
    userOrders: userOrdersSlice.reducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

// hooks
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// --- UTILS --- //

// cart
export const cartItemIncrement = (item: CartItemData) =>
  store.dispatch(cartSlice.actions.addToCartItem({ item, n: 1 }));

export const cartItemDecrement = (item: CartItemData) =>
  store.dispatch(cartSlice.actions.addToCartItem({ item, n: -1 }));

export const cartItemTrash = (item: CartItemData) => {
  const quantity = store.getState().cart[item.code]?.quantity;
  if (quantity) {
    store.dispatch(cartSlice.actions.addToCartItem({ item, n: -quantity }));
  }
};

export const emptyCart = () => {
  store.dispatch(cartSlice.actions.emptyCart());
};

// menu
export const updateMenu = (menuData: MenuCategoryData[]) =>
  store.dispatch(menuSlice.actions.setMenu(menuData));

// zips
export const updateZipCodes = (zipData: ZipCodes) =>
  store.dispatch(zipsSlice.actions.setZipCodes(zipData));

// address
export const updateAddress = (newAddress: Address | null) =>
  store.dispatch(addressSlice.actions.setAddress(newAddress));

export const fetchAddress = async (user: firebase.User) => {
  const newAddress = await getUserAddress(user);
  updateAddress(newAddress);
};

// info
export const updateInfo = (info: InfoCollection | null) =>
  store.dispatch(infoSlice.actions.setInfo(info));

// orders
export const updateUserOrders = (orderData: Order[]) =>
  store.dispatch(userOrdersSlice.actions.setUserOrderCodes(orderData));
