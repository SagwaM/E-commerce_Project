import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🚨 Import navigate


// Create Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate(); // ✅ Define navigate
  

  // Load user data from localStorage
  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  }, [token]);

  // 🔹 Fetch user profile (ensure token is valid)
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Session expired. Please log in again.");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Profile fetch failed:", error.message);
      logout(); // If token is invalid, log out the user
    }
  };

  // Login function
  const login = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 🛑 Debugging: Log response
      console.log("Login Response Data:", data);

      // ✅ Check if the response actually contains a token & user
      if (!data.token || !data.user) {
        throw new Error(data.message || "Invalid credentials"); 
      }

      setUser(data.user);
      setToken(data.token);

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      console.log("Login Successful! Redirecting...");
      navigate("/"); // Redirect to home page after login

      return data.user;
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message); // 🚨 Check if this alert appears
      throw error;
    }
  };

  // Signup function
  const signup = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed");
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
