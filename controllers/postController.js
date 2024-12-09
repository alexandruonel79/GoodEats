const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const multer = require("multer");
const path = require("path");

// Set up multer for image file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be stored
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
      return res
        .status(400)
        .json({ error: "Description and image are required" });
    }

    const newPost = await Post.create({
      image,
      description,
      userId: req.user.id,
    });
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
        { model: User, as: "user", attributes: ["name"] },
        {
          model: Comment,
          as: "comments",
          include: { model: User, as: "user", attributes: ["name"] },
        },
      ],
    });

    // // Map through the posts and generate the full URL for the image path
    const postsWithImages = posts.map((post) => {
      return {
        ...post.dataValues,
        image: post.image
          ? `http://localhost:5000/${post.image.replace(/\\/g, "/")}`
          : null, // Replace \ with / for Windows compatibility
      };
    });

    // for each comment, get the user
    res.status(200).json(postsWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const newComment = await Comment.create({
      text,
      likes: 0,
      postId,
      userId: req.user.id,
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a post
const likePost = async (req, res) => {
  // add to likedBy array and check if already liked by the user
  // increment likes count
  // return the post with updated likes count
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likedBy.includes(req.user.id)) {
      return res.status(400).json({ error: "Post already liked" });
    }

    post.likes += 1;
    post.likedBy.push(req.user.id);

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a comment
const likeComment = async (req, res) => {
  // check if the comment exists and if the user has already liked the comment
  // use likedBy array to store user ids who liked the comment
  // increment likes count
  // return the comment with updated likes count
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.likedBy.includes(req.user.id)) {
      return res.status(400).json({ error: "Comment already liked" });
    }

    comment.likes += 1;
    comment.likedBy.push(req.user.id);

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// unlike a post
const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);
    post.likes -= 1;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// unlike a comment
const unlikeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);
    comment.likes -= 1;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fs = require("fs");
//getUserProfilePicture
const getUserProfilePicture = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profilePicturePath =
      user.profilePicturePath === "default.jpg"
        ? "uploads/default.jpg"
        : user.profilePicturePath;

    // Check if the profile picture file exists
    if (!fs.existsSync(profilePicturePath)) {
      return res.status(404).json({ error: "Profile picture not found" });
    }

    // Generate the full URL for the profile picture
    const profilePictureUrl = `http://localhost:5000/${profilePicturePath.replace(
      /\\/g,
      "/"
    )}`; // Replace \ with / for Windows compatibility

    res.status(200).json({ profilePictureUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// checkIfUserLikedPost
const checkIfUserLikedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likedBy.includes(req.user.id);

    res.status(200).json({ userLikedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// checkIfUserLikedComment
const checkIfUserLikedComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const userLikedComment = comment.likedBy.includes(req.user.id);

    res.status(200).json({ userLikedComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete post only if its created by the user or the user is an admin
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await post.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment" });
    }

    await comment.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Export the functions
module.exports = {
  createPost,
  getAllPosts,
  addComment,
  likePost,
  likeComment,
  upload,
  getUserProfilePicture,
  unlikeComment,
  unlikePost,
  checkIfUserLikedPost,
  checkIfUserLikedComment,
  deletePost,
  deleteComment,
};
