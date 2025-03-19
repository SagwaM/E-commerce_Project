import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ProfilePage from "../pages/customer/ProfilePage";
import MyOrders from "../pages/customer/MyOrders";
import ProtectedRoute from "./ProtectedRoute"; 
import ProductsPage, { ProductDetailPage } from "../pages/ProductPage"; 

const AppRoutes = () => {
  return (
    <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/customer/my-orders" element={<MyOrders />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
        

        {/* ✅ Protected Customer Route */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
    </Routes>
    
  );
};

export default AppRoutes;
