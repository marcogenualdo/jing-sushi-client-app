import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData, CartItemData } from "../../types";
import store from "../store";

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

const cartInitialState: CartData = {};

export const cartSlice = createSlice({
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
