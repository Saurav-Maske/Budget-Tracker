const jwtUtils = require('../utils/jwtUtils');

const auth = async (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authorization.slice(7).trim();

  try {
    const decoded = jwtUtils.verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

module.exports = auth;