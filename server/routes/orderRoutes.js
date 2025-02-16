const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // For recommendations

const router = express.Router();


// Checkout: Place an order
router.post("/checkout", authMiddleware("Customer"), async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty!" });
        }

        // Calculate total price
        let totalPrice = 0;
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        totalPrice = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Create new order
        const order = new Order({
            user: req.user._id,
            items: cart.items,
            totalPrice: cart.totalPrice,
            status: "Pending" // Default status
        });

        await order.save();

        // Clear the cart after checkout
        await Cart.findOneAndUpdate({ user: userId }, { items: [] });

        res.status(201).json({ message: "Order placed successfully!", order });
    } catch (error) {
        console.error("Checkout error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// GET /api/orders/checkout - Retrieve items in the cart for checkout
router.get("/checkout", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated request

        // Fetch the user's cart (assuming you store cart in the Order model)
        const cartItems = await Order.find({ user: userId, status: "cart" });

        if (!cartItems.length) {
            return res.status(404).json({ message: "Your cart is empty." });
        }

        res.json(cartItems);
    } catch (error) {
        console.error("Error fetching checkout items:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all orders (Admin only)
router.get("/", authMiddleware("Admin"), async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status; // Allow filtering by status
        }

        const orders = await Order.find(filter).populate("user", "name email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

// Get orders for the logged-in user
router.get("/my-orders", authMiddleware("Customer"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { status,  page = 1, limit = 10, search} = req.query; // Get status, page, limit and search from query params

        // Validate status
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status filter" });
        }

        // Filter by user and status if provided
        const filter = { user: userId };
        if (status) {
            filter.status = status;
        }

        // Log the filter for debugging
        console.log("Filter applied:", filter);

        // Pagination calculations
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const startIndex = (pageNumber - 1) * pageSize;

        // Add search functionality
        let ordersQuery = Order.find(filter).populate("items.product", "name price");

        if (search) {
            const searchRegex = new RegExp(search, "i"); // Case-insensitive search
            ordersQuery = ordersQuery.or([
                { _id: { $regex: searchRegex } }, // Search by Order ID
                { "items.product.name": { $regex: searchRegex } } // Search by Product Name
            ]);
        }

        // Fetch total orders and paginated orders
        const totalOrders = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .populate("items.product", "name price") // Include product name and price
            .sort({ createdAt: -1 }) // Sort by newest
            .skip(startIndex)
            .limit(pageSize);

        res.status(200).json({
            page: pageNumber,
            limit: pageSize,
            totalOrders,
            totalPages: Math.ceil(totalOrders / pageSize),
            orders
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

router.get("/my-orders/:orderId", authMiddleware("Customer"), async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        // Find the specific order for the logged-in user
        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate("items.product", "name description price") // Include product details
            .populate("user", "name email"); // Optionally include user info

        if (!order) {
            return res.status(404).json({ message: "Order not found or access denied." });
        }

        res.status(200).json({
            message: "Order details fetched successfully.",
            order,
        });
    } catch (error) {
        console.error("Error fetching order details:", error.message);
        res.status(500).json({ message: "Error fetching order details", error: error.message });
    }
});


// Update order status (Admin only)
router.put("/update-status/:orderId", authMiddleware("Admin"), async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
});

// Cancel an order (Customer only)
router.delete("/cancel/:orderId", authMiddleware("Customer"), async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        // Find the order and ensure it belongs to the customer
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or does not belong to you" });
        }

        // Only allow canceling "Pending" orders
        if (order.status !== "Pending") {
            return res.status(400).json({ message: "Only 'Pending' orders can be canceled" });
        }

        // Update order status to "Canceled"
        order.status = "Canceled";
        await order.save();

        res.status(200).json({ message: "Order canceled successfully", order });
    } catch (error) {
        console.error("Error canceling order:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Fetch order summary for a customer
router.get("/summary/:id", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });

    if (!orders.length) return res.status(404).json({ message: "No orders found" });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({ totalOrders, totalSpent });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch recent orders for a customer
router.get("/recent/:id", async (req, res) => {
  try {
    const recentOrders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(5);
    
    if (!recentOrders.length) return res.status(404).json({ message: "No recent orders found" });

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch a specific order details
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


module.exports = router;
