import React from 'react';
import './Input.css';

const Input = ({ field = {}, meta = {}, label, helperText, type, ...inputProps }) => {
  const { value = '', onChange = () => {} } = field;
  const error = meta.touched ? meta.error : false;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className={`input-field${error ? ' input-error' : ''}`}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;