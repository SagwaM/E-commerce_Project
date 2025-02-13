import { Link } from "react-router-dom";
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaChartBar, FaTags, FaSignOutAlt, FaCog } from "react-icons/fa";
import "../styles/AdminDashboard.css"; // Admin styles

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className="sidebar-link">
          <FaHome /> Dashboard
        </Link>
        <Link to="/admin/orders" className="sidebar-link">
          <FaShoppingCart /> Orders
        </Link>
        <Link to="/admin/products" className="sidebar-link">
          <FaBox /> Products
        </Link>
        <Link to="/admin/users" className="sidebar-link">
          <FaUsers /> Users
        </Link>
        <Link to="/admin/reports" className="sidebar-link">
          <FaChartBar /> Reports
        </Link>
        <Link to="/admin/promotions" className="sidebar-link">
          <FaTags /> Promotions
        </Link>
        <Link to="/admin/settings" className="sidebar-link">
          <FaCog /> Settings
        </Link>
        <Link to="/logout" className="sidebar-link logout">
          <FaSignOutAlt /> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
