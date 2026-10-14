import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  error: string;
  removingProductId: string | null;
  addItemToCart: (productId: string) => Promise<void>;
  removeItemFromCart: (productId: string) => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  error: "",
  removingProductId: null,
  addItemToCart: async () => {},
  removeItemFromCart: async () => {},
});

export const useCart = () => useContext(CartContext);
