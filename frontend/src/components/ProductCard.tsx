import { useState } from "react";
import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/Cart/CartContext";
import { useAuth } from "../stores/authStore";
interface Props {
  _id: string;
  title: string;
  image: string;
  price: string;
}

export default function ProductCard({ _id, title, image, price }: Props) {
  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setIsAdding(true);
      await addItemToCart(_id);
    } finally {
      setIsAdding(false);
    }
  };

  const formattedPrice = Number(price).toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/10 dark:border-white/10 dark:bg-[#1A1C22] dark:hover:border-blue-400/40">
      {/* Product Image */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-50 p-6 dark:bg-[#22252D]">
        {!imageError && image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            Image unavailable
          </div>
        )}

        {/* Quick View Decoration */}
        <div className="absolute right-4 top-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-gray-700 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-[#30343D] dark:text-white">
          <ArrowUpRight size={17} />
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          title={title}
          className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
        >
          {title}
        </h3>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Price
            </p>

            <p className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {formattedPrice}
              <span className="ml-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                EGP
              </span>
            </p>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart size={17} />

          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
