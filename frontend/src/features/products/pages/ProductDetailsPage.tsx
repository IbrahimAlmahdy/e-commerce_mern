import { useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../auth/stores/authStore";
import { useCart } from "../../cart/hooks/useCart";
import { useProducts } from "../hooks/useProducts";

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const { addItemToCart } = useCart();

  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProducts();

  const product = products.find((item) => item._id === productId);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      setIsAdding(true);
      await addItemToCart(product._id);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-10 md:grid-cols-2">
          <div className="h-96 rounded-2xl bg-muted" />
          <div className="space-y-5 py-8">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-6 w-1/3 rounded bg-muted" />
            <div className="h-12 w-full rounded bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-foreground">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Unable to load product details. Please try again.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Try Again"}
        </button>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Product Not Found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The product you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft size={17} />
          Back to Store
        </Link>
      </main>
    );
  }

  const formattedPrice = Number(product.price).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={18} />
        Back to Store
      </Link>

      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Product Image */}
        <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/50 p-8 sm:min-h-[480px] sm:p-12">
          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.title}
              onError={() => setImageError(true)}
              className="max-h-[420px] w-full object-contain"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Image unavailable</p>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Product Details
          </p>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-8 border-y border-border py-6">
            <p className="text-sm font-medium text-muted-foreground">Price</p>

            <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
              {formattedPrice}
              <span className="ml-2 text-base font-semibold text-muted-foreground">
                EGP
              </span>
            </p>
          </div>

          <p className="mt-6 text-sm leading-7 text-muted-foreground">
            Discover this product and add it to your shopping cart.
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <ShoppingCart size={19} />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </section>
    </main>
  );
}
