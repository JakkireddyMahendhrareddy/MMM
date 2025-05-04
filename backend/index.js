// ----- Main Entry Point (index.js) -----
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors"); // Importing cors
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize express app
const app = express();

// Enable CORS (only once)
app.use(cors()); // Apply CORS middleware

// Connect to database
connectDB();

// Body parser middleware
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api", require("./routes/authRoutes")); // Mount auth routes

// Home route
app.get("/", (req, res) => {
  res.send("Money Manager API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Set port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});
