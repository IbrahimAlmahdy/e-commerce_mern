import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuth } from "../Auth/AuthContext";

const CartStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState("");

  const updateCart = (cart: {
    items: Array<{
      product: { _id: string; title: string; image: string };
      quantity: number;
      unitPrice: number;
    }>;
    totalAmount: number;
  }) => {
    setCartItems(
      cart.items.map(({ product, quantity, unitPrice }) => ({
        productId: product._id,
        title: product.title,
        image: product.image,
        quantity,
        unitPrice,
      })),
    );
    setTotalAmount(cart.totalAmount);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch your cart. Please try again.");
          return;
        }

        updateCart(await response.json());
        setError("");
      } catch {
        setError("Failed to fetch your cart. Please try again.");
      }
    };

    void loadCart();
  }, [token]);

  const addItemToCart = async (productId: string) => {
    if (!token) {
      setError("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        setError("Failed to add item to cart.");
        return;
      }

      updateCart(await response.json());
      setError("");
    } catch {
      setError("Failed to add item to cart.");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, totalAmount, error, addItemToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();

  return (
    <CartStateProvider key={token ?? "guest"}>{children}</CartStateProvider>
  );
};

export default CartProvider;
