import { useCallback, useState } from "react";
import type { PropsWithChildren } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import api from "../../lib/axios";
import { useAuth } from "../../stores/authStore";

interface ApiCartItem {
  product: {
    _id: string;
    title: string;
    image: string;
    unitPrice?: number;
  };
  quantity: number;
  unitPrice?: number;
}

interface ApiCart {
  items: ApiCartItem[];
  totalAmount?: number;
}

const mapCartItems = (items: ApiCartItem[]): CartItem[] =>
  items.map(({ product, quantity, unitPrice }) => ({
    productId: product._id,
    title: product.title,
    image: product.image,
    quantity,
    unitPrice: unitPrice ?? product.unitPrice ?? 0,
  }));

const calculateTotal = (cart: ApiCart): number => {
  const items = mapCartItems(cart.items);

  return (
    cart.totalAmount ??
    items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  );
};

const CartProvider = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [error, setError] = useState("");

  const cartQueryKey = ["cart", token];

  const requestCart = useCallback(
    async (
      url: string,
      options: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        data?: unknown;
      } = {},
    ): Promise<ApiCart> => {
      if (!token) {
        throw new Error("Please log in to manage your cart.");
      }

      const response = await api.request<ApiCart>({
        url,
        method: options.method ?? "GET",
        data: options.data,
      });

      const data: unknown = response.data;

      if (
        typeof data !== "object" ||
        data === null ||
        !("items" in data) ||
        !Array.isArray(data.items)
      ) {
        throw new Error("Invalid cart response from server.");
      }

      return data as ApiCart;
    },
    [token],
  );

  // Fetch cart data through TanStack Query.
  const { data: cart, error: queryError } = useQuery({
    queryKey: cartQueryKey,
    queryFn: () => requestCart("/cart"),
    enabled: Boolean(token),
  });

  const cartItems = token && cart ? mapCartItems(cart.items) : [];

  const totalAmount = token && cart ? calculateTotal(cart) : 0;

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
        requestCart("/cart/items", {
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
        requestCart("/cart/items", {
          method: "PUT",
          data: { productId, quantity },
        }),
      "Failed to update cart.",
    );
  };

  const removeItemInCart = async (productId: string) => {
    await executeCartMutation(
      () =>
        requestCart(`/cart/items/${encodeURIComponent(productId)}`, {
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

      await api.delete("/cart");

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
