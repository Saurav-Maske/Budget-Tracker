const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const getBudgetDateRange = (budget) => {
  const startDate = new Date(budget.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = budget.endDate ? new Date(budget.endDate) : new Date();
  if (budget.endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

const budgetController = {
  getBudgets: async (req, res) => {
    try {
      const budgets = await Budget.findAll({
        where: { userId: req.user.id }
      });

      // Format the response
      const formattedBudgets = await Promise.all(budgets.map(async (budget) => {
        const { startDate, endDate } = getBudgetDateRange(budget);
        const spent = await Transaction.sum('amount', {
          where: {
            userId: req.user.id,
            category: budget.category,
            type: 'expense',
            date: {
              [Op.gte]: startDate,
              [Op.lte]: endDate
            }
          }
        }) || 0;
        const limit = parseFloat(budget.limit);
        const spentAmount = parseFloat(spent);

        const percentage = limit > 0 ? (spentAmount / limit) * 100 : 0;
        let alertStatus = 'on-track';
        if (spentAmount > limit) {
          alertStatus = 'exceeded';
        } else if (percentage >= budget.alertThreshold) {
          alertStatus = 'warning';
        }

        return {
          id: budget.id,
          category: budget.category,
          limit,
          period: budget.period,
          startDate: budget.startDate,
          endDate: budget.endDate,
          spent: spentAmount,
          remaining: limit - spentAmount,
          percentage,
          alertThreshold: parseFloat(budget.alertThreshold),
          alertStatus
        };
      }));

      res.json({ success: true, budgets: formattedBudgets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  setBudget: async (req, res) => {
    try {
      const { category, limit, period, startDate, endDate, alertThreshold } = req.body;
      const userId = req.user.id;

      // Upsert budget (update if exists, create if not)
      const [budget, created] = await Budget.findOrCreate({
        where: {
          userId,
          category,
          period: period || 'monthly'
        },
        defaults: {
          limit,
          startDate: startDate || new Date(),
          endDate: endDate || null,
          alertThreshold: alertThreshold || 75
        }
      });

      if (!created) {
        // Update existing budget
        await budget.update({
          limit,
          startDate: startDate || budget.startDate,
          endDate: endDate || budget.endDate,
          alertThreshold: alertThreshold || budget.alertThreshold
        });
      }

      res.json({
        success: true,
        budget: budget.get(),
        message: created ? 'Budget created' : 'Budget updated'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  updateBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const { category, limit, period, startDate, endDate, alertThreshold } = req.body;
      const budget = await Budget.findOne({ where: { id, userId: req.user.id } });

      if (!budget) {
        return res.status(404).json({ success: false, message: 'Budget not found' });
      }

      await budget.update({
        category,
        limit,
        period,
        startDate: startDate || budget.startDate,
        endDate: endDate || null,
        alertThreshold: alertThreshold || budget.alertThreshold
      });

      res.json({ success: true, budget: budget.get() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  deleteBudget: async (req, res) => {
    try {
      const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });

      if (!budget) {
        return res.status(404).json({ success: false, message: 'Budget not found' });
      }

      await budget.destroy();
      res.json({ success: true, message: 'Budget deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  checkBudgetStatus: async (req, res) => {
    try {
      const { category } = req.params;
      const userId = req.user.id;
      const period = 'monthly'; // Default period for checking status

      // Get budget for this category and period
      const budget = await Budget.findOne({
        where: {
          userId,
          category,
          period
        }
      });

      if (!budget) {
        return res.json({
          success: true,
          budget: null,
          message: 'No budget set for this category'
        });
      }

      // Calculate spent amount in the budget period
      const { startDate, endDate } = getBudgetDateRange(budget);
      const spent = await Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          category,
          type: 'expense',
          date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      }) || 0;

      const limit = parseFloat(budget.limit);
      const spentAmount = parseFloat(spent);
      const remaining = limit - spentAmount;
      const percentage = limit > 0 ? (spentAmount / limit) * 100 : 0;

      res.json({
        success: true,
        budget: {
          id: budget.id,
          category: budget.category,
          limit,
          period: budget.period,
          startDate: budget.startDate,
          endDate: budget.endDate,
          spent: spentAmount,
          remaining,
          percentage
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = budgetController;