import React, { useState } from 'react';
import './UserHomePage.css'; // Include custom CSS for styling

const UserHomePage = () => {
  // Dummy data for posts, including profile pictures
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { username: 'john_doe', profilePicture: 'https://via.placeholder.com/50' },
      image: 'https://via.placeholder.com/300',
      description: 'Beautiful sunset at the beach.',
      likes: 10,
      liked: false,  // Track if the current user liked the post
      comments: [
        { id: 1, text: 'Amazing view!', likes: 5, liked: false, user: { username: 'alice_smith', profilePicture: 'https://via.placeholder.com/50' } },
        { id: 2, text: 'I love this!', likes: 2, liked: false, user: { username: 'bob_jones', profilePicture: 'https://via.placeholder.com/50' } },
      ],
    },
    {
      id: 2,
      user: { username: 'jane_doe', profilePicture: 'https://via.placeholder.com/50' },
      image: 'https://via.placeholder.com/300',
      description: 'Exploring the city streets.',
      likes: 7,
      liked: false,  // Track if the current user liked the post
      comments: [
        { id: 1, text: 'Nice architecture!', likes: 3, liked: false, user: { username: 'charlie_brown', profilePicture: 'https://via.placeholder.com/50' } },
      ],
    },
  ]);

  const [newPost, setNewPost] = useState({
    image: null,
    description: '',
  });
  
  const [newComment, setNewComment] = useState('');
  const [userProfile, setUserProfile] = useState({ username: 'current_user', profilePicture: 'https://via.placeholder.com/50' });

  // Handle adding a new post
  const handleAddPost = () => {
    if (!newPost.description || !newPost.image) return;
    const newPostData = {
      ...newPost,
      user: userProfile,
      id: posts.length + 1,
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts([newPostData, ...posts]); // Add new post at the beginning
    setNewPost({ image: null, description: '' }); // Clear form
    // Placeholder for API call to add a new post
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle liking/unliking a post
  const handlePostLike = (postId) => {
    setPosts(posts.map((post) =>
      post.id === postId 
        ? { 
            ...post, 
            likes: post.liked ? post.likes - 1 : post.likes + 1, 
            liked: !post.liked // Toggle the like status
          }
        : post
    ));
  };

  // Handle liking/unliking a comment
  const handleCommentLike = (postId, commentId) => {
    setPosts(posts.map((post) => ({
      ...post,
      comments: post.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1, // Toggle the like status
              liked: !comment.liked, // Toggle the like status
            }
          : comment
      ),
    })));
  };

  // Handle adding a comment to a post
  const handleAddComment = (postId) => {
    if (!newComment) return;
    const comment = { id: Date.now(), text: newComment, likes: 0, liked: false, user: userProfile };
    setPosts(posts.map((post) =>
      post.id === postId ? { ...post, comments: [comment, ...post.comments] } : post
    ));
    setNewComment('');
  };

  return (
    <div className="user-home-page">
      <div className="add-post">
        <input
          type="text"
          placeholder="Description"
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={handleAddPost}>Add Post</button>
        {newPost.image && <img src={newPost.image} alt="New Post" className="preview-image" />}
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
              <button
                onClick={() => handlePostLike(post.id)}
                className={`like-btn ${post.liked ? 'liked' : ''}`}
              >
                ❤️ {post.likes}
              </button>
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
                  <div className="comment-actions">
                    <button onClick={() => handleCommentLike(post.id, comment.id)} className="like-btn">
                      ❤️ {comment.likes}
                    </button>
                  </div>
                </div>
              ))}
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleAddComment(post.id)} className="comment-btn">Post</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHomePage;
