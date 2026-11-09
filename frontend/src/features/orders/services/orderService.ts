import api from "../../../lib/axios";
import type { Order } from "../types/order.types";

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get<unknown>("/cart/orders");
  const data = response.data;

  const result = Array.isArray(data)
    ? data
    : typeof data === "object" &&
        data !== null &&
        "orders" in data &&
        Array.isArray(data.orders)
      ? data.orders
      : null;

  if (!result) {
    throw new Error("The server returned an unexpected orders format.");
  }

  return result as Order[];
};
