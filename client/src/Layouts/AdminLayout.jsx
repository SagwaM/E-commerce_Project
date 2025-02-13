import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import "../styles/AdminDashboard.css"; // Admin-specific styles

const AdminLayout = () => {
    return (
        <div className="admin-container">
          {/* Fixed Sidebar */}
          <AdminSidebar />
    
          <div className="admin-main-content">
            {/* Fixed Top Navbar */}
            <AdminNavbar />
            
            {/* Main Dashboard Content */}
            <div className="admin-content">
              <Outlet />
            </div>
            {/* ✅ Fix Footer Visibility */}
            <AdminFooter />
          </div>
        </div>
    );
};

export default AdminLayout;
