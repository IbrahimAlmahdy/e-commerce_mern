import { useState } from "react";
import type { PropsWithChildren } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/stores/authStore";
import { CartContext } from "../context/CartContext";
import {
  calculateCartTotal,
  clearCartRequest,
  mapCartItems,
  requestCart,
} from "../services/cartService";
import type { ApiCart, CartItem } from "../types/cart.types";

const CartProvider = ({ children }: PropsWithChildren) => {
  const token = useAuth((state) => state.token);
  const queryClient = useQueryClient();

  const [error, setError] = useState("");

  const cartQueryKey = ["cart", token];

  const { data: cart, error: queryError } = useQuery({
    queryKey: cartQueryKey,
    queryFn: () => requestCart(token, "/cart"),
    enabled: Boolean(token),
  });

  const cartItems: CartItem[] = token && cart ? mapCartItems(cart.items) : [];

  const totalAmount = token && cart ? calculateCartTotal(cart) : 0;

  const executeCartMutation = async (
    action: () => Promise<ApiCart>,
    fallbackMessage: string,
  ) => {
    try {
      setError("");

      const updatedCart = await action();

      queryClient.setQueryData<ApiCart>(cartQueryKey, updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : fallbackMessage);
    }
  };

  const addItemToCart = async (productId: string) => {
    await executeCartMutation(
      () =>
        requestCart(token, "/cart/items", {
          method: "POST",
          data: { productId, quantity: 1 },
        }),
      "Failed to add item to cart.",
    );
  };

  const updateItemInCart = async (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    await executeCartMutation(
      () =>
        requestCart(token, "/cart/items", {
          method: "PUT",
          data: { productId, quantity },
        }),
      "Failed to update cart.",
    );
  };

  const removeItemInCart = async (productId: string) => {
    await executeCartMutation(
      () =>
        requestCart(token, `/cart/items/${encodeURIComponent(productId)}`, {
          method: "DELETE",
        }),
      "Failed to remove item.",
    );
  };

  const clearCart = async () => {
    if (!token) {
      return;
    }

    try {
      setError("");

      await clearCartRequest();

      queryClient.setQueryData<ApiCart>(cartQueryKey, {
        items: [],
        totalAmount: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart.");
    }
  };

  const clearError = () => setError("");

  const cartError =
    error || (queryError instanceof Error ? queryError.message : "");

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        error: cartError,
        addItemToCart,
        updateItemInCart,
        removeItemInCart,
        clearCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
