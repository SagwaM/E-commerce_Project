import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShippingFast, FaLock, FaGift, FaFacebook, FaTwitter, FaInstagram, FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../styles/HomePage.css"; // Custom styles

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Load dark mode preference from local storage
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode); // Save preference
  }, [darkMode]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-4 fw-bold animate-fade-in">
          Welcome to Our E-Commerce Platform
        </h1>
        <p className="lead animate-slide-up">
          Discover amazing products at unbeatable prices. Shop now & enjoy exclusive deals!
        </p>
        
        {/* Shop Now Button */}
        <Link to="/signup" className="btn btn-primary shop-now-btn">Shop Now</Link>
      </section>

      {/* Features Section */}
      <section className="container text-center py-5">
        <h2 className="fw-bold">Why Shop With Us?</h2>
        <div className="row mt-4">
          <div className="col-md-4 animate-fade-in">
            <FaShippingFast size={50} className="text-primary" />
            <h4 className="mt-3">Fast & Free Shipping</h4>
            <p>Enjoy fast and reliable shipping on all orders.</p>
          </div>
          <div className="col-md-4 animate-fade-in">
            <FaLock size={50} className="text-primary" />
            <h4 className="mt-3">Secure Payments</h4>
            <p>We use 256-bit encryption to keep your transactions safe.</p>
          </div>
          <div className="col-md-4 animate-fade-in">
            <FaGift size={50} className="text-primary" />
            <h4 className="mt-3">Exclusive Discounts</h4>
            <p>Sign up today to get access to members-only deals!</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="customer-reviews text-center py-5">
        <div className="overlay"></div> {/* Background overlay for better text contrast */}
        <h2 className="fw-bold">What Our Customers Say</h2>
        <div className="row mt-4 position-relative">
          <div className="col-md-4 animate-slide-up">
            <p className="review-text">"Amazing service! My order arrived in just two days!"</p>
            <p className="fw-bold">- Sarah L.</p>
          </div>
          <div className="col-md-4 animate-slide-up">
            <p className="review-text">"Great quality products and excellent customer support!"</p>
            <p className="fw-bold">- Mike D.</p>
          </div>
          <div className="col-md-4 animate-slide-up">
            <p className="review-text">"I saved so much money with their deals. Highly recommended!"</p>
            <p className="fw-bold">- Lisa M.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section text-center py-5">
        <h2 className="fw-bold text-black">Join Us Today!</h2>
        <p className="text-black lead">Sign up now and start shopping with exclusive member discounts.</p>
      </section>

      {/* Footer */}
      <footer className="footer text-center py-4">
        <p className="mb-2">Follow us on social media</p>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook size={30} /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter size={30} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={30} /></a>
        </div>
        <p className="mt-3">&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </footer>

      {/* Dark Mode Toggle */}
      <div className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun size={25} /> : <FaMoon size={25} />}
      </div>
    </div>
  );
};

export default HomePage;
