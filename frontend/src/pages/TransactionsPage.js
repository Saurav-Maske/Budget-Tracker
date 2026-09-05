import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { transactions } from '../services/api';
import TransactionForm from '../components/forms/TransactionForm';
import StatsCard from '../components/widgets/StatsCard';
import RecentTransactions from '../components/widgets/RecentTransactions';
import ChartContainer from '../components/ui/ChartContainer';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useEffect, useState } from 'react';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await transactions.getAll();
        setTransactionsData(response.data);

        // Calculate stats
        const totalIncome = response.data
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpense = response.data
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        setStats({
          totalIncome,
          totalExpense,
          netSavings: totalIncome - totalExpense
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon="AiOutlineWallet"
          trend={stats.totalIncome >= 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="Total Expense"
          value={formatCurrency(stats.totalExpense)}
          icon="AiOutlineMinusSquare"
          trend="down"
        />
        <StatsCard
          title="Net Savings"
          value={formatCurrency(stats.netSavings)}
          icon={stats.netSavings >= 0 ? 'AiOutlineWallet' : 'AiOutlineMinusSquare'}
          trend={stats.netSavings >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <ChartContainer
          chartType="Line"
          title="Monthly Trend"
          description="Income vs Expense over time"
          // Data would be processed here for monthly trend
        />
        <ChartContainer
          chartType="Pie"
          title="Category Breakdown"
          description="Spending by category"
          // Data would be processed here for category breakdown
        />
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <RecentTransactions transactions={transactionsData.slice(0, 5)} />
      </div>

      {/* Add Transaction Button */}
      <div className="add-transaction-btn">
        <button onClick={() => { /* Open modal or navigate to add transaction */ }}>
          + Add Transaction
        </button>
      </div>
    </div>
  );
};

export default TransactionsPage;