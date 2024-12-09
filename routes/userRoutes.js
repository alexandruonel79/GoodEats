const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware"); // Import middleware
const {
  likePost,
  likeComment,
  addComment,
  getAllPosts,
  createPost,
  upload,
  getUserProfilePicture,
  unlikeComment,
  unlikePost,
  checkIfUserLikedPost,
  checkIfUserLikedComment,
  deletePost,
  deleteComment,
} = require("../controllers/postController");
const { logMessage } = require("../controllers/dashboard"); // Import logMessage

const router = express.Router();

// Middleware to log all incoming requests
const logRequests = async (req, res, next) => {
  const level = req.method === "DELETE" ? "DELETE" : "INFO"; // Use DELETE level for DELETE requests
  const message = `${req.method} ${req.originalUrl} by user ID: ${req.user.id}`;
  await logMessage(message, level); // Log the message
  next(); // Proceed to the next middleware or route handler
};

// Apply middleware to protect, authorize, and log all routes
router.use(protect);
router.use(authorize(["user", "admin"]));
router.use(logRequests);

// Route to post a new POST using post controller
router.post("/posts", upload.single("image"), createPost);

// Route to get all POSTS using post controller
router.get("/posts", getAllPosts);

// Route to add a comment to a POST using comment controller
router.post("/posts/:postId/comments", addComment);

// Route to like a post using post controller
router.post("/posts/:postId/like", likePost);

// Route to unlike a post using post controller
router.post("/posts/:postId/unlike", unlikePost);

// Route to like a comment using comment controller
router.post("/comments/:commentId/like", likeComment);

// Route to unlike a comment using comment controller
router.post("/comments/:commentId/unlike", unlikeComment);

// Route to get profile picture for a user by user id
router.get("/profile-picture/:userId", getUserProfilePicture);

// Route to check if user liked a post
router.get("/posts/:postId/liked", checkIfUserLikedPost);

// Route to check if user liked a comment
router.get("/comments/:commentId/liked", checkIfUserLikedComment);

// Route to delete a post
router.delete("/posts/:postId", deletePost);

// delete comment
router.delete("/posts/:postId/comments/:commentId", deleteComment);

module.exports = router;
