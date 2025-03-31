import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

function Header() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Volunteer Matching Logo"
            className="logo-image"
          />
          <span className="logo-text">Volunteer Matching</span>
        </Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/opportunities">Opportunities</Link></li>
            {currentUser ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/matches">My Matches</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </>
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
