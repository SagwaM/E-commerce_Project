import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/AdminDashboard.css";

const AdminNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <FaSearch />
        
      </div>

      <div className="admin-profile">
        <span>{user?.name}</span>
        <FaUserCircle className="profile-icon" />
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        
      </div>
    </nav>
  );
};

export default AdminNavbar;
