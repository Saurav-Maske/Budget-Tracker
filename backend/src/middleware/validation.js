const Joi = require('joi');

// Define schemas
const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().min(0.01).required(),
  category: Joi.string().required(),
  description: Joi.string().allow(''),
  date: Joi.date().default(Date.now)
});

const budgetSchema = Joi.object({
  category: Joi.string().required(),
  limit: Joi.number().min(0).required(),
  period: Joi.string().valid('weekly', 'monthly', 'yearly').default('monthly'),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().allow(null),
  alertThreshold: Joi.number().min(1).max(100).default(75)
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }
  next();
};

module.exports = {
  signupSchema,
  loginSchema,
  transactionSchema,
  budgetSchema,
  validate
};