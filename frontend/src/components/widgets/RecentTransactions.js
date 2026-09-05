import React from 'react';
import { formatDate } from '../../utils/formatters';
import './RecentTransactions.css';

const RecentTransactions = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="recent-transactions-empty">
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="recent-transactions-list">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="text-end">Amount</th>
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.date)}</td>
              <td>{tx.description || '-'}</td>
              <td>{tx.category}</td>
              <td className={`text-end amount-${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}{tx.amount}
              </td>
              {(onEdit || onDelete) && <td className="transaction-actions">
                {onEdit && <button type="button" className="table-action" onClick={() => onEdit(tx)}>Edit</button>}
                {onDelete && <button type="button" className="table-action table-action-danger" onClick={() => onDelete(tx.id)}>Delete</button>}
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;