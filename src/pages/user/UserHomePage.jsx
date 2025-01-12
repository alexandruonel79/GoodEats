import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./UserHomePage.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // For navigation

const UserHomePage = () => {
  const { token } = useAuth(); // Access token from the AuthContext
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image: null, description: "" });
  const [newComments, setNewComments] = useState({}); // Store comments for each post
  const profilePictureCache = new Map(); // Cache for profile pictures
  const navigate = useNavigate(); // Hook for navigation

  // Fetch all posts from the API
  useEffect(() => {
    if (token) {
      fetchPosts();
    } else {
      toast.error("You must be logged in to view posts.");
    }
  }, [token]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      weekday: "short", // e.g., "Mon"
      year: "numeric",
      month: "short", // e.g., "Jan"
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // For 12-hour format
    });
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const postsWithDetails = await Promise.all(
        response.data.map(async (post) => {
          const userId = post.userId;
          let profilePictureUrl = "https://via.placeholder.com/50";

          // Fetch profile picture for the post's user
          if (userId) {
            if (profilePictureCache.has(userId)) {
              profilePictureUrl = profilePictureCache.get(userId);
            } else {
              try {
                const profilePictureResponse = await axios.get(
                  `http://localhost:5000/api/user/profile-picture/${userId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                profilePictureUrl =
                  profilePictureResponse.data.profilePictureUrl;
                profilePictureCache.set(userId, profilePictureUrl);
              } catch (error) {
                console.error(
                  `Failed to fetch profile picture for user ID ${userId}`,
                  error
                );
              }
            }
          }

          // Check if the post is already liked by the user
          const postLikeResponse = await axios.get(
            `http://localhost:5000/api/user/posts/${post.id}/liked`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const isPostLiked = postLikeResponse.data.userLikedPost;

          // Pre-fetch profile pictures for comment users
          const commentsWithPictures = await Promise.all(
            post.comments.map(async (comment) => {
              const commentUserId = comment.userId;
              let commentProfilePictureUrl = "https://via.placeholder.com/50";

              if (commentUserId) {
                if (profilePictureCache.has(commentUserId)) {
                  commentProfilePictureUrl = profilePictureCache.get(
                    commentUserId
                  );
                } else {
                  try {
                    const response = await axios.get(
                      `http://localhost:5000/api/user/profile-picture/${commentUserId}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    commentProfilePictureUrl = response.data.profilePictureUrl;
                    profilePictureCache.set(
                      commentUserId,
                      commentProfilePictureUrl
                    );
                  } catch (error) {
                    console.error(
                      `Failed to fetch profile picture for comment user ID ${commentUserId}`,
                      error
                    );
                  }
                }
              }

              // Check if the comment is already liked by the user
              const commentLikeResponse = await axios.get(
                `http://localhost:5000/api/user/comments/${comment.id}/liked`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const isCommentLiked = commentLikeResponse.data.userLikedComment;

              return {
                ...comment,
                profilePictureUrl: commentProfilePictureUrl,
                isLiked: isCommentLiked, // Set the like status for comments
              };
            })
          );

          return {
            ...post,
            profilePictureUrl,
            comments: commentsWithPictures,
            isLiked: isPostLiked, // Set the like status for the post
          };
        })
      );

      setPosts(postsWithDetails);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again later.");
    }
  };


  const handleAddPost = async () => {
    if (!newPost.description || !newPost.image) {
      toast.error("Please provide both an image and a description to add a post!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", newPost.description);
      formData.append("image", newPost.image);

      await axios.post("http://localhost:5000/api/user/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post added successfully!");
      fetchPosts(); // Refresh the post list
      setNewPost({ image: null, description: "" });
    } catch (error) {
      toast.error("Failed to add post. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file });
    }
  };

  const handleAddComment = async (postId) => {
    const comment = newComments[postId];
    if (!comment) {
      toast.error("Please enter a comment before posting!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/user/posts/${postId}/comments`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Comment added successfully!");
      setNewComments({ ...newComments, [postId]: "" }); // Reset comment for this post
      fetchPosts(); // Refresh the posts to update comments
    } catch (error) {
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const handleLikePost = async (postId, isLiked) => {
    const apiUrl = isLiked
      ? `http://localhost:5000/api/user/posts/${postId}/unlike`
      : `http://localhost:5000/api/user/posts/${postId}/like`;

    try {
      await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Toggle like status in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isLiked: !isLiked } : post
        )
      );

      // Update the like count
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      );

      toast.success(isLiked ? "Post unliked!" : "Post liked!");
    } catch (error) {
      toast.error("Failed to toggle like. Please try again.");
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    const apiUrl = isLiked
      ? `http://localhost:5000/api/user/comments/${commentId}/unlike`
      : `http://localhost:5000/api/user/comments/${commentId}/like`;

    try {
      await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the comment's like status in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId ? { ...comment, isLiked: !isLiked } : comment
          ),
        }))
      );

      // Update the like count
      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likes: isLiked ? comment.likes - 1 : comment.likes + 1 }
              : comment
          ),
        }))
      );

      toast.success(isLiked ? "Comment unliked!" : "Comment liked!");
    } catch (error) {
      toast.error("Failed to toggle like. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="user-home-page">
        <h2>You must be logged in to access this page.</h2>
      </div>
    );
  }

  

  return (
    <>
      <div className={`main-content ${localStorage.getItem('theme') === 'dark' ? 'dark-main-content' : 'light-main-content'}`}>
        <div className="user-home-page">
          <div className="add-post">
            <input
              type="text"
              placeholder="Description"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleAddPost}>Add Post</button>
            {newPost.image && (
              <img
                src={URL.createObjectURL(newPost.image)}
                alt="New Post"
                className="preview-image"
              />
            )}
          </div>
  
          <div className="post-list">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <div className="user-profile">
                    <img
                      src={post.profilePictureUrl}
                      alt="User Profile"
                      className="user-avatar"
                    />
                    <p className="post-time">{formatDate(post.createdAt)}</p>
                    <p className="user-name">{post.user?.name || "Unknown User"}</p>
                  </div>
                </div>
                <div className="post-body">
                  <p className="post-description">{post.description}</p>
                  <img src={post.image} alt="Post" className="post-image" />
                  <div className="like-button-container">
                    <button
                      onClick={() => handleLikePost(post.id, post.isLiked)}
                      className="like-button"
                    >
                      {post.isLiked ? "Unlike" : "Like"} Post
                    </button>
                    <p className="like-count">{post.likes} Likes </p>
                  </div>
                  <div className="comments">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <img
                            src={comment.profilePictureUrl}
                            alt="User Profile"
                            className="comment-avatar"
                          />
                          <p className="comment-user-name">{comment.user?.name}</p>
                          <p className="comment-time">{formatDate(comment.createdAt)}</p>
                        </div>
                        <p>{comment.text}</p>
                        <p className="like-count">{comment.likes} Likes</p>
                        <div className="like-button-container">
                          <button
                            onClick={() =>
                              handleLikeComment(comment.id, comment.isLiked)
                            }
                            className="like-button"
                          >
                            {comment.isLiked ? "Unlike" : "Like"} Comment
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="add-post">
                      <input
                        type="text"
                        value={newComments[post.id] || ""}
                        onChange={(e) =>
                          setNewComments({
                            ...newComments,
                            [post.id]: e.target.value,
                          })
                        }
                        placeholder="Add a comment..."
                      />
                      <button onClick={() => handleAddComment(post.id)}>
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      <ToastContainer />
    </>
  );
};

export default UserHomePage;
