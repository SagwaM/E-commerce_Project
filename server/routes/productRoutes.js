const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const router = express.Router();



// Admin: Add a Product
router.post(
  "/",
  authMiddleware("Admin"),
  async (req, res) => {
    console.log("Request received:", req.body);
    try {
      const { name, description, price, category, stock, image } = req.body;

      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        image,
      });

      console.log("Product to be saved:", product);
      await product.save();
      res.status(201).json({ message: "Product added successfully!", product });
    } catch (error) {
      console.error("Error saving product:", error.message);
      res.status(500).json({ message: "Error adding product", error: error.message });
    }
  }
);

// view a single product by id
router.get("/:id", async (req, res) => {
    console.log("Request received for product ID:", req.params.id);
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error("Error fetching product:",err.message);
        res.status(500).json({ message: "Server error" });
    }
});


// Admin: Edit a Product
router.put("/:id", authMiddleware("Admin"), async (req, res) => {
    const { name, description, price, category, stock, image } = req.body;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update fields if provided
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.image = image || product.image;

        const updatedProduct = await product.save();
        res.status(200).json({ message: "Product updated successfully!", updatedProduct });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});




// Admin: Delete a Product
router.delete(
  "/:id",
  authMiddleware("Admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      await product.remove();
      res.status(200).json({ message: "Product removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error: error.message });
    }
  }
);

// Customer: Get All Products
router.get(
  "/",
  async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products", error: error.message });
    }
  }
);

module.exports = router;
