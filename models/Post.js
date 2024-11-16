const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Assuming this is the User model

const Post = sequelize.define('Post', {
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
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
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Association
Post.belongsTo(User, { as: 'user', foreignKey: 'userId' }); // Each post is created by one user
User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });

module.exports = Post;
