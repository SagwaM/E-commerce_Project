import { useLocation } from "react-router-dom";

import AppRoutes from "./routes/routes";
import AdminRoutes from "./routes/AdminRoutes";

const AppLayout = () => {
  const location = useLocation();

  
  // ✅ Hide Navbar for ALL admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      
      <AppRoutes />
      <AdminRoutes />
    </div>
  );
};

function App() {
  return <AppLayout />; // ✅ Router is already in `main.jsx`
}

export default App;
