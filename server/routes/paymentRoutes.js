const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");


// Payment Routes
router.post("/mpesa", async (req, res) => {
    // Implement M-Pesa payment processing logic here
    res.json({ message: "M-Pesa payment processed successfully" });
});

router.post("/card", async (req, res) => {
    // Implement card payment processing logic here
    res.json({ message: "Card payment processed successfully" });
});

router.get("/history/:id", async (req, res) => {
    try {
        const history = await Payment.find({ user: req.params.id });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;