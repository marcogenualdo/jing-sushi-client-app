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

export interface InfoCollection {
  openingTimes: WeekOpeningTimes;
  contacts: Contacts;
}

export interface Contacts {
  facebookRef: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  addressRef: string;
}

export interface WeekOpeningTimes {
  0: OpeningTime;
  1: OpeningTime;
  2: OpeningTime;
  3: OpeningTime;
  4: OpeningTime;
  5: OpeningTime;
  6: OpeningTime;
}

export interface OpeningTime {
  lunch: OpeningTimeDelta;
  dinner: OpeningTimeDelta;
}

export interface OpeningTimeDelta {
  from: SimpleTime;
  to: SimpleTime;
}

export interface SimpleTime {
  hour: number;
  minute: number;
}
