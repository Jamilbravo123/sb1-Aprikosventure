import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterLanding from './components/register/RegisterLanding';
import RegisterWizard from './components/register/RegisterWizard';
import AuthCallback from './components/auth/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DeckWelcome from './components/deck/DeckWelcome';
import DeckViewer from './components/deck/DeckViewer';
import BoardLanding from './pages/styret/BoardLanding';
import BoardCallback from './pages/styret/BoardCallback';
import BoardProject from './pages/styret/BoardProject';
import BoardDocuments from './pages/styret/BoardDocuments';
import BoardAdmin from './pages/styret/BoardAdmin';
import BoardProtectedRoute from './components/styret/BoardProtectedRoute';

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
      <Route path="/styret" element={<BoardLanding />} />
      <Route path="/styret/callback" element={<BoardCallback />} />
      <Route
        path="/styret/prosjekt/:slug"
        element={
          <BoardProtectedRoute>
            <BoardProject />
          </BoardProtectedRoute>
        }
      />
      <Route
        path="/styret/dokumenter"
        element={
          <BoardProtectedRoute>
            <BoardDocuments />
          </BoardProtectedRoute>
        }
      />
      <Route
        path="/styret/admin"
        element={
          <BoardProtectedRoute>
            <BoardAdmin />
          </BoardProtectedRoute>
        }
      />
    </Routes>
  );
}
