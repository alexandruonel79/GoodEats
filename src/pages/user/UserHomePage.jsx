import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./UserHomePage.css";
import { useAuth } from "../../context/AuthContext";

const UserHomePage = () => {
  const { token } = useAuth(); // Access token from the AuthContext
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image: null, description: "" });
  const [newComment, setNewComment] = useState("");
  const profilePictureCache = new Map(); // Cache for profile pictures

  // Fetch all posts from the API
  useEffect(() => {
    if (token) {
      fetchPosts();
    } else {
      toast.error("You must be logged in to view posts.");
    }
  }, [token]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const postsWithProfilePics = await Promise.all(
        response.data.map(async (post) => {
          const userId = post.userId; // Use `userId` from the response
          let profilePictureUrl = "https://via.placeholder.com/50"; // Default placeholder
  
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
                profilePictureUrl = profilePictureResponse.data.profilePictureUrl; // Use the correct field name
                console.log(`Fetched profile picture URL for user ${userId}:`, profilePictureUrl); // Debug log
                profilePictureCache.set(userId, profilePictureUrl); // Cache the result
              } catch (error) {
                console.error(`Failed to fetch profile picture for user ID ${userId}`, error);
              }
              
              
            }
          } else {
            console.warn(`No user ID found for post ID: ${post.id}`);
          }
  
          return { ...post, profilePictureUrl }; // Add profile picture URL to post object
        })
      );
  
      setPosts(postsWithProfilePics);
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
    if (!newComment) {
      toast.error("Please enter a comment before posting!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/user/posts/${postId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Comment added successfully!");
      setNewComment("");
      fetchPosts(); // Refresh the posts to update comments
    } catch (error) {
      toast.error("Failed to add comment. Please try again.");
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
    <div className="user-home-page">
      <div className="add-post">
        <input
          type="text"
          placeholder="Description"
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
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
                  src={post.profilePictureUrl} // Use fetched profile picture
                  alt="User Profile"
                  className="user-avatar"
                />
                <p className="user-name">{post.user?.name || "Unknown User"}</p>
              </div>
            </div>
            <div className="post-body">
              <p className="post-description">{post.description}</p>
              <img src={post.image} alt="Post" className="post-image" />
            </div>

            <div className="comments-section">
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="user-profile">
                    <p>{comment.user?.name || "Anonymous"}</p>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleAddComment(post.id)}>Post</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHomePage;
