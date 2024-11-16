const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likedBy: {
    type: DataTypes.JSONB,  // Store an array of user IDs
    defaultValue: [],       // Initialize as an empty array
  },
}, {
  timestamps: true,
});

// Associations
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' }); // Comment created by one user
Comment.belongsTo(Post, { as: 'post', foreignKey: 'postId' }); // Comment belongs to a post
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'userId' });

module.exports = Comment;
