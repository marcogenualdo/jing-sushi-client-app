import {
  configureStore,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { CartData, CartItemData, MenuCategoryData } from "../types";
import { getUserAddress } from "./firestore";
import firebase from "firebase";

/**
 * Adds a quantity to an item in the shopping cart.
 */
export const addToCartItemInner = (
  cartItems: CartData = {},
  item: CartItemData,
  n: number
): CartData => {
  const code = item?.code;
  const preValue = cartItems[code]?.quantity;
  const newValue = (preValue ?? 0) + n;

  if (newValue > 0) {
    // update/add to cart
    const newItem = {
      ...item,
      quantity: newValue,
    };
    return {
      ...cartItems,
      [code]: newItem,
    };
  } else {
    // remove from cart
    const { [code]: del, ...allButCode } = cartItems;
    return allButCode;
  }
};

export interface AddToCartItemActionPayload {
  item: CartItemData;
  n: number;
}

// --- CART --- //
const cartInitialState: CartData = {};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartInitialState,
  reducers: {
    addToCartItem: (
      state,
      action: PayloadAction<AddToCartItemActionPayload>
    ) => {
      return addToCartItemInner(state, action.payload.item, action.payload.n);
    },
    emptyCart: () => {
      return {};
    },
  },
});

// --- MENU --- //
const menuInitialState: MenuCategoryData[] = [];

const menuSlice = createSlice({
  name: "menu",
  initialState: menuInitialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuCategoryData[]>) =>
      action.payload,
  },
});

// --- USER ADDRESS --- //
const addressInitialState: string | null = null;

const addressSlice = createSlice<
  string | null,
  SliceCaseReducers<string | null>,
  "userAddress"
>({
  name: "userAddress",
  initialState: addressInitialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string | null>) => action.payload,
  },
});

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    menu: menuSlice.reducer,
    address: addressSlice.reducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

// hooks
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// functions
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

export const updateMenu = (menuData: MenuCategoryData[]) =>
  store.dispatch(menuSlice.actions.setMenu(menuData));

export const updateAddress = (newAddress: string | null) =>
  store.dispatch(addressSlice.actions.setAddress(newAddress));

export const fetchAddress = async (user: firebase.User) => {
  const newAddress = await getUserAddress(user);
  updateAddress(newAddress);
};
