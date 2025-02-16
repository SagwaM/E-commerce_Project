import React from "react";
import { Link } from "react-router-dom";

const SidebarOrders = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 bg-dark text-white p-3"
      style={{ width: "250px", height: "100vh" }}
    >
      <h4 className="text-center mb-4">Customer Dashboard</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/customer/dashboard" className="nav-link text-white">
            <i className="bi bi-house me-2"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/customer/my-orders" className="nav-link text-white">
            <i className="bi bi-bag me-2"></i> My Orders
          </Link>
        </li>
        <li>
          <Link to="/cart" className="nav-link text-white">
            <i className="bi bi-cart me-2"></i> My Cart
          </Link>
        </li>
        <li>
          <Link to="/dashboard/account" className="nav-link text-white">
            <i className="bi bi-person me-2"></i> My Account
          </Link>
        </li>
        <li>
          <Link to="/customer/profile" className="nav-link text-white">
            <i className="bi bi-gear me-2"></i> Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarOrders;
