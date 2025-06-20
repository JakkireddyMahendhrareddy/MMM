// controllers/transactionController.js
const Transaction = require("../models/Transaction");

exports.getSingleTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ 
      _id: id, 
      userId: userId 
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });
    }

    return res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.error("Fetch single transaction error:", err.message);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get only the current user's transactions
    const transactions = await Transaction.find({ userId }).sort({ created: -1 });

    // Calculate summary statistics for user's transactions only
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "EXPENSES")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expenses;

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
      summary: {
        income,
        expenses,
        balance,
      },
    });
  } catch (err) {
    console.error("Get transactions error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add transaction for logged-in user
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Please add a title",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please add a positive amount",
      });
    }

    if (!type || !["INCOME", "EXPENSES"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Please select a valid transaction type",
      });
    }

    const now = Date.now();

    const transaction = await Transaction.create({
      title,
      amount: parseFloat(amount),
      type,
      date: new Date(),
      created: now,
      userId: userId, // Associate with logged-in user
    });

    return res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      console.error("Add transaction error:", err.message);
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc    Update transaction for logged-in user
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !amount || !type) {
      return res.status(400).json({ 
        success: false, 
        error: "All fields are required" 
      });
    }

    // Find transaction that belongs to the user
    const existingTransaction = await Transaction.findOne({ 
      _id: id, 
      userId: userId 
    });

    if (!existingTransaction) {
      return res.status(404).json({ 
        success: false, 
        error: "Transaction not found or access denied" 
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        title,
        amount: parseFloat(amount),
        type,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    console.error("Update error:", err.message);
    return res.status(500).json({ 
      success: false, 
      error: "Server Error" 
    });
  }
};

// @desc    Delete transaction for logged-in user
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      userId: userId 
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found or access denied",
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
      message: "Transaction deleted successfully"
    });
  } catch (err) {
    console.error("Delete transaction error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Delete all transactions for logged-in user
// @route   DELETE /api/transactions
// @access  Private
exports.deleteAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete only the current user's transactions
    const result = await Transaction.deleteMany({ userId: userId });

    return res.status(200).json({
      success: true,
      data: {},
      message: `${result.deletedCount} transactions deleted`,
    });
  } catch (err) {
    console.error("Delete all transactions error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};