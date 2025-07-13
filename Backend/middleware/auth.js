// C:\Users\madhu\OneDrive\Desktop\mad\reactt\react-repo\Backend\middleware\auth.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Get the token part

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Authentication required: Token expired' });
        } else {
          return res.status(403).json({ message: 'Authentication required: Invalid token' });
        }
      }

      // If the token is valid, the decoded payload is available in the 'decoded' variable
      req.user = decoded; // Attach the decoded user info to the request.  This is CRUCIAL.
      next(); // Call next() to pass control to the next middleware/route handler
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

module.exports = auth;
