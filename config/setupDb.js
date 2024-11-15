const sequelize = require('./database');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

(async () => {
  try {
    await sequelize.sync({ force: true }); // Use `force: true` to recreate tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();
