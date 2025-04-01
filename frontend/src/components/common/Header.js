// src/components/common/Header.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUserCheck } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import './Header.css';

function Header() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Get the username from email (before the @ symbol)
  const username = user?.email ? user.email.split('@')[0] : 'User';

  // Handle navigation to dashboard
  const handleDashboardClick = () => {
    navigate('/dashboard');
    closeDropdown();
  };

  // Handle navigation to matches
  const handleMatchesClick = () => {
    navigate('/matches');
    closeDropdown();
  };

  return (
    <header className="header full-width">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Volunteer Matching Logo" className="logo-image" />
          <span className="logo-text">Volunteer Matching</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/opportunities">Opportunities</Link></li>

            {isAuthenticated ? (
              <li className="nav-dropdown">
                <button
                  onClick={toggleDropdown}
                  className="nav-dropdown-button"
                  onMouseEnter={() => setDropdownOpen(true)}
                >
                  <FaUserCircle style={{ marginRight: 8 }} />
                  {username} <span className="dropdown-arrow">▾</span>
                </button>

                {dropdownOpen && (
                  <div
                    className="nav-dropdown-content"
                    onMouseLeave={closeDropdown}
                  >
                    <button onClick={handleDashboardClick} className="dropdown-link-button">
                      <FaTachometerAlt /> Dashboard
                    </button>
                    <button onClick={handleMatchesClick} className="dropdown-link-button">
                      <FaUserCheck /> My Matches
                    </button>
                    <button onClick={() => { logout(); closeDropdown(); }} className="logout">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login" className="nav-auth-button">HYR</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;