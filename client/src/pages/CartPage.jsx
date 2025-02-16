import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios"; // Ensure Axios is installed


export const CartPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const taxRate = 0.1; // 10% tax
  const shippingFee = 50.0;  

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  // Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token
    
        if (!token) {
          console.error("No token found! User may not be logged in.");
          return;
        }
    
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });
    
        console.log("Cart API response:", response.data);
        setCartItems(response.data.cart.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        
      }
    };    
    fetchCart();
  }, []);

  const handleQuantityChange = async (_id, quantity) => {
    if (quantity < 1){
        alert("Quantity must be at least 1");
        return;
    }    
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${_id}`, { quantity });
      setCartItems((prev) =>
        prev.map((item) => (item._id === _id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (_id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== _id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== _id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  const handleClearCart = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/cart`);
      setCartItems([]);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const toggleSelectItem = (_id) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(_id)) {
        return prevSelected.filter((itemId) => itemId !== _id);
      } else {
        return [...prevSelected, _id];
      }
    });
  };

  const handleSaveForLater = (_id) => {
    const itemToSave = cartItems.find((item) => item._id === _id);
    if (itemToSave) {
      setSavedItems((prev) => [...prev, itemToSave]);
      handleRemoveItem(_id);
    }
  };
  const handleMoveToCart = (_id) => {
    const itemToMove = savedItems.find((item) => item._id === _id);
    if (itemToMove) {
      setCartItems((prev) => [...prev, itemToMove]);
      setSavedItems((prev) => prev.filter((item) => item._id !== _id));
    }
  };

  const applyDiscountCode = () => {
    if (discountCode === "SAVE10") {
      setDiscount(0.1); // 10% discount
    } else {
      alert("Invalid discount code");
      setDiscount(0);
    }
  };

  const calculateTotal = () =>
    selectedItems.reduce((total, _id) => {
      const item = cartItems.find((item) => item._id === _id);
      return item ? total + item.product.price * item.quantity : total;
    }, 0);
  
  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    const tax = subtotal * taxRate;
    const discountAmount = subtotal * discount;
    return subtotal + tax + shippingFee - discountAmount;
 };
  return (
    <div
      className={`container-fluid d-flex flex-column justify-content-center align-items-center ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
      style={{
        width: "100vw",
        height: "100vh",
        background: isDarkMode
          ? "linear-gradient(135deg,rgb(54, 62, 72),rgb(22, 48, 89))"
          : "linear-gradient(135deg,rgb(236, 147, 244),rgb(108, 168, 228))",
        color: isDarkMode ? "#e2e8f0" : "#1e293b",
        }}
    >
      <h1 className="text-center mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty!</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="thead-light">
              <tr>
                <th>Select</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td>{item.product?.name || "N/A"}</td>
                  <td>${(item.product?.price || 0).toFixed(2)}</td>
                  <td>
                    <input
                        type="number"
                        value={item.quantity || 1}
                        min="1"
                        className="form-control"
                        onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value))
                        }
                    />
                  </td>
                  <td>${((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => handleSaveForLater(item.id)}
                    >
                      Save for Later
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <i className="bi bi-trash"></i> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="text-end">
          <h4>Subtotal: ${calculateTotal().toFixed(2)}</h4>
          <h5>Tax: ${(calculateTotal() * taxRate).toFixed(2)}</h5>
          <h5>Shipping Fee: ${shippingFee.toFixed(2)}</h5>
          {discount > 0 && <h5>Discount: -${(calculateTotal() * discount).toFixed(2)}</h5>}
          <h4>Final Total: ${calculateFinalTotal().toFixed(2)}</h4>
          
          <div className="mt-4">
            <input
              type="text"
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="form-control mb-2"
            />
            <button className="btn btn-primary btn-sm" onClick={applyDiscountCode}>
              Apply Discount
            </button>
          </div>
          {selectedItems.length > 0 ? (
            <Link to="/checkout" className="btn btn-success btn-sm mt-3">
              Proceed to Checkout
            </Link>
          ) : (
            <div>
              <button className={`btn btn-success btn-sm mt-3 ${selectedItems.length === 0 ? "disabled" : ""}`}>
                Proceed to Checkout
              </button>
              <p className="mt-2 text-muted">
                Select at least one item to proceed to checkout.
              </p>
            </div>
            
          )}
          <button className="btn btn-danger btn-sm mt-3 ms-3" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      )}

      
      {savedItems.length > 0 ? (
        <div className="mt-4">
          <h3>Saved for Later</h3>
          <ul className="list-group">
            {savedItems.map((item) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                {item.name} - ${item.price.toFixed(2)}
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleMoveToCart(item.id)}
                >
                  Move to Cart
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-muted">No items saved for later.</p>
      )}


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

export default CartPage;
