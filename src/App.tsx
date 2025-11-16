import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MagicLinkLogin from './components/auth/MagicLinkLogin';
import AuthCallback from './components/auth/AuthCallback';
import InvestorDashboard from './pages/InvestorDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/investor-login" element={<MagicLinkLogin />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/investor-dashboard"
        element={
          <ProtectedRoute>
            <InvestorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}