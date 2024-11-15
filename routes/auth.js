const express = require("express");
const {
  register,
  login,
  changePassword,
  logout,
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

router.get("/get-user-id", protect, (req, res) => {
  res.status(200).json({ id: req.user.id });
});

module.exports = router;
