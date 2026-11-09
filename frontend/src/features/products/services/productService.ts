import api from "../../../lib/axios";
import type { Product } from "../../../types/Product";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/product");

  return response.data;
};
