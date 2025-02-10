const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add item to cart
router.post("/", authMiddleware("Customer"), async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Validate the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already exists in the cart
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product does not exist in the cart, add it
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error adding item to cart", error: error.message });
  }
});


// Get cart items for the logged-in user
router.get("/", authMiddleware("Customer"), async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  
      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: "Your cart is empty", cart: [] });
      }
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
  });
  

// Update cart item quantity
router.put("/update/:productId", authMiddleware("Customer"), async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

  
    // Ensure quantity is at least 1
    if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Find the product in the cart
      const cartItem = cart.items.find(item => item.product.toString() === productId);
      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Check if the requested quantity is available in stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (quantity > product.stock) {
        return res.status(400).json({ message: "Requested quantity exceeds available stock" });
      }
  
      // Update the quantity
      cartItem.quantity = quantity;
      await cart.save();
  
      res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error updating cart", error: error.message });
    }
});

// Remove an item from the cart
router.delete("/remove/:productId", authMiddleware("Customer"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check if the product exists in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.error("Error removing item:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
