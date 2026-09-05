import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transactions } from '../services/api';
import RecentTransactions from '../components/widgets/RecentTransactions';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await transactions.getAll({ limit: 100 });
        setTransactionData(response.data.transactions || []);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const totalIncome = transactionData
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalExpense = transactionData
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  return (
    <div className="page-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Your financial snapshot</p>
          <h1 className="page-title">Welcome, {user?.username || 'there'}.</h1>
        </div>
        <Link to="/transactions" className="btn btn-primary">Add transaction</Link>
      </div>
      {loading ? <p>Loading your transactions...</p> : transactionData.length === 0 ? (
        <section className="dashboard-panel empty-state">
          <h2>Your dashboard is ready</h2>
          <p>Add your first transaction to see your real balance and spending activity here.</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <article className="stat-card"><span>Available balance</span><strong>{formatCurrency(totalIncome - totalExpense)}</strong></article>
            <article className="stat-card"><span>Total income</span><strong>{formatCurrency(totalIncome)}</strong></article>
            <article className="stat-card"><span>Total spending</span><strong>{formatCurrency(totalExpense)}</strong></article>
          </div>
          <section className="dashboard-panel dashboard-recent">
            <h2>Recent transactions</h2>
            <RecentTransactions transactions={transactionData.slice(0, 5)} />
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;