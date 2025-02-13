import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Loader from "../components/Loader"; // ✅ Import a loading spinner component

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("ProtectedRoute check - User:", user);

  if (loading) return <Loader />;

  if (!user) {
    console.log("🔴 No user found, redirecting to /login");
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "Admin") {
    console.log("🔴 Unauthorized: User is not an admin, redirecting to /unauthorized");
    return <Navigate to="/unauthorized" />;
  }

  console.log("✅ User is authorized, rendering component");
  return children;
};

export default ProtectedRoute;
