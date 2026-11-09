import { useState } from "react";
import {
  ShoppingCart,
  Moon,
  Sun,
  UserRound,
  Package,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/stores/authStore";
import { useCart } from "../../features/cart/hooks/useCart";
import { useThemeMode } from "../../theme/ThemeModeContext";
import nexoraLogo from "../../assets/nexora-logo.png";

function Navbar() {
  const { username, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const { mode, toggleColorMode } = useThemeMode();

  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCart = () => {
    navigate(isAuthenticated ? "/cart" : "/login");
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101114]/95 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className="group flex items-center gap-3"
          aria-label="Go to homepage"
        >
          <img
            src={nexoraLogo}
            alt="NEXORA"
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          />

          <div className="flex flex-col items-start">
            <span className="text-xl font-extrabold tracking-[0.18em] text-white">
              NEXORA
            </span>
            <span className="text-[9px] font-medium tracking-[0.25em] text-blue-400">
              PREMIUM ELECTRONICS
            </span>
          </div>
        </button>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleColorMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={handleCart}
            aria-label={`Shopping cart, ${cartItems.length} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <ShoppingCart size={21} />

            {cartItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#101114]">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            )}
          </button>

          <div className="mx-1 h-7 w-px bg-white/10" />

          {/* Authenticated User */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/15 text-blue-400">
                  <UserRound size={19} />
                </div>

                <div className="flex flex-col items-start">
                  <span className="max-w-32 truncate text-sm font-semibold text-white">
                    {username}
                  </span>
                  <span className="text-xs text-gray-400">My Account</span>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1C22] p-2 shadow-2xl shadow-black/30"
                >
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {username}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleNavigate("/orders")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Package size={18} />
                    My Orders
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-colors hover:bg-white/10"
          >
            {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            type="button"
            onClick={handleCart}
            aria-label={`Shopping cart, ${cartItems.length} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-colors hover:bg-white/10"
          >
            <ShoppingCart size={20} />

            {cartItems.length > 0 && (
              <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-bold text-white">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition-colors hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#15171C] px-4 py-4 md:hidden">
          {isAuthenticated ? (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                  <UserRound size={20} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {username}
                  </p>
                  <p className="text-xs text-gray-400">My Account</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate("/orders")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Package size={18} />
                My Orders
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
