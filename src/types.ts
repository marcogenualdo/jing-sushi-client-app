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

export enum OrderType {
  Delivery = "DELIVERY",
  Pickup = "PICKUP",
}

export enum OrderStatus {
  Pending = "PENDING",
  Delivery = "DELIVERY",
  Aborted = "ABORTED",
  Completed = "COMPLETED",
}

export enum PaymentType {
  Cash = "CASH",
  Pos = "POS",
}

export interface Address {
  address: string;
  zip: string;
}

export interface User {
  address: Address;
}

export interface Order {
  creationTime: Date;
  deliveryTime: Date;
  deliveryAddress: Address | null;
  plates: CartItemData[];
  type: OrderType;
  status: OrderStatus;
  notes: string;
  userId: string;
  paymentType: PaymentType;
}

export type OrderDraft = Omit<Order, "creationTime">;

export type ZipCodes = Record<string, number>;
