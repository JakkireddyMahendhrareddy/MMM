// const express = require("express");
// const router = express.Router();
// const {
//   getTransactions,
//   getSingleTransaction,
//   addTransaction,
//   updateTransaction,
//   deleteTransaction,
//   deleteAllTransactions,
// } = require("../controllers/transactionController");

// // Routes for all transactions
// router
//   .route("/")
//   .get(getTransactions)
//   .post(addTransaction)
//   .delete(deleteAllTransactions);

// // Routes for a single transaction
// router
//   .route("/:id")
//   .get(getSingleTransaction) // ✅ Get one transaction by ID
//   .put(updateTransaction)
//   .delete(deleteTransaction);

// module.exports = router;


// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  getTransactions,
  getSingleTransaction,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions
} = require('../controllers/transactionController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @route   GET /api/transactions
// @desc    Get all transactions for logged-in user
// @access  Private
router.get('/', getTransactions);

// @route   GET /api/transactions/:id
// @desc    Get single transaction for logged-in user
// @access  Private
router.get('/:id', getSingleTransaction);

// @route   POST /api/transactions
// @desc    Add new transaction for logged-in user
// @access  Private
router.post('/', addTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update transaction for logged-in user
// @access  Private
router.put('/:id', updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete single transaction for logged-in user
// @access  Private
router.delete('/:id', deleteTransaction);

// @route   DELETE /api/transactions
// @desc    Delete all transactions for logged-in user
// @access  Private
router.delete('/', deleteAllTransactions);

module.exports = router;