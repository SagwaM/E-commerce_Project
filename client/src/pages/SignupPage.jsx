import { Link } from "react-router-dom"; // ✅ Import Link
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../index.css"; // Import CSS styles
import "../styles/HomePage.css"; // Custom styles

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
      navigate("/"); // Redirect to home after signup
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "800px", width: "100%" }}>
        <h2 className="text-center text-primary mb-4">Create an Account</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="name" className="form-control" placeholder="Full Name" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="phone" className="form-control" placeholder="Phone Number" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="address" className="form-control" placeholder="Address" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" onChange={handleChange} required />
          </div>

          <button className="btn btn-primary w-100">Sign Up</button>
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
