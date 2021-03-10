export type DishCode = string;

export interface MenuItemData {
  name: string;
  code: DishCode;
  price: number;
  image?: string;
  description?: string;
}

export interface MenuCategoryData {
  name: string;
  image: string;
  dishes: MenuItemData[];
}

export interface CartItemData extends MenuItemData {
  quantity: number;
}

export type CartData = Record<DishCode, CartItemData>;
