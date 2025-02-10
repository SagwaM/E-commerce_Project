const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Customer = require("../models/User");


router.get(
    "/orders",
    authMiddleware("Customer"), // Handles both authentication and role checking
    (req, res) => {
        res.json({ message: "Here are your orders!" });
    }
);

// Update customer profile
router.put("/update/:id", authMiddleware (["Admin", "Customer"]), async (req, res) => {
    const { id } = req.params; // Customer ID
    const { name, email, password, phone, address } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's fields if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (phone) user.phone = phone;
      if (address) user.address = address;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;