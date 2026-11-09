import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../features/products/pages/HomePage";
import Navbar from "../components/layout/Navbar";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CartPage from "../features/cart/pages/CartPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CheckoutPage from "../features/cart/pages/CheckoutPage";
import OrderSuccessPage from "../features/orders/pages/OrderSuccessPage";
import MyOrdersPage from "../features/orders/pages/MyOrdersPage";
import ProductDetailsPage from "../features/products/pages/ProductDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Product Details - Public Route */}
        <Route path="/product/:productId" element={<ProductDetailsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
