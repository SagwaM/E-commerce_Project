import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import axios from "axios"; // Import Axios for API requests
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Categories
const categories = ["Explore", "Electronics", "Footwear", "Accessories", "Clothing", "Home and Kitchen"];

export const ProductsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]); // State for products
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Fetch products from backend
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    (selectedCategory === "Explore" || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ): [];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleAddToCart = (productId) => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("You need to log in first to add products to your cart.");
      navigate("/login");
    } 
    // Retrieve the current cart from localStorage or initialize it
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product is already in the cart
    const existingItem = cart.find(item => item._id === productId);
    if (existingItem) {
      iziToast.warning({ title: "Warning", message: "Product already in cart!" });
      return;
    }

    // Add new product to cart
    cart.push({ _id: productId, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show success message
    iziToast.success({ title: "Success", message: "Product added to cart!" });
  };

  return (
    <div
      className={isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}
      style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: isDarkMode
          ? "linear-gradient(135deg, #1e293b, #0f172a)" // Dark mode gradient
          : "linear-gradient(135deg,rgb(116, 131, 132), #bdc3c7)", // Calmer Kashmir/Celestial gradient
        color: isDarkMode ? "#e2e8f0" : "#1e293b",
      }}
    >
      {/* Header */}
      <header className={`py-3 px-4 shadow-sm ${isDarkMode ? "bg-secondary" : "bg-"}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className={`h3 m-0 {isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>Products</h1>
          
          <div>
            <Link to="/" className="btn btn-light">
              <i className="bi bi-house"></i> Home
            </Link>
          </div>
        </div>
      </header>

      <main className={`container py-4 ${isDarkMode ? "bg-secondary" : "bg-clear"}`}>
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        {/* Categories */}
        <div className={`container ${isDarkMode ? "bg-dark" : ""} p-3 rounded`}>
          <div className="mb-4 d-flex justify-content-center gap-3">
            {categories.map((category) => (
              <button style={{
                borderWidth: "3px",  // Thicker outline
                fontWeight: "bold",   // Thicker text
              }}
                key={category}
                className={`btn ${selectedCategory === category ? "btn-info" : "btn-outline-primary"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <h2 className="text-center mb-4">Explore Our Products</h2>
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map(product => (
              <div className="col-md-4 mb-4" key={product._id}>
                <div
                  className="card h-100"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, #334155, #1e293b)"
                      : "linear-gradient(135deg,rgb(65, 155, 146),rgb(27, 88, 148))",
                    color: isDarkMode ? "#e2e8f0" : "#1e293b",
                  }}
                >
                  <img
                    src={product.image || `https://via.placeholder.com/300x200?text=${product.name}`}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price.toFixed(2)}</p>
                    <Link to={`/products/${product._id}`} className="btn btn-primary">
                      <i className="bi bi-eye"></i> View Details
                    </Link>
                    <button className="btn btn-success ms-2" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-outline-info text-white" style={{
          borderWidth: "4px",  // Thicker outline
          fontWeight: "bold",   // Thicker text
          }} 
          disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span className="mx-3">Page {currentPage}</span>
          <button className="btn btn-outline-info text-dark"style={{
          borderWidth: "4px",  // Thicker outline
          fontWeight: "bold",   // Thicker text
          }} 
          disabled={indexOfLastProduct >= filteredProducts.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </main>
      
      <footer
        className={`footer py-4 text-center mt-auto ${
          isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
        }`}
      >
        <p>© 2025 E-Commerce Project. All rights reserved.</p>
      </footer>

      <button
        onClick={toggleTheme}
        className="btn btn-info position-fixed box-shadow"
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

export const ProductDetailPage = () => {
  const { id } = useParams();
  console.log("Product ID:", id);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (!id) {
      console.error("Product ID is missing");
      return;
    }

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`)
      .then((response) => {
        console.log("Product data:", response.data); // Debugging
        setProduct(response.data);
        setReviews(response.data.reviews || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [id]);
  const handleAddReview = () => {
    if (!newReview.trim()) return;
    
    const reviewData = { content: newReview, date: new Date().toLocaleDateString() };
    setReviews([...reviews, reviewData]);
    setNewReview("");
  };

  if (loading) return <p className="text-center">Loading...</p>;

  if (!product) {
    return (
      <div className="container text-center py-5">
        <h1>Product not found.</h1>
        <Link to="/products" className="btn btn-info mt-3">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div
      className={isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "linear-gradient(135deg, #85C1AE, #4D8A7B)", // Kashmir Gradient
        minHeight: "100vh",
      }}
    >
      <div className="container py-5">
        <h1 className="text-center mb-4">{product.name}</h1>
        <div className="row">
          <div className="col-md-6">
            <img
              src={product.image || `https://via.placeholder.com/500x300?text=${product.name}`}
              alt={product.name}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h3>${product.price.toFixed(2)}</h3>
            <p>{product.description}</p>
            <h5>Specifications:</h5>
            
            <ul>
              {Object.entries(product.specifications || {}).map(([key, value], index) => (
                <li key={index}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                </li>
              ))}
            </ul>
 
            <button className="btn btn-success mt-3" onClick={() => handleAddToCart(product._id)}>
              Add to Cart
            </button>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-5">
          <h3>Customer Reviews</h3>
          {reviews.length > 0 ? (
            <ul className="list-group">
              {reviews.map((review, index) => (
                <li key={index} className="list-group-item">
                  {review.content} - <small className="text-muted">{review.date}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
          <div className="mt-3">
            <textarea
              className="form-control"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write a review..."
            ></textarea>
            <button className="btn btn-info mt-2" onClick={handleAddReview}>
              Submit Review
            </button>
          </div>
        </div>
        
        <Link to="/products" className="btn btn-info mt-3">
          Back to Products
        </Link>
      </div>

      <footer
        className={`footer py-4 text-center mt-auto ${
          isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
        }`}
      >
        <p>© 2025 E-Commerce Project. All rights reserved.</p>
      </footer>

      <button
        onClick={toggleTheme}
        className="btn btn-info position-fixed box-shadow"
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
export default ProductsPage;