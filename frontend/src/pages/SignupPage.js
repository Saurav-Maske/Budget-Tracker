import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';

const SignupPage = () => {
  return (
    <div className="auth-page">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <SignupForm />
        <p className="login-footer">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;