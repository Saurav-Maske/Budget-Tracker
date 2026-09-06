import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { transactions } from '../services/api';
import TransactionForm from '../components/forms/TransactionForm';
import RecentTransactions from '../components/widgets/RecentTransactions';
import { useEffect, useState } from 'react';
import { expenseCategoryOptions, incomeCategoryOptions } from '../utils/categories';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          ...(filters.type && { type: filters.type }),
          ...(filters.category && { category: filters.category }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate })
        };
        const response = await transactions.getAll(params);
        let nextTransactions = response.data.transactions || [];

        // Client-side search filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          nextTransactions = nextTransactions.filter(t =>
            (t.description || '').toLowerCase().includes(searchLower)
          );
        }

        setTransactionsData(nextTransactions);
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, refreshKey, filters]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      searchTerm: ''
    });
  };

  const categoryOptions = [
    ...expenseCategoryOptions,
    ...incomeCategoryOptions
  ].filter((cat, idx, arr) => arr.findIndex(c => c.value === cat.value) === idx);

  return (
    <div className="page-shell transactions-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Your activity</p>
          <h1 className="page-title page-title-compact">Transactions</h1>
        </div>
      </div>

      <section className="dashboard-panel">
        <h2>Filters</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search description</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search transactions..."
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categoryOptions.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <button
              onClick={handleClearFilters}
              className="btn btn-secondary"
              style={{ marginTop: '24px' }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

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
        <h2>Transactions ({transactionsData.length})</h2>
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