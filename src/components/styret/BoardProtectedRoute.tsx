import { Navigate } from 'react-router-dom';
import { useBoardMember } from '../../hooks/useBoardMember';

export default function BoardProtectedRoute({ children }: { children: React.ReactNode }) {
  const { member, loading } = useBoardMember();

  if (loading) {
    return (
      <div className="deck-page flex items-center justify-center min-h-screen">
        <div className="deck-kicker">Laster …</div>
      </div>
    );
  }

  // Ikke-medlemmer (også innloggede investorer) sendes til /styret — ikke /register.
  if (!member) return <Navigate to="/styret" replace />;

  return <>{children}</>;
}
