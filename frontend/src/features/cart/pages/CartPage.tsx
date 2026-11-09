import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../hooks/useCart";

const CartPage = () => {
  const {
    cartItems,
    totalAmount,
    error,
    updateItemInCart,
    removeItemInCart,
    clearCart,
    clearError,
  } = useCart();

  const navigate = useNavigate();

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    void updateItemInCart(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    void removeItemInCart(productId);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleClearCart = () => {
    void clearCart();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-[#111318] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Your Shopping Bag
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              My Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={clearError}
              aria-label="Dismiss error"
              className="shrink-0 rounded-md p-1 transition hover:bg-red-100 dark:hover:bg-red-500/20"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm dark:border-white/10 dark:bg-[#1A1C22]">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <ShoppingBag size={35} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your cart is empty
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Looks like you haven't added anything to your cart yet. Explore
              our collection and find something you love.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-7 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Continue Shopping
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_350px]">
            <section className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <article
                  key={item.productId}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-white/10 dark:bg-[#1A1C22]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2 dark:bg-[#22252D]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-base font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {item.unitPrice.toFixed(2)} EGP × {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                        Subtotal: {(item.unitPrice * item.quantity).toFixed(2)}{" "}
                        EGP
                      </p>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={14} />
                        Remove Item
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:justify-end sm:border-0 sm:pt-0 dark:border-white/10">
                    <span className="text-sm font-medium text-gray-500 sm:hidden dark:text-gray-400">
                      Quantity
                    </span>

                    <div
                      className="flex items-center rounded-xl border border-gray-200 dark:border-white/10"
                      aria-label={`Quantity controls for ${item.title}`}
                    >
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        onClick={() =>
                          handleQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          handleQuantity(item.productId, item.quantity + 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 dark:border-white/10 dark:bg-[#1A1C22]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="my-6 border-t border-gray-100 dark:border-white/10" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Amount
                </span>

                <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {totalAmount.toFixed(2)} EGP
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Proceed to Checkout
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Continue Shopping
              </button>

              <p className="mt-5 text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
                Your order details will be reviewed before checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
