import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './UserHomePage.css';
import { useAuth } from '../../context/AuthContext';

const UserHomePage = () => {
  const { token, role } = useAuth(); // Access token from the AuthContext
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image: null, description: '' });
  const [newComment, setNewComment] = useState('');
  const [userProfile, setUserProfile] = useState({
    username: 'current_user',
    profilePicture: 'https://via.placeholder.com/50',
  });

  // Fetch all posts from the API
  useEffect(() => {
    if (token) {
      fetchPosts();
    } else {
      toast.error('You must be logged in to view posts.');
    }
  }, [token]); // Only fetch posts when token is available

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/posts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load posts. Please try again later.');
    }
  };

  // Handle adding a new post
  const handleAddPost = async () => {
    if (!newPost.description || !newPost.image) {
      toast.error('Please provide both an image and a description to add a post!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', newPost.description);
      formData.append('image', newPost.image);

      const response = await axios.post('http://localhost:5000/api/user/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending FormData
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });

      toast.success('Post added successfully!');
      fetchPosts(); // Refresh the post list
      setNewPost({ image: null, description: '' });
    } catch (error) {
      toast.error('Failed to add post. Please try again.');
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file }); // Store file directly
    }
  };

  // Handle adding a comment
  const handleAddComment = (postId) => {
    if (!newComment) {
      toast.error('Please enter a comment before posting!');
      return;
    }
    const comment = { id: Date.now(), text: newComment, likes: 0, liked: false, user: userProfile };
    setPosts(posts.map((post) =>
      post.id === postId ? { ...post, comments: [comment, ...post.comments] } : post
    ));
    setNewComment('');
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
        {newPost.image && <img src={URL.createObjectURL(newPost.image)} alt="New Post" className="preview-image" />}
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="user-profile">
                <img src={post.user.profilePicture} alt="User Profile" className="user-avatar" />
                <p>{post.user.username}</p>
              </div>
              <div className="post-description">
                <p>{post.description}</p>
              </div>
            </div>
            <img src={post.image} alt="Post" className="post-image" />

            <div className="comments-section">
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="user-profile">
                    <img src={comment.user.profilePicture} alt="User Profile" className="user-avatar" />
                    <p>{comment.user.username}</p>
                  </div>
                  <p>{comment.text}</p>
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
