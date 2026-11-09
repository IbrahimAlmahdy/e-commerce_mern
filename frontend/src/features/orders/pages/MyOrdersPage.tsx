import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/stores/authStore";
import { useOrders } from "../hooks/useOrders";
import type { Order, OrderProduct } from "../types/order.types";

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
    case "completed":
      return {
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
        icon: CheckCircle2,
      };

    case "shipped":
      return {
        className:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
        icon: Truck,
      };

    case "processing":
      return {
        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
        icon: Clock3,
      };

    case "cancelled":
    case "canceled":
      return {
        className:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
        icon: XCircle,
      };

    default:
      return {
        className:
          "border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400",
        icon: Package,
      };
  }
};

const formatStatus = (status?: string) => {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getOrderItems = (order: Order): OrderProduct[] => {
  if (Array.isArray(order.orderItems)) {
    return order.orderItems.map((item) => ({
      title: item.productTitle,
      image: item.productImage,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
  }

  return order.items ?? [];
};

const formatDate = (date?: string) => {
  if (!date || Number.isNaN(Date.parse(date))) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyOrdersPage = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useOrders({ token, isAuthenticated });

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Something went wrong while loading your orders."
    : "";

  if (!isAuthenticated || !token) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-[#111318]">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10 dark:border-white/10 dark:bg-[#1A1C22]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Package size={38} />
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Sign in to view your orders
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
            Log in to access your order history and track your purchases.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-7 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-[#111318] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              NEXORA STORE
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Track your purchases and manage your order history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#1A1C22] dark:text-gray-300 dark:hover:bg-white/5"
            >
              <ArrowLeft size={17} />
              Shop
            </button>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={isFetching ? "animate-spin" : ""}
              />
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="rounded-lg px-3 py-1.5 font-bold transition hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-500/20"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 bg-white py-20 dark:border-white/10 dark:bg-[#1A1C22]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600 dark:border-white/10 dark:border-t-blue-400" />

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Loading your orders...
            </p>
          </div>
        ) : !isError && orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:py-20 dark:border-white/10 dark:bg-[#1A1C22]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <ShoppingBag size={38} />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              No orders yet
            </h2>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Your purchases will appear here after checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          !isError && (
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const items = getOrderItems(order);
                const status = formatStatus(order.status);
                const total = Number(order.total ?? order.totalAmount ?? 0);
                const statusStyle = getStatusStyle(status);
                const StatusIcon = statusStyle.icon;

                return (
                  <article
                    key={order._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-white/10 dark:bg-[#1A1C22] dark:hover:border-blue-500/30"
                  >
                    <div className="flex flex-col gap-4 bg-gray-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:bg-[#22252D]">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold tracking-widest text-gray-400 dark:text-gray-500">
                          ORDER NUMBER
                        </p>

                        <p className="mt-2 break-all text-sm font-extrabold text-gray-900 dark:text-white">
                          #{order._id}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CalendarDays size={16} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${statusStyle.className}`}
                      >
                        <StatusIcon size={15} />
                        {status}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 dark:border-white/10" />

                    <div className="p-5 sm:p-7">
                      {items.length > 0 ? (
                        <div className="flex flex-col gap-5">
                          {items.map((item, index) => (
                            <div
                              key={`${item.productId ?? item.title}-${index}`}
                              className="flex items-center gap-3 sm:gap-5"
                            >
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-2 sm:h-20 sm:w-20 dark:border-white/10 dark:bg-[#22252D]">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <ShoppingBag
                                    size={28}
                                    className="text-gray-400"
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="break-words text-sm font-bold leading-6 text-gray-900 dark:text-white">
                                  {item.title}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="whitespace-nowrap text-sm font-extrabold text-gray-900 dark:text-white">
                                  {(
                                    Number(item.unitPrice) * item.quantity
                                  ).toFixed(2)}{" "}
                                  EGP
                                </p>

                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                  {Number(item.unitPrice).toFixed(2)} / item
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No product details available for this order.
                        </p>
                      )}

                      {order.address && (
                        <>
                          <div className="my-6 border-t border-gray-100 dark:border-white/10" />

                          <div className="flex items-start gap-3">
                            <MapPin
                              size={19}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                Delivery Address
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200">
                                {order.address}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-white/10" />

                    <div className="flex items-center justify-between gap-4 bg-gray-50 px-5 py-4 sm:px-7 dark:bg-[#22252D]">
                      <div>
                        <p className="text-xs font-extrabold tracking-widest text-gray-400 dark:text-gray-500">
                          TOTAL AMOUNT
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {items.length} {items.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-lg font-extrabold text-blue-600 dark:text-blue-400 sm:text-xl">
                        {total.toFixed(2)} EGP
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default MyOrdersPage;
