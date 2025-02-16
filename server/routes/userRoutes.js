const express = require("express");
const User = require("../models/User"); // Adjust based on your structure
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


// ✅ Get user details by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password for security
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// 📌 Get User Profile (Protected Route)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id);
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Returning user profile:", user);
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      profilePic: user.profilePic || "https://via.placeholder.com/100",
    });
  } catch (error) {
    console.error("Error in /profile route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Update User Profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.profilePic = req.body.profilePic || user.profilePic;

    const updatedUser = await user.save();
    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
