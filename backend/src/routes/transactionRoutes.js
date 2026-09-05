const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validation');
const { transactionSchema } = require('../middleware/validation');
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

// All routes are protected by auth middleware
router.use(auth);

// GET /api/transactions
router.get('/', transactionController.getTransactions);

// POST /api/transactions
router.post('/', validate(transactionSchema), transactionController.createTransaction);

// PUT /api/transactions/:id
router.put('/:id', validate(transactionSchema), transactionController.updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;