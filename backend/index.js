// Load environment variables FIRST - before anything else
require('dotenv').config();

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Debug: Check if JWT_SECRET is loaded
console.log("🔑 JWT_SECRET loaded:", !!process.env.JWT_SECRET);
console.log("🔑 JWT_SECRET value:", process.env.JWT_SECRET); // Remove this line after testing

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "https://money-frontend-bice.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Root route
app.get("/", (req, res) => {
  res.send("💰 Money Manager API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.yellow.bold);
});