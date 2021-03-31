import { useAppSelector } from "../tools/store";

export const useCartTotal = () => {
  const cartItems = useAppSelector((state) => state.cart);
  const cartTotal = Object.values(cartItems).reduce(
    (res, item) => res + item.quantity * item.price,
    0
  );
  return cartTotal;
};
