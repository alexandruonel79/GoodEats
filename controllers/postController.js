const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const multer = require('multer');
const path = require('path');

// Set up multer for image file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    },
});

const upload = multer({ storage: storage });

// Implement createPost (with image upload handling)
const createPost = async (req, res) => {
    try {
        const { description } = req.body;
        const image = req.file ? req.file.path : null; // Store image path if file is uploaded

        if (!description || !image) {
            return res.status(400).json({ error: 'Description and image are required' });
        }

        const newPost = await Post.create({ image, description, userId: req.user.id });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all posts, and get the image from uploads folder
// the image is stored in uploads folder and the path is saved in the database
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, as: 'user', attributes: ['name'] },
                { model: Comment, as: 'comments', include: { model: User, as: 'user', attributes: ['name'] } },
            ],
        });

        // Map through the posts and generate the full URL for the image path
        const postsWithImages = posts.map((post) => {
            return {
                ...post.dataValues,
                image: post.image ? `http://localhost:5000/${post.image.replace(/\\/g, '/')}` : null, // Replace \ with / for Windows compatibility
            };
        });

        res.status(200).json(postsWithImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Add a comment to a post
const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { content } = req.body;
        const newComment = await Comment.create({ content, postId, userId: req.user.id });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Like a post
const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);
        post.likes += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Like a comment
const likeComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findByPk(commentId);
        comment.likes += 1;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fs = require('fs');
//getUserProfilePicture
const getUserProfilePicture = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const profilePicturePath = 
            user.profilePicturePath === 'default.jpg' 
                ? 'uploads/default.jpg' 
                : user.profilePicturePath;

        // Check if the profile picture file exists
        if (!fs.existsSync(profilePicturePath)) {
            return res.status(404).json({ error: 'Profile picture not found' });
        }

        // Generate the full URL for the profile picture
        const profilePictureUrl = `http://localhost:5000/${profilePicturePath.replace(/\\/g, '/')}`; // Replace \ with / for Windows compatibility

        res.status(200).json({ profilePictureUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Export the functions
module.exports = { createPost, getAllPosts, addComment, likePost, likeComment, upload, getUserProfilePicture };
