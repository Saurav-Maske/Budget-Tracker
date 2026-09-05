const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validation');
const { loginSchema, signupSchema } = require('../middleware/validation');
const authController = require('../controllers/authController');

// POST /auth/register
router.post('/register', validate(signupSchema), authController.register);

// POST /auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /auth/logout (optional)
router.post('/logout', authController.logout);

module.exports = router;