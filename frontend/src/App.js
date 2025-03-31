// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import OpportunityListPage from './pages/OpportunityListPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import VolunteerProfilePage from './pages/VolunteerProfilePage';
import OrganizationProfilePage from './pages/OrganizationProfilePage';

import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const location = useLocation();
  const hideHeaderOn = ['/login', '/register'];
  const shouldHideHeader = hideHeaderOn.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/volunteer"
          element={
            <ProtectedRoute>
              <VolunteerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/organization"
          element={
            <ProtectedRoute>
              <OrganizationProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/opportunities" element={<OpportunityListPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
