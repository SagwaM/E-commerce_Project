const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, phone, address } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = new User({
      name,
      email,
      password: hashedPassword, // Save hashed password,
      phone,
      address,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT with role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, createdAt: user.createdAt },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route
// Example POST route for testing
router.post("/", (req, res) => {
    res.json({ message: "POST request to /api/auth/ is working!" });
  });
  router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
