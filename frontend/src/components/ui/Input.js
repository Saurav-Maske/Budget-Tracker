import React from 'react';
import './Input.css';

const Input = ({ type, label, value, onChange, error, helperText }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className={`input-field${error ? ' input-error' : ''}`}
        value={value}
        onChange={onChange}
      />
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;