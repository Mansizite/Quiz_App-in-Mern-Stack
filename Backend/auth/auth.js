const jwt = require('jsonwebtoken');
const User = require('../model/user');  // Assuming User model is defined

// Auth middleware to verify token and get user data
exports.auth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Expecting "Bearer token"

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and decode the user ID
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Ensure SECRET_KEY matches the one in your .env file
    const user = await User.findById(decoded.id);  // Find user by token ID
    req.user = user;  // Attach user data to request
    next();  // Proceed to the next handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error });
  }
};
