import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/routes";
import AdminRoutes from "./routes/AdminRoutes";

const AppLayout = () => {
  const location = useLocation();

  
  // ✅ Define routes where Navbar should NOT appear
  const hideNavbarRoutes = ["/signup", "/login"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCustomerDashboard = location.pathname.startsWith("/customer");

  return (
    <div>
      
      {/* ✅ Show Navbar only on public pages */}
      {!hideNavbarRoutes.includes(location.pathname) && !isAdminRoute && !isCustomerDashboard && (
        <Navbar />
      )}
    
      {/* ✅ Render routes */}
      <AppRoutes />
      <AdminRoutes />
    </div>
  );
};

function App() {
  return <AppLayout />; // ✅ Router is already in `main.jsx`
}

export default App;
