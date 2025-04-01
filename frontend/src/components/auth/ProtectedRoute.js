import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-container"><LoadingSpinner /></div>;
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;