const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require ("./routes/orderRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://shopsphere-sigma-six.vercel.app/"],// Allow frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));
app.use(express.json());// Allows JSON request bodies
app.use(express.urlencoded({ extended: true }));// Allows form submissions
app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5173", "https://shopsphere-sigma-six.vercel.app"];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // Admin routes
app.use("/api/customer", customerRoutes); // Customer routes
app.use("/api/products", productRoutes); // Product routes
app.use("/api/cart", cartRoutes); // Cart routes
app.use("/api/orders", orderRoutes); // Order routes
app.use("/api/mpesa", mpesaRoutes); // M-Pesa routes
app.use("/api/recommendations", recommendationRoutes); // Recommendation routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/payments", paymentRoutes); // Payment routes
app.use("/api/feedback", feedbackRoutes); // Feedback routes


// Routes Placeholder
app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
