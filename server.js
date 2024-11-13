const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');  // Import new admin routes
const { protect } = require('./middleware/authMiddleware');  // Import protection middleware

dotenv.config();
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Use the new admin routes

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
}).catch((error) => {
  console.error('Database sync failed:', error);
});
