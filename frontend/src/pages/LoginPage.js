import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';
import axios from 'axios';
import API_BASE_URL from '../config';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email });
      console.log('API URL:', `${API_BASE_URL}/auth/token`);

      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      // Add more detailed logging and error handling
      const response = await axios.post(`${API_BASE_URL}/auth/token`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      console.log('Login response:', response.data);

      if (!response.data.access_token) {
        throw new Error('No access token received');
      }

      const token = response.data.access_token;

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token:', decoded);

        const userData = {
          email: decoded.sub,
          user_type: decoded.user_type,
          token
        };

        login(userData); // update global context
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('Navigation to dashboard...');
        navigate('/dashboard');
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
        setError('Authentication error: Invalid token format');
      }
    } catch (err) {
      console.error('Login error:', err);

      // Provide more specific error messages based on the error
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Response error data:', err.response.data);
        console.error('Response status:', err.response.status);

        if (err.response.status === 401) {
          setError('Invalid email or password');
        } else if (err.response.status === 404) {
          setError('API endpoint not found. Check server configuration.');
        } else {
          setError(`Server error: ${err.response.status} - ${err.response.data.detail || 'Unknown error'}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request error:', err.request);
        setError('No response from server. Check your internet connection or server status.');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
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