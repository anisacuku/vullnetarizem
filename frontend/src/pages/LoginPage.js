import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';
import API_BASE_URL from '../config';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

   useEffect(() => {
    console.log('Authentication status changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Navigating to home');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      console.log('Attempting login with:', email);

      const response = await axios.post(`${API_BASE_URL}/auth/token`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = response.data.access_token;
      if (!token) throw new Error('No token received');

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        email: decoded.sub,
        user_type: decoded.user_type,
        token,
      };

      console.log('Login successful, calling login function');
      await login(userData);  // Ensure this is awaited
      
      console.log('Login function completed');
      
      // Optional: Explicit navigation if needed
      // navigate('');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
            {!isLoading && <FaSignInAlt style={{ marginLeft: '8px' }} />}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;