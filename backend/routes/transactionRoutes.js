const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getSingleTransaction,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
} = require("../controllers/transactionController");

// Routes for all transactions
router
  .route("/")
  .get(getTransactions)
  .post(addTransaction)
  .delete(deleteAllTransactions);

// Routes for a single transaction
router
  .route("/:id")
  .get(getSingleTransaction) // ✅ Get one transaction by ID
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
