import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <h1>Budget Tracker</h1>
        <p>Take control of your finances with our simple and intuitive budget tracking app.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          <a href="#features" className="btn btn-secondary">Learn More</a>
        </div>
      </section>
      <section className="features" id="features">
        <h2>Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Transaction Tracking</h3>
            <p>Record every income and expense with ease.</p>
          </div>
          <div className="feature-item">
            <h3>Budget Management</h3>
            <p>Set budgets for different categories and track your spending.</p>
          </div>
          <div className="feature-item">
            <h3>Reports & Insights</h3>
            <p>Visualize your financial data with charts and reports.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;