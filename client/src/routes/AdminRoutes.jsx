import { Routes, Route } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../Layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminSettings from "../pages/admin/AdminSettings";
//import Reports from "../pages/admin/Reports";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
