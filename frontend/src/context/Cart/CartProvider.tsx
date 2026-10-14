import { useCallback, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuth } from "../Auth/AuthContext";

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

const CartProvider = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");

  const applyCart = useCallback((cart: ApiCart) => {
    const items = mapCartItems(cart.items);

    setCartItems(items);
    setTotalAmount(
      cart.totalAmount ??
        items.reduce(
          (total, item) => total + item.quantity * item.unitPrice,
          0,
        ),
    );
  }, []);

  const requestCart = useCallback(
    async (url: string, options: RequestInit = {}): Promise<ApiCart> => {
      if (!token) {
        throw new Error("Please log in to manage your cart.");
      }

      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Cart request failed (${response.status}).`);
      }

      const data: unknown = await response.json();

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

  const fetchCart = useCallback(async () => {
    try {
      setError("");

      const cart = await requestCart("/cart");
      applyCart(cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart.");
    }
  }, [requestCart, applyCart]);

  useEffect(() => {
    if (!token) {
      return;
    }

    void fetchCart();
  }, [token, fetchCart]);

  useEffect(() => {
    if (token) {
      return;
    }

    const resetCart = () => {
      setCartItems([]);
      setTotalAmount(0);
      setError("");
    };

    const timeoutId = setTimeout(resetCart, 0);

    return () => clearTimeout(timeoutId);
  }, [token]);

  const addItemToCart = async (productId: string) => {
    try {
      setError("");

      const cart = await requestCart("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      applyCart(cart);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add item to cart.",
      );
    }
  };

  const updateItemInCart = async (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    try {
      setError("");

      const cart = await requestCart("/cart/items", {
        method: "PUT",
        body: JSON.stringify({ productId, quantity }),
      });

      applyCart(cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cart.");
    }
  };

  const removeItemInCart = async (productId: string) => {
    try {
      setError("");

      const cart = await requestCart(
        `/cart/items/${encodeURIComponent(productId)}`,
        { method: "DELETE" },
      );

      applyCart(cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item.");
    }
  };

  const clearCart = async () => {
    if (!token) {
      setCartItems([]);
      setTotalAmount(0);
      setError("");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to clear cart (${response.status}).`);
      }

      setCartItems([]);
      setTotalAmount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart.");
    }
  };

  const clearError = () => setError("");

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        error,
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
