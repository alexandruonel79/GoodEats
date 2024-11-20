const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware"); // Import middleware
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
} = require("../controllers/restaurantController");

router.use(protect); // Protect all routes

// route to add resturant, users and admins can add restaurants
router.post("/add", authorize(["user", "admin"]), addRestaurant);

// route to get all restaurants
router.get("/get-all", getAllRestaurants);

// route to get all approved restaurants
router.get("/get-approved", getAllApprovedRestaurants);

// route to get all denied restaurants
router.get("/get-denied", getAllDeniedRestaurants);

// route to approve a restaurant, only admins can approve restaurants
router.put("/:restaurantId/approve", authorize(["admin"]), approveRestaurant);

// route to deny a restaurant, only admins can deny restaurants
router.put("/:restaurantId/deny", authorize(["admin"]), denyRestaurant);

// route to delete a restaurant, only admins can delete restaurants
router.delete("/:restaurantId/delete", authorize(["admin"]), deleteRestaurant);

module.exports = router;
