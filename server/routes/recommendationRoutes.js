const express = require("express");
const Product = require("../models/Product"); // Adjust based on your structure
const Order = require("../models/Order");
const router = express.Router();

// ✅ Fetch product recommendations for user
router.get("/:id", async (req, res) => {
  try {
    // Fetch user's previous orders
    const orders = await Order.find({ user: req.params.id }).populate("orderItems.product");

    if (!orders.length) return res.json([]);

    // Get list of previously ordered product categories
    const orderedCategories = [...new Set(orders.flatMap(order => order.orderItems.map(item => item.product.category)))];

    // Recommend products from the same categories
    const recommendedProducts = await Product.find({ category: { $in: orderedCategories } }).limit(5);

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
