import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData, CartItemData } from "../../types";

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
