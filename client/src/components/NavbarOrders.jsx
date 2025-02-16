import React from "react";
import { Link } from "react-router-dom";

const NavbarOrders = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link to="/" className="navbar-brand">
        <strong>ShopSphere</strong>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link to="/notifications" className="nav-link">
              <i className="bi bi-bell"></i> Notifications
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link">
              <i className="bi bi-cart"></i> Cart
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/checkout" className="nav-link">
              <i className="bi bi-cash"></i> Checkout
            </Link>
          </li>
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle"></i> Profile
            </Link>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <Link to="/customer/profile" className="dropdown-item">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="dropdown-item">
                  Logout
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarOrders;
