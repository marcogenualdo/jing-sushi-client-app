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

export type Address = string;

export interface Order {
  creationTime: Date;
  deliveryTime: Date;
  deliveryAddress: Address;
  plates: CartItemData[];
  type: OrderType;
  status: OrderStatus;
  notes: string;
  userId: string;
  paymentType: PaymentType;
}

export type OrderDraft = Omit<Order, "creationTime">;
