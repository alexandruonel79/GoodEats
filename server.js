const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');  // Import new admin routes
const userRoutes = require('./routes/userRoutes');  // Import user routes
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
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/user', userRoutes); // User routes

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
}).catch((error) => {
  console.error('Database sync failed:', error);
});
