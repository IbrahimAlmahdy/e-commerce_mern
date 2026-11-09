import { useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/Cart/CartContext";
import api from "../lib/axios";
import { useAuth } from "../stores/authStore";
import axios from "axios";

const CheckoutPage = () => {
  const { cartItems, totalAmount } = useCart();
  const { token } = useAuth();

  const addressRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmOrder = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const address = addressRef.current?.value.trim();

    if (!address) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!token) {
      setError("Please log in before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await api.post("/cart/checkout", { address });

      navigate("/order-success");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          `Failed to place order (${err.response.status}). Please try again.`,
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-[#111318] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            NEXORA STORE
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Review your order and enter your delivery address.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 rounded-md p-1 transition hover:bg-red-100 dark:hover:bg-red-500/20"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <form
          onSubmit={handleConfirmOrder}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]"
        >
          <div className="flex flex-col gap-6">
            {/* Delivery Information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-[#1A1C22]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delivery Information
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Delivery Address
              </label>

              <textarea
                ref={addressRef}
                id="address"
                name="address"
                placeholder="Enter your full delivery address..."
                required
                rows={4}
                autoComplete="street-address"
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-[#22252D] dark:text-white"
              />
            </section>

            {/* Order Items */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-white/10 dark:bg-[#1A1C22]">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Package size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Order Items
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingBag
                    size={35}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />

                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Your cart is empty.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2 dark:bg-[#22252D]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {item.unitPrice.toFixed(2)} EGP each
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-gray-900 dark:text-white">
                        {(item.quantity * item.unitPrice).toFixed(2)} EGP
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Order Summary */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 dark:border-white/10 dark:bg-[#1A1C22]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="my-6 border-t border-gray-100 dark:border-white/10" />

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Products
              </span>

              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {cartItems.length}
              </span>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal
              </span>

              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {totalAmount.toFixed(2)} EGP
              </span>
            </div>

            <div className="my-5 border-t border-gray-100 dark:border-white/10" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Total Amount
              </span>

              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                {totalAmount.toFixed(2)} EGP
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirm Order
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              disabled={loading}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
              Please review your delivery details before confirming.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
