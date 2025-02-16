import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
      setIsDarkMode((prevMode) => !prevMode);
  };

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch cart items from backend
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          console.error("No token found, redirecting to login...");
          navigate("/login"); // Redirect if no token
          return;
        }    
        const response = await axios.get("http://localhost:5000/api/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart Response:", response.data); // Debugging
        setCartItems(response.data.cart.items || []);
        setSelectedItems(response.data.map((item) => item._id)); // Select all by default
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
        }
      }
    };
    fetchCartItems();
  }, []);

  const itemsToCheckout = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  const calculateTotal = () =>
    itemsToCheckout.reduce((total, item) => total + item.price * item.quantity,0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleMpesaPayment = async () => {
    try {
      setLoading(true);

      // Send payment request to your backend
      const response = await axios.post(
        "http://localhost:5000/api/mpesa/pay",
        {
          amount: calculateTotal(),
          phone: formData.phone, // Phone number to receive STK push
          name: formData.name, // Customer's name
          items: itemsToCheckout, // Cart items
        }
      );

      setLoading(false);
      if (response.data.success) {
        alert("Payment request sent. Check your phone to complete payment.");
      } else {
        alert("Payment failed. Try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("M-Pesa payment error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (itemsToCheckout.length === 0) {
      alert("No items selected for checkout.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get JWT token
      if (!token) {
        alert("You must be logged in to place an order.");
        navigate("/login");
        return;
      }

      const orderData = {
        user: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: itemsToCheckout.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: calculateTotal(),
        paymentMethod,
        status: "pending",
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders/checkout", // Send order data to backend
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      alert("Order placed successfully!");

      navigate("/orders"); // Redirect to orders page
    } catch (error) {
      setLoading(false);
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  return (
    <div
      className="container py-5"
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #e2e2e2, #ffffff)",
      }}
    >
      <h1 className="text-center mb-4">Checkout</h1>
      <div className="row">
        {/* Cart Summary */}
        <div className="col-md-6">
          <h3>Selected Items</h3>
          {itemsToCheckout.length === 0 ? (
            <p>No items selected. Please go back to the cart.</p>
          ) : (
            <ul className="list-group mb-4">
              {itemsToCheckout.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <h4 className="text-end">Total: ${calculateTotal().toFixed(2)}</h4>
        </div>

        {/* Customer Details Form */}
        <div className="col-md-6">
          <h3>Customer Details</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Shipping Address
              </label>
              <textarea className="form-control" id="address" name="address" rows="3" value={formData.address} onChange={handleInputChange} required></textarea>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-4">
        <h3>Payment Method</h3>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="paymentMethod" id="mpesa" value="mpesa" checked={paymentMethod === "mpesa"} onChange={(e) => setPaymentMethod(e.target.value)} />
          <label className="form-check-label" htmlFor="mpesa">M-Pesa</label>
        </div>

        <div className="form-check">
          <input className="form-check-input" type="radio" name="paymentMethod" id="creditcard" value="creditcard" checked={paymentMethod === "creditcard"} onChange={(e) => setPaymentMethod(e.target.value)} />
          <label className="form-check-label" htmlFor="creditcard">Credit Card</label>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-4 d-flex justify-content-center gap-3">
        <button className="btn btn-primary btn-sm" onClick={handleCheckout} disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
        <Link to="/cart" className="btn btn-secondary btn-sm">Back to Cart</Link>
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
    </div>
  );
};

export default CheckoutPage;
