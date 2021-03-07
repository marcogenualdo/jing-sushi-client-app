export type DishCode = string;

export interface MenuItemData {
  name: string;
  code: DishCode;
  price: number;
  picture?: string;
  description?: string;
}

export interface CartItemData extends MenuItemData {
  quantity: number;
}

export type CartData = Record<DishCode, CartItemData>;
