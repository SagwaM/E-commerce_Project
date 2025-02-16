import { Link } from "react-router-dom"; // ✅ Import Link
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from "react-icons/fa"; // Icons for email, password, phone, and address


const SignupPage = ({ darkMode }) => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(formData);
      navigate("/login"); // Redirect to home after signup
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "linear-gradient(to right, #2E3192, #1BFFFF)", position: "relative" }}>
      {/* ShopSphere Name */}
      <h1 className="text-dark position-absolute top-0 start-50 translate-middle-x" style={{ fontSize: "4rem", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
        ShopSphere
      </h1>

      <div className="card p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%", height: "auto" }}>
        <h2 className="text-center text-info mb-4">Create an Account</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <input
              type="text"
              name="name"
              className="form-control ps-5"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: "20px" }} />
            <input
              type="email"
              name="email"
              className="form-control ps-5"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <FaPhone className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: "20px" }} />
            <input
              type="text"
              name="phone"
              className="form-control ps-5"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <FaMapMarkerAlt className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: "20px" }} />
            <input
              type="text"
              name="address"
              className="form-control ps-5"
              placeholder="Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: "20px" }} />
            <input
              type="password"
              name="password"
              className="form-control ps-5"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: "20px" }} />
            <input
              type="password"
              name="confirmPassword"
              className="form-control ps-5"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-info w-100 py-2 mt-3 shadow-lg">Sign Up</button>
        </form>

        {/* Already have an account? Login link */}
        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
