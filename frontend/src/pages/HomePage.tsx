import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import type { Product } from "../types/Product";
import { BASE_URL } from "../constants/baseUrl";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-2xl px-4 text-center">
        <p className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          Something went wrong while fetching products, please try again later.
        </p>
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
