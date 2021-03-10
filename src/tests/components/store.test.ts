import { fetchMenu } from "../../tools/firestore";
import { addToCartItemInner } from "../../tools/store";
import { CartData, CartItemData } from "../../types";

describe("addToCartItemInner", () => {
  test("add, < 0", () => {
    const item: CartItemData = {
      code: "a",
      name: "arg",
      price: 4,
      quantity: 0,
    };
    const output = addToCartItemInner({}, item, -1);
    expect(output).toMatchObject({});
  });

  test("add, > 0", () => {
    const item: CartItemData = {
      code: "a",
      name: "arg",
      price: 4,
      quantity: 0,
    };
    const output = addToCartItemInner({}, item, 1);
    const res = { a: { ...item, quantity: 1 } };

    expect(output).toMatchObject(res);
  });

  test("update, > 0", () => {
    const item: CartItemData = {
      code: "au",
      name: "arg",
      price: 4,
      quantity: 2,
    };
    const prev: CartData = {
      au: { ...item, quantity: 2 },
    };
    const output = addToCartItemInner(prev, item, 1);
    const res = { au: { ...item, quantity: 3 } };

    expect(output).toMatchObject(res);
  });

  test("delete, < 0", () => {
    const item: CartItemData = {
      code: "a",
      name: "arg",
      price: 4,
      quantity: 1,
    };
    const prev: CartData = {
      a: { ...item, quantity: 1 },
    };
    const output = addToCartItemInner(prev, item, -1);
    const res = {};

    expect(output).toMatchObject(res);
  });
});
