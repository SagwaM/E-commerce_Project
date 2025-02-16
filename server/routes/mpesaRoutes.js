const express = require("express");
const router = express.Router();
const stkPush = require("../stkPush");

router.post("/pay", async (req, res) => {
  try {
    const { amount, phone } = req.body;

    if (!amount || !phone) {
      return res.status(400).json({ success: false, message: "Phone number and amount are required" });
    }

    const response = await stkPush(phone, amount);

    if (response) {
      res.json({ success: true, message: "STK push request sent", response });
    } else {
      res.status(500).json({ success: false, message: "Payment request failed" });
    }
  } catch (error) {
    console.error("M-Pesa Payment Error:", error.message);
    res.status(500).json({ success: false, message: "Payment failed", error: error.message });
  }
});

module.exports = router;
