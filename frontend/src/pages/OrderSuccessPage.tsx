import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleOrders = () => {
    navigate("/orders");
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12 dark:bg-[#111318] sm:px-6">
      <section className="flex w-full max-w-2xl flex-col items-center gap-5 rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14 dark:border-white/10 dark:bg-[#1A1C22]">
        {/* Success Icon */}
        <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={60} strokeWidth={1.8} />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          NEXORA STORE
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Order Placed Successfully!
        </h1>

        <p className="max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
          Thank you for your order. We have received your request and will start
          processing it shortly.
        </p>

        {/* Thank You Message */}
        <div className="mt-2 w-full rounded-2xl bg-gray-50 p-5 dark:bg-[#22252D]">
          <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
            Thank you for shopping with NEXORA. We hope you enjoy your purchase!
          </p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleHome}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </button>

          <button
            type="button"
            onClick={handleOrders}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] dark:border-white/10 dark:bg-transparent dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            My Orders
          </button>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccessPage;
