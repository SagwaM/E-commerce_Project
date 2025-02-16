import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Email and password icons

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(formData);
      
      // Redirect based on user role
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "linear-gradient(to right, #2E3192, #1BFFFF)", position: "relative" }}>
      {/* ShopSphere Name */}
      <h1 className="text-dark position-absolute top-0 start-50 translate-middle-x" style={{ fontSize: "4rem", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
        ShopSphere
      </h1>

      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%", height: "auto" }}>
        <h2 className="text-center text-info mb-4">Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
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

          <button className="btn btn-info w-100 py-2 mt-3 shadow-lg">Login</button>
        </form>

        {/* Sign up link */}
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
