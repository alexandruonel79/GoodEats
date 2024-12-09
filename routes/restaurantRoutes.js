const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { logMessage } = require("../controllers/dashboard"); // Import logMessage
const router = express.Router();

// Import controller methods
const {
  addRestaurant,
  getAllRestaurants,
  approveRestaurant,
  denyRestaurant,
  deleteRestaurant,
  getAllApprovedRestaurants,
  getAllDeniedRestaurants,
  getAllPendingRestaurants,
} = require("../controllers/restaurantController");

// Middleware to log all incoming requests
const logRequests = async (req, res, next) => {
  const level = req.method === "DELETE" ? "DELETE" : "INFO"; // Use DELETE level for DELETE routes
  const message = `${req.method} ${req.originalUrl} by user ID: ${req.user.id}`;
  await logMessage(message, level); // Log the message
  next(); // Proceed to the next middleware or route handler
};

// Apply middleware to protect and log all routes
router.use(protect);
router.use(logRequests);

// Route to add restaurant, users and admins can add restaurants
router.post("/add", authorize(["user", "admin"]), addRestaurant);

// Route to get all restaurants
router.get("/get-all", getAllRestaurants);

// Route to get all approved restaurants
router.get("/get-approved", getAllApprovedRestaurants);

// Route to get all denied restaurants
router.get("/get-denied", getAllDeniedRestaurants);

// Route to get all pending restaurants
router.get("/get-pending", getAllPendingRestaurants);

// Route to approve a restaurant, only admins can approve restaurants
router.put("/:restaurantId/approve", authorize(["admin"]), approveRestaurant);

// Route to deny a restaurant, only admins can deny restaurants
router.put("/:restaurantId/deny", authorize(["admin"]), denyRestaurant);

// Route to delete a restaurant, only admins can delete restaurants
router.delete("/:restaurantId/delete", authorize(["admin"]), deleteRestaurant);

module.exports = router;
