import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterLanding from './components/register/RegisterLanding';
import RegisterWizard from './components/register/RegisterWizard';
import AuthCallback from './components/auth/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DeckWelcome from './components/deck/DeckWelcome';
import DeckViewer from './components/deck/DeckViewer';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterLanding />} />
      <Route path="/register/wizard" element={<RegisterWizard />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/deck"
        element={
          <ProtectedRoute>
            <DeckWelcome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deck/view"
        element={
          <ProtectedRoute>
            <DeckViewer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
