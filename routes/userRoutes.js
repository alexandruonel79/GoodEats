const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');  // Import middleware
const { likePost, likeComment, addComment, getAllPosts, createPost, upload, getUserProfilePicture} = require('../controllers/postController');
const router = express.Router();


router.use(protect); // Protect all routes
router.use(authorize(['user', 'admin'])); // Authorize for 'user' role

// post a new POST using post controller
router.post('/posts', upload.single('image'), createPost);

// get all POSTs using post controller
router.get('/posts', getAllPosts);

// add a comment to a POST using comment controller
router.post('/posts/:postId/comments', addComment);

// like a post using post controller
router.put('/posts/:postId/like', likePost);

// like a comment using comment controller
router.put('/comments/:commentId/like', likeComment);

// get profile picture for a user by user id
router.get('/profile-picture/:userId', getUserProfilePicture);

module.exports = router;
