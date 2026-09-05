const User = require('../models/User');
const jwtUtils = require('../utils/jwtUtils');

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      user = await User.findOne({ where: { username } });
      if (user) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }

      // Create user
      user = await User.create({
        username,
        email,
        password
      });

      // Generate token
      const token = jwtUtils.sign({ id: user.id, email: user.email });

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwtUtils.sign({ id: user.id, email: user.email });

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  logout: async (req, res) => {
    // In a more advanced setup, we might invalidate the token on the server side.
    // For now, we just return success; token removal is handled client-side.
    res.json({ success: true, message: 'Logged out successfully' });
  }
};

module.exports = authController;