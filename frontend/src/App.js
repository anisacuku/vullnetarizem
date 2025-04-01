// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
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
  const hideHeaderFooterOn = ['/login', '/register'];
  const isDashboard = location.pathname.startsWith('/dashboard');
  const shouldHideHeaderFooter = hideHeaderFooterOn.includes(location.pathname);

  return (
    <>
      {/* HEADER */}
      {!shouldHideHeaderFooter && !isDashboard && <Header />}
      {isDashboard && (
        <header style={{ backgroundColor: '#0d1b2a', color: 'white', padding: '1rem' }}>
          <h2 style={{ margin: 0 }}>Mirësevjen në Panelin tënd!</h2>
        </header>
      )}

      {/* ROUTES */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/opportunities" element={<OpportunityListPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />

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
      </Routes>

      {/* FOOTER */}
      {!shouldHideHeaderFooter && !isDashboard && <Footer />}
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
