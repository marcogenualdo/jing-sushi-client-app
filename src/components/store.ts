import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { CartData, CartItemData } from "../types";

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

const initialState: CartData = {};

// redux store
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartItem: (
      state,
      action: PayloadAction<AddToCartItemActionPayload>
    ) => {
      return addToCartItemInner(state, action.payload.item, action.payload.n);
    },
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });

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
