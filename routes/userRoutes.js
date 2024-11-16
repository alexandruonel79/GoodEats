const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');  // Import middleware
const { likePost, likeComment, addComment, getAllPosts, createPost, upload, getUserProfilePicture, unlikeComment, unlikePost,
    checkIfUserLikedPost, checkIfUserLikedComment, deletePost
} = require('../controllers/postController');
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
router.post('/posts/:postId/like', likePost);

// unlike a post using post controller
router.post('/posts/:postId/unlike', unlikePost);

// like a comment using comment controller
router.post('/comments/:commentId/like', likeComment);

// unlike a comment using comment controller
router.post('/comments/:commentId/unlike', unlikeComment);

// get profile picture for a user by user id
router.get('/profile-picture/:userId', getUserProfilePicture);

// check if user liked a post
router.get('/posts/:postId/liked', checkIfUserLikedPost);

// check if user liked a comment
router.get('/comments/:commentId/liked', checkIfUserLikedComment);

// delete a post
router.delete('/posts/:postId', deletePost);

module.exports = router;
