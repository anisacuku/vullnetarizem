import React, { createContext, useEffect, useState, useContext } from 'react';
import API_BASE_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error restoring user from localStorage:", error);
      localStorage.removeItem('user'); // Clear potentially corrupted data
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data || !data.access_token) {
        throw new Error('Invalid response: No access token received');
      }

      const token = data.access_token;

      // Safely decode the token
      let decoded;
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        decoded = JSON.parse(atob(base64));
      } catch (tokenError) {
        console.error("Token decode error:", tokenError);
        throw new Error('Invalid token format');
      }

      const userData = {
        email: decoded.sub,
        user_type: decoded.user_type,
        token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData; // Return user data for component usage
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to allow components to handle errors
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);