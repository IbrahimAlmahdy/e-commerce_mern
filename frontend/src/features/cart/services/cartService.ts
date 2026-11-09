import api from "../../../lib/axios";
import type { ApiCart, ApiCartItem, CartItem } from "../types/cart.types";

type CartRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
};

export const requestCart = async (
  token: string | null,
  url: string,
  options: CartRequestOptions = {},
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
};

export const clearCartRequest = async (): Promise<void> => {
  await api.delete("/cart");
};

export const checkoutCart = async (address: string): Promise<void> => {
  await api.post("/cart/checkout", { address });
};

export const mapCartItems = (items: ApiCartItem[]): CartItem[] =>
  items.map(({ product, quantity, unitPrice }) => ({
    productId: product._id,
    title: product.title,
    image: product.image,
    quantity,
    unitPrice: unitPrice ?? product.unitPrice ?? 0,
  }));

export const calculateCartTotal = (cart: ApiCart): number => {
  const items = mapCartItems(cart.items);

  return (
    cart.totalAmount ??
    items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  );
};
