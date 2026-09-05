import React from 'react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Tooltip, Legend, XAxis, YAxis } from 'recharts';
import './ChartContainer.css';

const ChartContainer = ({
  chartType = 'Line',
  data = [],
  options = {},
  title = '',
  description = ''
}) => {
  const colors = ['#1f7a58', '#d96950', '#e4a93a', '#4b78a8', '#8b5e83', '#6b7a72'];

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      {description && <p className="chart-description">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'Line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#1f7a58" strokeWidth={2} />
            <Tooltip />
            <Legend />
          </LineChart>
        )}
        {chartType === 'Pie' && (
          <PieChart>
            <Tooltip />
            <Pie data={data} dataKey="value" nameKey="name">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;