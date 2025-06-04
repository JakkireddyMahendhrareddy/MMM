

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.Register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.Login);

// @route   GET /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
router.get('/verify-token', authController.verifyToken);

module.exports = router;

