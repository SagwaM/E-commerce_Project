require("dotenv").config();
const axios = require("axios");
const getMpesaToken = require("./mpesaAuth"); // Import M-Pesa token function

const stkPush = async (phone, amount) => {
  const token = await getMpesaToken();
  if (!token) {
    console.error("Failed to get M-Pesa token");
    return;
  }
  
  const timestamp = getFormattedTimestamp();
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  console.log("📌 M-PESA Shortcode:", process.env.MPESA_SHORTCODE);
  console.log("📌 M-PESA Passkey:", process.env.MPESA_PASSKEY);
  console.log("📌 Timestamp:", timestamp);
  console.log("📌 Password:", password);
  console.log("📌 M-Pesa Token:", token);

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE, // Your Paybill or Till number
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone, // Customer's phone number
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone, // Customer's phone number
    CallBackURL: process.env.MPESA_CALLBACK_URL, // Your API endpoint to receive M-Pesa response
    AccountReference: "Ecommerce",
    TransactionDesc: "Payment for Order",
  };

  try {
    const response = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ STK Push Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending STK Push:", error.response?.data || error.message);
  }
};

// Helper function to get formatted timestamp (YYYYMMDDHHMMSS)
const getFormattedTimestamp = () => {
  const date = new Date();
  return date
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
};

module.exports = stkPush;

  