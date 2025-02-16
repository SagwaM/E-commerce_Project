const express = require("express");
const axios = require("axios");
const router = express.Router();

// M-Pesa credentials
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passKey = process.env.MPESA_PASSKEY;
const callbackURL = process.env.MPESA_CALLBACK_URL;

// Generate Access Token
router.get("/token", async (req, res) => {
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error generating access token:", error);
    res.status(500).send("Failed to generate token");
  }
});

// Process STK Push
router.post("/payment", async (req, res) => {
  const { amount, phone } = req.body;

  try {
    // Get access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // Timestamp for the STK request
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);

    // Password: Base64-encode(Shortcode + PassKey + Timestamp)
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");

    // STK Push request
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: "OrderPayment",
        TransactionDesc: "E-Commerce Order Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(stkResponse.data);
  } catch (error) {
    console.error("STK Push error:", error.response?.data || error.message);
    res.status(500).send("Payment failed");
  }
});

// Callback for payment confirmation
router.post("/callback", (req, res) => {
  console.log("Payment callback received:", req.body);
  // Handle payment confirmation and update order status
  res.status(200).send("Callback received");
});

module.exports = router;
