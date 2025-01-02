const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');  // Import user routes
const restaurantRoutes = require('./routes/restaurantRoutes');  // Import restaurant routes
const dashboardRoutes = require('./routes/dashboard');  // Import dashboard routes
const bodyParser = require('body-parser');
const path = require('path');

// Initialize dotenv
dotenv.config();
require('dotenv').config();

// Initialize express app
const app = express(); // This should be declared here first

// Import the chat routes after initializing the app
const chatRoutes = require('./routes/chat');

// Middleware - CORS configuration
app.use(cors());

// Body parser configuration
app.use(bodyParser.json({ limit: '10mb' })); // JSON parsing middleware
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // User routes
app.use('/api/restaurant', restaurantRoutes); // Restaurant routes
app.use('/api/dashboard', dashboardRoutes); // Dashboard routes

// Add the chat routes after other routes are defined
app.use('/chat', chatRoutes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
}).catch((error) => {
  console.error('Database sync failed:', error);
});
