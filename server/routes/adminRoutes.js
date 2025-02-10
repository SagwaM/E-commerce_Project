const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");


//  Admin-Only Route
router.get(
    "/dashboard",
    authMiddleware("Admin"), // Ensure the user is authenticated. Only Admins can access
    (req, res) => {
        console.log("Accessing admin dashboard as:", req.user.role);
        res.json({ message: "Welcome to the admin dashboard!" });
    }
);

// Get all orders (Admin only) with search, sort, filter, and pagination
router.get("/orders", authMiddleware("Admin"), async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

        // Validate status
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status filter" });
        }

        // Create a filter object
        const filter = {};
        if (status) {
            filter.status = status;
        }

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
            filter.$or = [
                 
                { "items.product.name": { $regex: searchRegex } }, // Search by product name
                { "user.name": { $regex: searchRegex } } // Search by customer name
            ];
        }

        // Pagination calculations
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

        // Fetch total orders and paginated results
        const totalOrders = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .populate("user", "name email") // Populate user details
            .populate("items.product", "name price") // Populate product details
            .sort(sortOptions) // Apply sorting
            .skip(skip) // Skip for pagination
            .limit(pageSize); // Limit for pagination

        res.status(200).json({
            page: pageNumber,
            limit: pageSize,
            totalOrders,
            totalPages: Math.ceil(totalOrders / pageSize),
            orders,
        });
    } catch (error) {
        console.error("Error fetching admin orders:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
