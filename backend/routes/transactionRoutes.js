// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getSingleTransaction,
  deleteAllTransactions,
} = require("../controllers/transactionController");

const {protect} = require("../middleware/auth");

router.route("/")
  .get(protect, getTransactions)
  .post(protect, addTransaction)
  .delete(protect, deleteAllTransactions);

router.route("/:id")
  .get(protect, getSingleTransaction)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
