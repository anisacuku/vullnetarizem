// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTopButton from './components/common/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

import './App.css';
import './components/common/Header.css';

// ✅ Lazy-loaded pages (code splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MatchesPage = lazy(() => import('./pages/MatchesPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const OpportunityListPage = lazy(() => import('./pages/OpportunityListPage'));
const OpportunityDetailPage = lazy(() => import('./pages/OpportunityDetailPage'));
const VolunteerProfilePage = lazy(() => import('./pages/VolunteerProfilePage'));
const OrganizationProfilePage = lazy(() => import('./pages/OrganizationProfilePage'));

function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 8 }}>404</h1>
        <p style={{ marginBottom: 16 }}>This page doesn’t exist.</p>
        <a className="button primary" href="/">
          Go home
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  // Hide header/footer for auth pages
  const hideHeaderFooterOn = ['/login', '/register'];
  const shouldHideHeaderFooter = hideHeaderFooterOn.includes(location.pathname);

  return (
    <div className="app">
      {!shouldHideHeaderFooter && <Header />}

      <main className="main-content">
        <Suspense
          fallback={
            <div className="page">
              <LoadingSpinner />
            </div>
          }
        >
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

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!shouldHideHeaderFooter && <Footer />}

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