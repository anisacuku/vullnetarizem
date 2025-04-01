// src/components/common/Header.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUserCheck } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import './Header.css'; // Make sure to define styles

function Header() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <header className="header">
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
              <li className="nav-dropdown" onMouseLeave={closeDropdown}>
                <button onClick={toggleDropdown} className="nav-dropdown-button">
                  <FaUserCircle style={{ marginRight: 6 }} />
                  {user?.email || 'User'} ▾
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown-content">
                    <Link to="/dashboard" onClick={closeDropdown}>
                      <FaTachometerAlt /> Dashboard
                    </Link>
                    <Link to="/matches" onClick={closeDropdown}>
                      <FaUserCheck /> My Matches
                    </Link>
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
