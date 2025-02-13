import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const AdminProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "Admin") {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
