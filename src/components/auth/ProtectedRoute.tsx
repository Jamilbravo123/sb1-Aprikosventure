import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('investors')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setVerified(!!data));
  }, [user]);

  if (loading || (user && verified === null)) {
    return (
      <div className="deck-page flex items-center justify-center min-h-screen">
        <div className="deck-kicker">Loading...</div>
      </div>
    );
  }

  if (!user || !verified) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}
