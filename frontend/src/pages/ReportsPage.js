import React, { useEffect, useState } from 'react';
import { transactions } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import ChartContainer from '../components/ui/ChartContainer';
import { jsPDF } from 'jspdf';

const ReportsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    transactions.getAll({ limit: 100 }).then(response => setData(response.data.transactions || []));
  }, []);

  const income = data.filter(item => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = data.filter(item => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
  const categoryData = Object.values(data.filter(item => item.type === 'expense').reduce((groups, item) => {
    groups[item.category] = groups[item.category] || { name: item.category, value: 0 };
    groups[item.category].value += Number(item.amount);
    return groups;
  }, {}));
  const monthlyData = Object.values(data.reduce((groups, item) => {
    const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    groups[month] = groups[month] || { name: month, value: 0 };
    groups[month].value += item.type === 'expense' ? Number(item.amount) : 0;
    return groups;
  }, {}));

  const handleExport = () => {
    const document = new jsPDF();
    const categoryLines = categoryData
      .sort((first, second) => second.value - first.value)
      .map(item => `${item.name}: ${formatCurrency(item.value)}`);

    document.setFontSize(20);
    document.text('Budget Tracker Report', 20, 25);
    document.setFontSize(11);
    document.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    document.text(`Total income: ${formatCurrency(income)}`, 20, 55);
    document.text(`Total spending: ${formatCurrency(expenses)}`, 20, 65);
    document.text(`Balance: ${formatCurrency(income - expenses)}`, 20, 75);
    document.text('Spending by category', 20, 95);

    categoryLines.forEach((line, index) => {
      document.text(line, 25, 105 + (index * 8));
    });

    document.save('budget-tracker-report.pdf');
  };

  return (
    <div className="page-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">See the bigger picture</p>
          <h1 className="page-title page-title-compact">Reports</h1>
        </div>
        <button className="btn btn-secondary" type="button" onClick={handleExport} disabled={data.length === 0}>Export report</button>
      </div>
      {data.length === 0 ? <section className="dashboard-panel empty-state"><h2>No report data yet</h2><p>Add transactions to generate your income and spending report.</p></section> : <>
        <section className="dashboard-panel">
          <h2>Monthly trends</h2>
          <p>Total income: {formatCurrency(income)}</p><p>Total spending: {formatCurrency(expenses)}</p>
        </section>
        <div className="charts-grid">
          <ChartContainer chartType="Line" data={monthlyData} title="Spending by month" description="Expense totals from your transactions" />
          <ChartContainer chartType="Pie" data={categoryData} title="Expenses by category" description="Expense totals grouped by category" />
        </div>
      </>}
    </div>
  );
};

export default ReportsPage;