// const express = require("express");
// const router = express.Router();
// const { Register, Login } = require("../controllers/authController");

// router.post("/register", Register);
// router.post("/login", Login);

// module.exports = router;


// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Check what's actually exported
console.log('Auth controller exports:', Object.keys(authController));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.Login);
router.post("/register", authController.Register);


// @route   GET /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
// Only add this route if verifyToken exists
if (authController.verifyToken) {
  router.get('/verify-token', authController.verifyToken);
} else {
  console.warn('verifyToken function not found in auth controller');
  // Simple token check route as fallback
  router.get('/verify-token', (req, res) => {
    res.json({ success: true, message: 'Verification endpoint not implemented' });
  });
}

module.exports = router;