import React from 'react';
import './Button.css';

const Button = ({ variant = 'primary', size = 'medium', onClick, children, disabled = false }) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;