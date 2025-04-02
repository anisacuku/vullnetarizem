// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTopButton from './components/common/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import CalendarPage from './pages/CalendarPage';
import OpportunityListPage from './pages/OpportunityListPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import VolunteerProfilePage from './pages/VolunteerProfilePage';
import OrganizationProfilePage from './pages/OrganizationProfilePage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
import './components/common/Header.css';

function AppRoutes() {
  const location = useLocation();
  const hideHeaderFooterOn = ['/login', '/register'];
  const shouldHideHeaderFooter = hideHeaderFooterOn.includes(location.pathname);

  return (
    <div className="app full-width">
      {/* HEADER */}
      {!shouldHideHeaderFooter && <Header />}

      {/* MAIN CONTENT */}
      <main className="main-content full-width">
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
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
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
      </main>

      {/* FOOTER */}
      {!shouldHideHeaderFooter && <Footer />}

      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTopButton />
    </div>
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
