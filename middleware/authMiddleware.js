const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes and check user authentication
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check user role for route access
const authorize = (roles) => {
  return (req, res, next) => {
    // If user doesn't have the required role, deny access
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};

module.exports = { protect, authorize };
