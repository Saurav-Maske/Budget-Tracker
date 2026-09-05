const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validation');
const { budgetSchema } = require('../middleware/validation');
const auth = require('../middleware/auth');
const budgetController = require('../controllers/budgetController');

// All routes are protected by auth middleware
router.use(auth);

// GET /api/budgets
router.get('/', budgetController.getBudgets);

// POST /api/budgets
router.post('/', validate(budgetSchema), budgetController.setBudget);

// PUT /api/budgets/:id
router.put('/:id', validate(budgetSchema), budgetController.updateBudget);

// DELETE /api/budgets/:id
router.delete('/:id', budgetController.deleteBudget);

// GET /api/budgets/:category
router.get('/:category', budgetController.checkBudgetStatus);

module.exports = router;