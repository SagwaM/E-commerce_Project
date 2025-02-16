require("dotenv").config();
const axios = require("axios");

const getMpesaToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const response = await axios.get(
      `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    console.log("M-Pesa Access Token:", response.data.access_token); // ✅ Debugging
    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Error getting M-Pesa token:", error.response?.data || error.message);
    return null;
  }
};

// Export function
module.exports = getMpesaToken;
