import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="login-container">
        <h2>Login</h2>
        <LoginForm />
        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;