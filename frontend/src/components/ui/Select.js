import React from 'react';
import './Select.css';

const Select = ({ field = {}, meta = {}, label, options, ...selectProps }) => {
  const { value = '', onChange = () => {} } = field;
  const error = meta.touched ? meta.error : false;

  return (
    <div className="select-group">
      {label && <label className="select-label">{label}</label>}
      <select
        className={`select-field${error ? ' select-error' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...selectProps}
      >
        <option value="">Select an option</option>
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};

export default Select;