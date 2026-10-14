import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  error: string;
  addItemToCart: (productId: string) => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  error: "",
  addItemToCart: async () => {},
});

export const useCart = () => useContext(CartContext);
