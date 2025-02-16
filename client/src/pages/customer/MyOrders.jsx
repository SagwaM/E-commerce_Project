import React, {useEffect, useState} from "react";
import NavbarOrders from "../../components/NavbarOrders";
import SidebarOrders from "../../components/SidebarOrders";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
    // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
        setLoading(true);
        setError(null);  

        const token = localStorage.getItem("token"); // Get the JWT token
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }
        console.log("Fetching orders...");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my-orders`,{
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        
        console.log('Raw Response:', response); //debugging
        const data = response.data; // Ensure we get the actual data object
        console.log('Fetched Orders:', data);
        // ✅ Extract the correct data path
      
        if (!data.orders || data.orders.length === 0) {
            console.warn("No orders found, setting dummy data.");
            setOrders([]); // Set empty array if no orders
            return;
        }

        setOrders(data.orders);
        console.log("Orders Set:", data.orders); // ✅ Check if orders are set
      } catch (error) {
    
        console.error("Error fetching orders:", error);
        setError(error.response?.data?.message || "Failed to fetch orders.");

        // ✅ Improve error message handling
        if (error.response) {
        setError(`Failed to fetch orders: ${error.response.data.message || error.message}`);
        } else {
        setError("Failed to fetch orders. Please try again.");
        }
    } finally {
        setLoading(false);
    }
 };
 useEffect(() => {
    fetchOrders();
    setOrders([]);
 }, []);
  
 if (loading) {
   console.log("Component is loading...");
   return <div className="text-center mt-5">Loading...</div>;
  }
  if (error) {
    console.error("Rendering error message:", error);
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }
  // ✅ Fix: Function to handle "View Details"
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  console.log("Rendering MyOrders component, Orders:", orders);

  return (
    <div className={`d-flex ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`} style={{ height: "100vh", width: "100vw", margin: "0" }}>
      {/* Sidebar */}
      <SidebarOrders />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Navbar */}
        <NavbarOrders />

        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <div className="alert alert-info mt-4">No orders found.</div>
        ) : (
        <table className={`table table-striped mt-4 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
          <thead className={`${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          
            {orders.map((order, index) => {
            console.log(`Order ${index + 1}:`, order); // ✅ Log each order
            return (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>Ksh{order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === "Delivered"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewDetails(order)}
                  >
                      View Details
                  </button>
                </td>
              </tr>
           );
        })}
          </tbody>
        </table>
        )}
      </div>
      <button
        onClick={toggleTheme}
        className="btn btn-secondary"
        style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "50px",
            height: "50px",
            zIndex: "1000",
            border: "none",
        }}
      >
        <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"}`}></i>
      </button>

      {/* Bootstrap Modal for Order Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>

              <h5>Products Ordered</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td>Ksh {item.product.price.toFixed(2)}</td>
                      <td>Ksh {(item.quantity * item.product.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4><strong>Total Price: </strong> Ksh {selectedOrder.totalPrice.toFixed(2)}</h4>
            </>
          ) : (
            <p>No order details found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
};

export default MyOrders;
