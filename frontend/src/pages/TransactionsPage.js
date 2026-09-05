import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { transactions } from '../services/api';
import TransactionForm from '../components/forms/TransactionForm';
import RecentTransactions from '../components/widgets/RecentTransactions';
import { useEffect, useState } from 'react';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await transactions.getAll();
        const nextTransactions = response.data.transactions || [];
        setTransactionsData(nextTransactions);

      } catch (err) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, refreshKey]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page-shell transactions-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Your activity</p>
          <h1 className="page-title page-title-compact">Transactions</h1>
        </div>
      </div>

      <section className="dashboard-panel transaction-form-panel">
        <TransactionForm
          transaction={editingTransaction}
          onSaved={() => {
            setEditingTransaction(null);
            setRefreshKey(current => current + 1);
          }}
        />
      </section>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <RecentTransactions
          transactions={transactionsData}
          onEdit={setEditingTransaction}
          onDelete={async id => {
            await transactions.delete(id);
            setRefreshKey(current => current + 1);
          }}
        />
      </div>

    </div>
  );
};

export default TransactionsPage;