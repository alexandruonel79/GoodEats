const express = require("express");
const {
  register,
  login,
  changePassword,
  logout,
  accountInfo,
  updateAccountInfo,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register - Register new user
router.post("/register", register);

// POST /api/auth/login - Login
router.post("/login", login);

// POST /api/auth/logout - Logout
router.post("/logout", logout);

// POST /api/auth/change-password - Change password, protected route
router.post("/change-password", protect, changePassword);

// GET /api/auth/get-user-id - Get user ID
router.get("/get-user-id", protect, (req, res) => {
  res.status(200).json({ id: req.user.id });
});

// GET /api/auth/account-info - Account info
router.get("/account-info", protect, accountInfo);

// PUT /api/auth/update-info - Update account info
router.put("/update-info", protect, updateAccountInfo);

module.exports = router;
