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
  const colors = ['var(--chart-net)', 'var(--chart-expense)', '#e4a93a', 'var(--chart-income)', '#8b5e83', 'var(--chart-text)'];

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      {description && <p className="chart-description">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'Line' && (
          <LineChart data={data}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="var(--chart-text)" />
            <YAxis stroke="var(--chart-text)" />
            <Line type="monotone" dataKey="value" stroke="var(--chart-net)" strokeWidth={2} />
            <Tooltip />
            <Legend />
          </LineChart>
        )}
        {chartType === 'Trend' && (
          <LineChart data={data}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="var(--chart-text)" />
            <YAxis stroke="var(--chart-text)" />
            <Tooltip formatter={value => [`$${Number(value).toFixed(2)}`, '']} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Income" stroke="var(--chart-income)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="var(--chart-expense)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="net" name="Net" stroke="var(--chart-net)" strokeWidth={2} dot={false} />
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