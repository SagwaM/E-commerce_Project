const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import your models
const Order = require("../models/Order"); // Adjust to your order model
const User = require("../models/User"); 


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
  
  // Fetch customer details (name, membership status)
  router.get("/details", authMiddleware("Customer"), async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("name membershipStatus");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({
        name: user.name,
        membershipStatus: user.membershipStatus || "Regular",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Fetch customer order statistics
  router.get("/stats", authMiddleware("Customer"), async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id });
  
      if (!orders.length) {
        return res.json({
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: "No Orders Yet",
          mostPurchasedItem: "N/A",
        });
      }
  
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      const lastOrder = orders[orders.length - 1]; // latest order is last

      // Convert last order into a readable string
    const formattedLastOrder = `${new Date(lastOrder.createdAt).toDateString()} - ${lastOrder.status}`;
  
      // Find the most purchased item
      const itemCounts = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          itemCounts[item.product] = (itemCounts[item.product] || 0) + item.quantity;
        });
      });
  
      const mostPurchasedItem = Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] > itemCounts[b] ? a : b), "N/A");
  
      res.json({
        totalOrders,
        totalSpent,
        lastOrder: formattedLastOrder,
        mostPurchasedItem,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Fetch all orders for a customer
  router.get("/orders", authMiddleware("Customer"), async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update customer profile
  router.put("/update/:id", authMiddleware(["Admin", "Customer"]), async (req, res) => {
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
  
module.exports = router;