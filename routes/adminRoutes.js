const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');  // Import middleware
const router = express.Router();

// Example protected route only accessible by 'admin' role
router.get('/dashboard', protect, authorize(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!', user: req.user });
});

// You can add other protected routes below as needed
// Example: restaurant owners accessing restaurant management
router.get('/restaurant', protect, authorize(['restaurant_owner', 'admin']), (req, res) => {
  res.status(200).json({ message: 'Access granted to restaurant management.' });
});

module.exports = router;
