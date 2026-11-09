import { useQuery } from "@tanstack/react-query";

import ProductCard from "../components/ProductCard";
import type { Product } from "../types/Product";
import api from "../lib/axios";

const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/product");

  return response.data;
};

const HomePage = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-xl bg-muted" />
        ))}
      </main>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-10 max-w-2xl px-4 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Something went wrong while fetching products, please try again
            later.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isFetching ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
