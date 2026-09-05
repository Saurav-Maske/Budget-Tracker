import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <h3 className="stats-card-title">{title}</h3>
        <div className="stats-card-icon">
          {/* In a real implementation, we would render the actual icon from react-icons */}
          <span className={`icon-${icon}`}>{icon}</span>
        </div>
      </div>
      <div className="stats-card-value">{value}</div>
      {trend && (
        <div className={`stats-card-trend trend-${trend}`}>
          {trend === 'up' ? '▲' : '▼'}
        </div>
      )}
    </div>
  );
};

export default StatsCard;