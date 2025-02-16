import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import NavbarOrders from "../../components/NavbarOrders";

const ProfilePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    profilePic: "https://via.placeholder.com/100",
    language: "English",
    currency: "KES",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prevProfile) => ({ ...prevProfile, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.put("http://localhost:5000/api/users/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setError("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    alert("Account deactivated temporarily.");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      alert("Account deleted permanently.");
    }
  };

  return (
    <div className="flex-grow-1 p-4">
      {/* Navbar */}
      <NavbarOrders />
      <div className="container mt-4" style={{ width: "80vw", height: "80vh", margin: 0, padding: 0 }}>
        <h2>My Account</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <div className="card p-4">
          <div className="text-center">
            <img src={profile.profilePic} alt="Profile" className="rounded-circle" width="100" />
            <input type="file" accept="image/*" className="form-control mt-2" onChange={handleProfilePicChange} />
          </div>
          <div className="mt-3">
            <label>Full Name</label>
            <input type="text" className="form-control" name="name" value={profile.name} onChange={handleChange} />
          </div>
          <div className="mt-3">
            <label>Email (Non-editable)</label>
            <input type="email" className="form-control" value={profile.email} disabled />
          </div>
          <div className="mt-3">
            <label>Phone Number</label>
            <input type="text" className="form-control" name="phone" value={profile.phone} onChange={handleChange} />
          </div>
          <div className="mt-3">
            <label>Shipping Address</label>
            <input type="text" className="form-control" name="address" value={profile.address} onChange={handleChange} />
          </div>
          <div className="mt-3">
            <label>Role</label>
            <input type="text" className="form-control" value={profile.role} disabled />
          </div>
          <div className="mt-3 text-center">
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>

          {/* Settings Section */}
          <h4 className="mt-4">Settings</h4>
          <div className="mt-3">
            <label>Display Language</label>
            <select className="form-control" name="language" value={profile.language} onChange={handleChange}>
              <option value="English">English</option>
              <option value="Swahili">Swahili</option>
              <option value="French">French</option>
            </select>
          </div>
          <div className="mt-3">
            <label>Default Currency</label>
            <select className="form-control" name="currency" value={profile.currency} onChange={handleChange}>
              <option value="KES">KES</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Account Management */}
          <h4 className="mt-4">Account Management</h4>
          <button className="btn btn-warning mt-2" onClick={handleDeactivate}>
            Deactivate Account
          </button>
          <button className="btn btn-danger mt-2" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>

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
    </div>
  );
};

export default ProfilePage;
