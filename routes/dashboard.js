const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware"); // Import middleware
const router = express.Router();

// Import controller methods
const { getDashboardData, getAllLogs } = require("../controllers/dashboard");

router.use(protect); // Protect all routes

// route to get dashboard data should be accessed by admins only
router.get("/", authorize(["admin"]), getDashboardData);

// get all logs
router.get("/logs", authorize(["admin"]), getAllLogs);

module.exports = router;
