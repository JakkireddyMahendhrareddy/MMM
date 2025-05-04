// ----- Transaction Model (models/Transaction.js) -----
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0.01, "Amount must be positive"],
    },
    type: {
      type: String,
      required: true,
      enum: ["INCOME", "EXPENSES"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    created: {
      type: Number,
      default: () => Date.now(),
    },
    lastUpdated: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // We'll make this optional for now, but it will be required if you add user authentication
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
