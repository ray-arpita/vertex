const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware 1: verifyToken
// Checks that a valid Bearer token is present in the Authorization header.
// If valid, attaches the decoded payload (userId, role) to req.user
// so all route handlers downstream can use it.
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    // jwt.verify throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();             // Pass control to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware 2: requireRole
// A middleware factory — call it with a role string and it returns
// a middleware function that blocks anyone without that role.
// Usage: router.get('/admin/users', verifyToken, requireRole('admin'), handler)
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };