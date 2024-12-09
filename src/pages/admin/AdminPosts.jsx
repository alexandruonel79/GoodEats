import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./AdminPosts.css";
import { useAuth } from "../../context/AuthContext";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";

const AdminPosts = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const profilePictureCache = new Map();

  useEffect(() => {
    if (token) {
      fetchPosts();
    } else {
      toast.error("You must be logged in to view posts.");
    }
  }, [token]);

  useEffect(() => {
    if (selectedUser || selectedDate) {
      applyFilters();
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedUser, selectedDate, posts]);

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

          const commentsWithPictures = await Promise.all(
            post.comments.map(async (comment) => {
              const commentUserId = comment.userId;
              let commentProfilePictureUrl = "https://via.placeholder.com/50";

              if (commentUserId) {
                if (profilePictureCache.has(commentUserId)) {
                  commentProfilePictureUrl =
                    profilePictureCache.get(commentUserId);
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

              return {
                ...comment,
                profilePictureUrl: commentProfilePictureUrl,
              };
            })
          );

          return {
            ...post,
            profilePictureUrl,
            comments: commentsWithPictures,
          };
        })
      );

      setPosts(postsWithDetails);
      setFilteredPosts(postsWithDetails);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts. Please try again later.");
    }
  };

  const applyFilters = () => {
    let filtered = posts;

    if (selectedUser) {
      filtered = filtered.filter((post) => post.userId === selectedUser);
    }

    if (selectedDate) {
      filtered = filtered.filter((post) => {
        const postDate = new Date(post.createdAt);
        const filterDate = new Date(selectedDate);
        return (
          postDate.getFullYear() === filterDate.getFullYear() &&
          postDate.getMonth() === filterDate.getMonth() &&
          postDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredPosts(filtered);
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Comment deleted successfully!");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  // Get unique users for the user filter dropdown
  const uniqueUsers = [...new Set(posts.map((post) => post.userId))];

  return (
    <div className="admin-posts">
      <br />
      <div className="filters">
        <FormControl variant="outlined" className="filter-select">
          <InputLabel>User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="User"
            style={{ fontSize: "16px", width: "200px" }} // Adjust size
          >
            <MenuItem value="">All Users</MenuItem>
            {uniqueUsers.map((userId) => {
              const user = posts.find((post) => post.userId === userId);
              return (
                user && (
                  <MenuItem key={userId} value={userId}>
                    {user.user?.name || "Unknown User"}
                  </MenuItem>
                )
              );
            })}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="filter-select">
          <InputLabel>Date</InputLabel>
          <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            label="Date"
            style={{ fontSize: "16px", width: "200px" }} // Adjust size
          >
            <MenuItem value="">All Dates</MenuItem>
            {[
              ...new Set(
                posts.map((post) =>
                  new Date(post.createdAt).toLocaleDateString()
                )
              ),
            ].map((uniqueDate, index) => (
              <MenuItem key={index} value={uniqueDate}>
                {uniqueDate}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="post-list">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="user-profile">
                <img
                  src={post.profilePictureUrl}
                  alt="User Profile"
                  className="user-avatar"
                />
                <p className="post-time">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="user-name">{post.user?.name || "Unknown User"}</p>
              </div>
              <button
                onClick={() => deletePost(post.id)}
                className="delete-button"
              >
                Delete Post
              </button>
            </div>
            <div className="post-body">
              <p className="post-description">{post.description}</p>
              <img src={post.image} alt="Post" className="post-image" />
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
                      <p className="comment-time">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p>{comment.text}</p>
                    <p className="like-count">{comment.likes} Likes</p>
                    <button
                      onClick={() => deleteComment(post.id, comment.id)}
                      className="delete-button"
                    >
                      Delete Comment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminPosts;
