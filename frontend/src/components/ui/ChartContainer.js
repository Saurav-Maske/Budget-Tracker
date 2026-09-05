import React from 'react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Tooltip, Legend } from 'recharts';
import './ChartContainer.css';

const ChartContainer = ({
  chartType = 'Line',
  data = [],
  options = {},
  title = '',
  description = ''
}) => {
  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      {description && <p className="chart-description">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'Line' && (
          <LineChart data={data}>
            {/* Add axes, tooltip, etc. as needed */}
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
          </LineChart>
        )}
        {chartType === 'Pie' && (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${((index+1)*0xFFFFFF>>0).toString(16)}`} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;