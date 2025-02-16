import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import "animate.css"; // Import Animate.css for animations
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios"; // Import Axios for API requests

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]); // State for products

    // Toggle Theme
  const toggleTheme = () => {
      setIsDarkMode((prevMode) => !prevMode);
  };

  // Fetch featured products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/featured`); // Adjust API URL
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Back to Top Visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to Top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={isDarkMode ? "bg-dark text-white" : "bg-light text-dark"} 
    style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}>
      {/* Hero Section */}
      <section 
        className={`hero-section text-dark text-white d-flex align-items-center justify-content-center${isDarkMode ? "bg-secondary" : "bg-primary"}`}
        style={{ minHeight: "100vh", padding: "20px" }}
        >
        <div className="text-center animate__animated animate__fadeInLeft">
          <h1 className={`display-3 ${isDarkMode ? "text-white" : "text-dark"}`}>Welcome to ShopShpere</h1>
          <p className={`lead ${isDarkMode ? "text-light" : "text-dark"}`}>Discover amazing deals on your favorite products.</p>
          <Link to="/products" className="btn btn-warning btn-lg mt-3">
            <i className="bi bi-cart4 me-2"></i> Shop Now
          </Link>
        </div>
        <div className="animate__animated animate__fadeInRight">
          <img
            src="../assets/images/hero.webp"
            alt="Shopping illustration"
            className="img-fluid rounded"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className={`featured-products py-5 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`} style={{ width: "100vw", margin: 0, padding: 0  }}>
        <div className= {`container ${isDarkMode ? "bg-secondary text-white" : "bg-light text-dark"}`}>
          <h2 className="text-center mb-4 animate__animated animate__fadeInUp">Featured Products</h2>
          <div className="row">
          {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div className="col-md-4 mb-4" key={product._id}>
                  <div className={`card ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"} animate__animated animate__fadeIn`}>
                    <img src={product.image} className="card-img-top" alt={product.name} />
                    <div className="card-body text-center">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price.toFixed(2)}</p>
                      <Link to={`/products/${product._id}`} className="btn btn-primary">
                        <i className="bi bi-eye me-2"></i> View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Loading featured products...</p>
            )}
            
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className= {`categories-section py-5 ${isDarkMode ? "bg-secondary text-white" : "bg-light text-dark"}`} style={{ width: "100vw", margin: 0, padding: 0  }}>
        <div className={`container ${isDarkMode ? "bg-secondary text-white": "bg-light text-dark"} text-center animate__animated animate__fadeInUp`}>
          <h2 className={`mb-4 ${isDarkMode ? "bg-secondary text-white" : "bg-light text-dark"}`}>Shop by Categories</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card bg-dark text-white">
                <div className="card-body">
                  <i className="bi bi-laptop display-4"></i>
                  <h5 className="card-title mt-3">Electronics</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark text-white">
                <div className="card-body">
                  <i className="bi bi-watch display-4"></i>
                  <h5 className="card-title mt-3">Fashion</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`why-choose-us py-5 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`} style={{ width: "100vw", margin: 0, padding: 0  }}>
        <div className=" text-center animate__animated animate__fadeInUp">
          <h2 className="mb-4">Why Choose Us</h2>
          <div className="row">
            <div className="col-md-4">
              <i className="bi bi-truck display-4 text-primary"></i>
              <h5 className="mt-3">Fast Delivery</h5>
            </div>
            <div className="col-md-4">
              <i className="bi bi-shield-lock display-4 text-primary"></i>
              <h5 className="mt-3">Secure Payments</h5>
            </div>
            <div className="col-md-4">
              <i className="bi bi-headset display-4 text-primary"></i>
              <h5 className="mt-3">24/7 Support</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={`testimonials py-5 ${
          isDarkMode ? "bg-secondary text-white" : "bg-light text-dark"
        }`}
      >
        <div className={`container text-center ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
          <h2 className="mb-4">What Our Customers Say</h2>
          <div
            id="testimonialsCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <p>
                  "Amazing shopping experience! The products were delivered quickly and the
                  quality was fantastic."
                </p>
                <p>- Customer 1</p>
              </div>
              <div className="carousel-item">
                <p>"E-Shop has the best deals in town. Highly recommend their services!"</p>
                <p>- Customer 2</p>
              </div>
              <div className="carousel-item">
                <p>
                  "I found everything I needed in one place. Great customer support and secure
                  payment options."
                </p>
                <p>- Customer 3</p>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#testimonialsCarousel"
              data-bs-slide="prev"
              style={{ color: "black"}}
            >
              <span 
              className="carousel-control-prev-icon"
              style={{
                filter: "invert(1)",
                backgroundColor: "black",
                borderRadius: "50%",
              }}   
              ></span>

            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#testimonialsCarousel"
              data-bs-slide="next"
              style={{ color: "black"}}
            >
              <span 
                className="carousel-control-next-icon"
                style={{
                  filter: "invert(1)",
                  backgroundColor: "black",
                  borderRadius: "50%",
                }}
              ></span>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className= {`newsletter py-5 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
        <div className={`container text-center ${isDarkMode ? "bg-secondary text-white" : "bg-light text-dark"}`}>
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with the latest deals and discounts.</p>
          <div className="input-group mt-3" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <input type="email" className="form-control" placeholder="Enter your email" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`footer py-4 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"} text-center`} style={{ width: "100vw", margin: 0 }}>
        <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        {/* Social Icons */}
        <div className="social-icons mb-3">
          <a href="#" className={`me-3 ${isDarkMode ? "text-white" : "text-dark"}`}>
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className={`me-3 ${isDarkMode ? "text-white" : "text-dark"}`}>
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#" className={`me-3 ${isDarkMode ? "text-white" : "text-dark"}`}>
            <i className="bi bi-instagram"></i>
          </a>
        </div>
      </footer>

      {/* Theme Toggle Floating Button */}
      <button
        onClick={toggleTheme}
        className={`btn btn-light position-fixed rounded-circle p-2 ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}`}
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
        <i className={`bi ${isDarkMode ? "bi-sun" : "bi-moon"}`} style={{ fontSize: "24px" }}></i>
      </button>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`btn btn-light position-fixed rounded-circle p-2 ${
            isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
          }`}
          style={{
            bottom: "20px",
            right: "20px",
            width: "50px",
            height: "50px",
            zIndex: "1000",
            border: "none",
          }}
        >
          <i className="bi bi-arrow-up" style={{ fontSize: "24px" }}></i>
        </button>
      )}
    </div>
  );
};

export default HomePage;
