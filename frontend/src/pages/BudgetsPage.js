import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { budgets as budgetsApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { expenseCategoryOptions } from '../utils/categories';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', limit: '', period: 'monthly', alertThreshold: 75 });
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState('');

  const loadBudgets = async () => {
    try {
      const response = await budgetsApi.getAll();
      setBudgets(response.data.budgets || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load budgets.');
    }
  };

  useEffect(() => { loadBudgets(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const payload = { 
        ...form, 
        limit: Number(form.limit),
        alertThreshold: Number(form.alertThreshold)
      };
      if (editingBudget) {
        await budgetsApi.update(editingBudget.id, payload);
      } else {
        await budgetsApi.create(payload);
      }
      setForm({ category: '', limit: '', period: 'monthly', alertThreshold: 75 });
      setEditingBudget(null);
      await loadBudgets();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save budget.');
    }
  };

  const getAlertBadge = (budget) => {
    if (budget.alertStatus === 'exceeded') {
      return <span className="alert-badge alert-badge-danger">Exceeded</span>;
    } else if (budget.alertStatus === 'warning') {
      return <span className="alert-badge alert-badge-warning">At Risk</span>;
    }
    return <span className="alert-badge alert-badge-success">On Track</span>;
  };

  return (
    <div className="page-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Plan with intention</p>
          <h1 className="page-title page-title-compact">Budgets</h1>
        </div>
        <button className="btn btn-primary" type="submit" form="budget-form">{editingBudget ? 'Update budget' : 'Save budget'}</button>
      </div>
      <form id="budget-form" className="dashboard-panel budget-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert" role="alert">{error}</div>}
        <div className="form-row">
          <label>Category<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} required><option value="">Select a category</option>{expenseCategoryOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label>Limit<input type="number" min="0.01" step="0.01" value={form.limit} onChange={event => setForm({ ...form, limit: event.target.value })} required /></label>
          <label>Period<select value={form.period} onChange={event => setForm({ ...form, period: event.target.value })}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
          <label>Alert Threshold (%)<input type="number" min="1" max="100" step="1" value={form.alertThreshold} onChange={event => setForm({ ...form, alertThreshold: event.target.value })} /></label>
        </div>
      </form>
      {budgets.length === 0 ? (
        <section className="dashboard-panel empty-state"><h2>No budgets yet</h2><p>Save a category limit to start comparing your spending with a plan.</p><Link to="/transactions" className="btn btn-secondary">Review transactions</Link></section>
      ) : (
        <div className="budget-list">{budgets.map(budget => <article className="dashboard-panel budget-card" key={budget.id}><div><h2>{budget.category}</h2><p>{budget.period} budget</p>{getAlertBadge(budget)}</div><strong>{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</strong><div className="budget-actions"><button type="button" className="table-action" onClick={() => { setEditingBudget(budget); setForm({ category: budget.category, limit: budget.limit, period: budget.period, alertThreshold: budget.alertThreshold }); }}>Edit</button><button type="button" className="table-action table-action-danger" onClick={async () => { await budgetsApi.delete(budget.id); await loadBudgets(); }}>Delete</button></div><progress value={Math.min(budget.percentage, 100)} max="100" /></article>)}</div>
      )}
    </div>
  );
};

export default BudgetsPage;