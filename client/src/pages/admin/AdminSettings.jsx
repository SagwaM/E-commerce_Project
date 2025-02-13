import { useState } from "react";
import axios from "axios";

const AdminSettings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateProfile = async () => {
    try {
      await axios.put("/api/admin/update-profile", { email, password });
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div>
      <h2>Admin Settings</h2>
      <input type="email" placeholder="Update Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={updateProfile}>Update</button>
    </div>
  );
};

export default AdminSettings;
