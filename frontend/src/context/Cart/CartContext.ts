import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

export interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  error: string;
  addItemToCart: (productId: string) => Promise<void>;
  updateItemInCart: (productId: string, quantity: number) => Promise<void>;
  removeItemInCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalAmount: 0,
  error: "",
  addItemToCart: async () => {},
  updateItemInCart: async () => {},
  removeItemInCart: async () => {},
  clearCart: async () => {},
  clearError: () => {},
});

export const useCart = () => useContext(CartContext);
