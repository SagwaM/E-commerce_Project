import { Link, useNavigate} from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { FaHome, FaShoppingCart, FaUsers, FaBox, FaSignOutAlt, FaUser } from "react-icons/fa";
import "../styles/Sidebar.css"; // Custom styles

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Ensure redirection works

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
    console.log("Navigating to login");
    navigate("/login", { replace: true }); // ✅ Force navigation
  };
  
  if (!user) return null; // ❌ Don't show sidebar if not logged in

  return (
    <aside className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <FaHome /> Home
          </Link>
        </li>

        {user.role === "admin" ? (
          <>
            <li>
              <Link to="/admin/dashboard">
                <FaUsers /> Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products">
                <FaBox /> Manage Products
              </Link>
            </li>
            <li>
              <Link to="/admin/orders">
                <FaShoppingCart /> Manage Orders
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/customer/dashboard">
                <FaUser /> My Dashboard
              </Link>
            </li>
            <li>
              <Link to="/customer/orders">
                <FaShoppingCart /> My Orders
              </Link>
            </li>
          </>
        )}

        <li>
        <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
