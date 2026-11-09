import { useMemo, useState } from "react";

import ProductCard from "../components/ProductCard";
import ProductToolbar from "../components/ProductToolbar";
import { useProducts } from "../hooks/useProducts";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProducts();

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = products.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearch),
    );

    if (sortOrder === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [products, searchTerm, sortOrder]);

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
      <ProductToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
          <h2 className="text-xl font-bold text-foreground">
            No Products Found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Try searching with a different product name.
          </p>

          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Clear Search
          </button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
