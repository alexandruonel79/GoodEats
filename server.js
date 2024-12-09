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


dotenv.config();
require('dotenv').config();

const app = express();

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

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
}).catch((error) => {
  console.error('Database sync failed:', error);
});
