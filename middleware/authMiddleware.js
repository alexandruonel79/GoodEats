const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes and check user authentication
const protect = (req, res, next) => {
  // console.log("req.header('Authorization')", req.header('Authorization'));
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log('token', token);

  if (!token) {
    // console.log('No token, authorization denied');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // console.log('token', token);
    // jwt secret print
    // console.log('jwt secret', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
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
