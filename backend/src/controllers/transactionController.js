const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const validation = require('../middleware/validation');

const transactionController = {
  getTransactions: async (req, res) => {
    try {
      const { type, category, startDate, endDate, limit, offset } = req.query;
      const where = { userId: req.user.id };

      if (type) where.type = type;
      if (category) where.category = category;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date[Sequelize.Op.gte] = new Date(startDate);
        if (endDate) where.date[Sequelize.Op.lte] = new Date(endDate);
      }

      const { rows, count } = await Transaction.findAndCountAll({
        where,
        order: [['date', 'DESC']],
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0
      });

      res.json({ success: true, transactions: rows, total: count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  createTransaction: async (req, res) => {
    try {
      const { type, amount, category, description, date } = req.body;
      const transaction = await Transaction.create({
        userId: req.user.id,
        type,
        amount,
        category,
        description: description || '',
        date: date || new Date()
      });

      // Optional: Check budget limits
      // const budget = await Budget.findOne({
      //   where: {
      //     userId: req.user.id,
      //     category,
      //     period: 'monthly',
      //     startDate: { [Sequelize.Op.lte]: new Date() },
      //     [Sequelize.Op.or]: [
      //       { endDate: { [Sequelize.Op.gte]: new Date() } },
      //       { endDate: null }
      //     ]
      //   }
      // });
      // if (budget) {
      //   const totalExpenses = await Transaction.sum('amount', {
      //     where: {
      //       userId: req.user.id,
      //       category,
      //       type: 'expense',
      //       date: {
      //         [Sequelize.Op.gte]: budget.startDate,
      //         [Sequelize.Op.lte]: budget.endDate || new Date()
      //       }
      //     }
      //   });
      //   if (totalExpenses + amount > budget.limit) {
      //     return res.status(400).json({
      //       success: false,
      //       message: 'Transaction exceeds budget limit'
      //     });
      //   }
      // }

      res.status(201).json({ success: true, transaction });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, amount, category, description, date } = req.body;

      const transaction = await Transaction.findOne({
        where: { id, userId: req.user.id }
      });

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      await transaction.update({
        type,
        amount,
        category,
        description: description || '',
        date: date || new Date()
      });

      res.json({ success: true, transaction });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findOne({
        where: { id, userId: req.user.id }
      });

      if (!transaction) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      await transaction.destroy();
      res.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = transactionController;