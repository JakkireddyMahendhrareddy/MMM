// ----- Transaction Controller (controllers/transactionController.js) -----
const Transaction = require("../models/Transaction");

exports.getSingleTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

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

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public (will be Private with auth)
exports.getTransactions = async (req, res) => {
  try {
    // Add filtering by userId when you implement authentication
    const transactions = await Transaction.find({}).sort({ created: -1 });

    // Calculate summary statistics
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
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Public (will be Private with auth)
exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type } = req.body;

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
      // Add userId when implementing authentication
      // userId: req.user.id
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
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Public (will be Private with auth)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type } = req.body;

    // Validate required fields
    if (!title || !amount || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        title,
        amount: parseFloat(amount),
        type,
        lastUpdated: new Date(),
      },
      { new: true } // Return the updated document
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(transaction);
  } catch (err) {
    console.error("Update error:", err.message);
    return res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public (will be Private with auth)
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "No transaction found",
      });
    }

    // Check ownership when implementing authentication
    // if (transaction.userId.toString() !== req.user.id) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Not authorized'
    //   });
    // }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Delete all transactions
// @route   DELETE /api/transactions
// @access  Public (will be Private with auth)
exports.deleteAllTransactions = async (req, res) => {
  try {
    // With authentication, you would delete only the user's transactions
    // await Transaction.deleteMany({ userId: req.user.id });

    await Transaction.deleteMany({});

    return res.status(200).json({
      success: true,
      data: {},
      message: "All transactions deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
