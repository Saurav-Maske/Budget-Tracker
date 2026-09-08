import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = ({ darkMode, onToggleTheme }) => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          Budget Tracker
        </Link>
        <nav className="header-nav">
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {darkMode ? 'Sun' : 'Moon'}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/transactions" className="nav-link">Transactions</Link>
              <Link to="/budgets" className="nav-link">Budgets</Link>
              <Link to="/reports" className="nav-link">Reports</Link>
              <div className="user-menu">
                <span className="user-name">{user.username}</span>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;