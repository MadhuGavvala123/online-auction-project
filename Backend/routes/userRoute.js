const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const User = require('../models/User'); // If you don't have this yet, use req.user directly

// GET /user/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user; // Comes from JWT middleware
    res.json({ username: user.email }); // or user.name, depending on your payload
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
});

module.exports = router;
