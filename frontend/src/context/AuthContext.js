import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

// Create context
export const AuthContext = createContext(null);

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on initial load
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // Optional: Validate token with the backend
          // This helps ensure the token hasn't expired or been invalidated
          try {
            await axios.get(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${userData.token}`
              }
            });
            setUser(userData);
          } catch (error) {
            console.error("Token validation failed:", error);
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      let userData;

      // If credentials already contains token and user data, just use that
      if (credentials.token) {
        userData = credentials;
      } else {
        // Otherwise make an API call to get a token
        const formData = new URLSearchParams();
        formData.append("username", credentials.email);
        formData.append("password", credentials.password);

        const response = await axios.post(`${API_BASE_URL}/auth/token`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (!response.data || !response.data.access_token) {
          throw new Error('Invalid response from server');
        }

        const token = response.data.access_token;

        // Decode token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));

        userData = {
          email: decoded.sub,
          user_type: decoded.user_type,
          token
        };
      }

      // Update state and localStorage
      console.log("Login successful:", userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;