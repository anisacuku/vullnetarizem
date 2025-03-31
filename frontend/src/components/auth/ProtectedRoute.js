import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;