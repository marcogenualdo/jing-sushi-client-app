import { addToCartItemInner } from "../../components/store";
import { CartData, MenuItemData } from "../../types";

describe("addToCartItemInner", () => {
  test("add, < 0", () => {
    const item: MenuItemData = {
      code: "a",
      name: "arg",
      price: 4,
    };
    const output = addToCartItemInner({}, item, -1);
    expect(output).toMatchObject({});
  });

  test("add, > 0", () => {
    const item: MenuItemData = {
      code: "a",
      name: "arg",
      price: 4,
    };
    const output = addToCartItemInner({}, item, 1);
    const res = { a: { ...item, quantity: 1 } };

    expect(output).toMatchObject(res);
  });

  test("update, > 0", () => {
    const item: MenuItemData = {
      code: "au",
      name: "arg",
      price: 4,
    };
    const prev: CartData = {
      au: { ...item, quantity: 2 },
    };
    const output = addToCartItemInner(prev, item, 1);
    const res = { au: { ...item, quantity: 3 } };

    expect(output).toMatchObject(res);
  });

  test("delete, < 0", () => {
    const item: MenuItemData = {
      code: "a",
      name: "arg",
      price: 4,
    };
    const prev: CartData = {
      a: { ...item, quantity: 1 },
    };
    const output = addToCartItemInner(prev, item, -1);
    const res = {};

    expect(output).toMatchObject(res);
  });
});
