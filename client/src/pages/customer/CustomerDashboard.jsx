import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerDashboard = () => {
  return (
    <div className="d-flex" style={{ height: "100vh", width: "100vw", margin: "0" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", height: "100vh", position: "fixed" }}
      >
        <h3 className="text-center">Customer Dashboard</h3>
        <ul className="nav flex-column mt-4">
          <li className="nav-item mb-2">
            <a href="/customer/dashboard" className="nav-link text-white">
              <i className="bi bi-house me-2"></i> Dashboard Overview
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/customer/my-orders" className="nav-link text-white">
              <i className="bi bi-box me-2"></i> Orders
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              <i className="bi bi-heart me-2"></i> Wishlist
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="/customer/profile" className="nav-link text-white">
              <i className="bi bi-person me-2"></i> Profile Settings
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              <i className="bi bi-question-circle me-2"></i> Support
            </a>
          </li>
          <li className="nav-item mt-auto">
            <a href="/login" className="nav-link text-white">
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px", padding: "20px", width: "calc(100% - 250px)" }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <i className="bi bi-shop me-2"></i>ShopSphere
            </a>
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
                  <a className="nav-link" href="#">
                    <i className="bi bi-bell me-2"></i>Notifications
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/cart">
                    <i className="bi bi-cart me-2"></i>Cart
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="profileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-2"></i>Profile
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li>
                      <a className="dropdown-item" href="/customer/profile">Account Settings</a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/login">Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div>
          <h2>Welcome back, [Customer Name]!</h2>
          <p>Status: <strong>Gold Member</strong></p>
          
          {/* Quick Order Summary */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h5>Total Orders</h5>
                <p>📦 <strong>X</strong></p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h5>Total Spent</h5>
                <p>💰 <strong>$Total Amount</strong></p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h5>Last Order</h5>
                <p>🔄 <strong>Date & Status</strong></p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h5>Most Purchased Item</h5>
                <p>🛍️ <strong>Product Name</strong></p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <h3>Recent Orders</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#12345</td>
                <td>Jan 10, 2025</td>
                <td>Shipped</td>
                <td>$120</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary">View All Orders</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
