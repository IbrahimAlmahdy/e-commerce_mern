import { useQuery } from "@tanstack/react-query";

import { fetchOrders } from "../services/orderService";

interface UseOrdersOptions {
  token: string | null;
  isAuthenticated: boolean;
}

export const useOrders = ({
  token,
  isAuthenticated,
}: UseOrdersOptions) =>
  useQuery({
    queryKey: ["orders", token],
    queryFn: fetchOrders,
    enabled: Boolean(isAuthenticated && token),
  });
