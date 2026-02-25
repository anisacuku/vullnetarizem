// src/components/common/Header.js
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
} from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import './Header.css';

function Header() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobilePanelRef = useRef(null);

  const username = useMemo(() => {
    if (user?.name?.trim()) return user.name.trim();
    if (user?.email?.includes('@')) return user.email.split('@')[0];
    return 'User';
  }, [user]);

  const closeAll = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  // Close on Escape + click outside
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAll();
    };

    const onMouseDown = (e) => {
      const t = e.target;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) setDropdownOpen(false);
      if (mobilePanelRef.current && !mobilePanelRef.current.contains(t)) {
        // if clicking overlay background, close
        const isOverlay = t?.classList?.contains('mobile-overlay');
        if (isOverlay) setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const go = (path) => {
    navigate(path);
    closeAll();
  };

  return (
    <header className="header">
      <div className="container header-container">
        <NavLink to="/" className="logo" onClick={closeAll} aria-label="Go to home">
          <img src={logo} alt="Volunteer Matching Logo" className="logo-image" />
          <span className="logo-text">Volunteer Matching</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="nav-desktop" aria-label="Primary">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/opportunities"
                className={({ isActive }) => (isActive ? 'nav-active' : undefined)}
              >
                Opportunities
              </NavLink>
            </li>

            {isAuthenticated ? (
              <li className="nav-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className="nav-dropdown-button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                >
                  <FaUserCircle />
                  <span className="nav-username">{username}</span>
                  <span className="dropdown-arrow" aria-hidden="true">
                    ▾
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown-content" role="menu">
                    <button type="button" onClick={() => go('/dashboard')} className="dropdown-link-button">
                      <FaTachometerAlt /> Dashboard
                    </button>
                    <button type="button" onClick={() => go('/matches')} className="dropdown-link-button">
                      <FaUserCheck /> My Matches
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeAll();
                      }}
                      className="dropdown-link-button logout"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <NavLink to="/login" className="nav-auth-button">
                  HYR
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile button */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile overlay + panel */}
      {mobileOpen && (
        <div className="mobile-overlay">
          <div className="mobile-panel" ref={mobilePanelRef}>
            <div className="mobile-header">
              <span className="mobile-title">Menu</span>
              <button type="button" className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <div className="mobile-links">
              <NavLink to="/" onClick={closeAll} className="mobile-link">
                Home
              </NavLink>
              <NavLink to="/opportunities" onClick={closeAll} className="mobile-link">
                Opportunities
              </NavLink>

              <div className="mobile-divider" />

              {isAuthenticated ? (
                <>
                  <button type="button" className="mobile-action" onClick={() => go('/dashboard')}>
                    <FaTachometerAlt /> Dashboard
                  </button>
                  <button type="button" className="mobile-action" onClick={() => go('/matches')}>
                    <FaUserCheck /> My Matches
                  </button>
                  <button
                    type="button"
                    className="mobile-action mobile-logout"
                    onClick={() => {
                      logout();
                      closeAll();
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" onClick={closeAll} className="mobile-cta">
                  HYR
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;