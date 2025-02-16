const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

// Feedback Route
router.post("/", async (req, res) => {
    try {
        const { userId, productId, review } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.reviews.push({ user: userId, review });
        await product.save();
        res.json({ message: "Feedback submitted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;