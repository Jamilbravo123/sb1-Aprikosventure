import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { bindAndTouchMember } from '../../lib/boardApi';

export default function BoardCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finish = async (userId: string, email: string) => {
      try {
        await bindAndTouchMember(userId, email);
      } catch {
        // Binding er best-effort; medlemssjekken i BoardLanding matcher også på e-post.
      }
      navigate('/styret', { replace: true });
    };

    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await finish(session.user.id, session.user.email);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeError) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            await finish(user.id, user.email);
            return;
          }
        }
      }

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!sessionError) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            await finish(user.id, user.email);
            return;
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { data: { session: retrySession } } = await supabase.auth.getSession();
      if (retrySession?.user?.email) {
        await finish(retrySession.user.id, retrySession.user.email);
        return;
      }

      setError('Innloggingslenken er utløpt. Be om en ny.');
      setTimeout(() => navigate('/styret'), 3000);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="deck-page styret-page flex items-center justify-center min-h-screen">
      {error ? (
        <p className="deck-lede" style={{ color: '#c94a4a' }}>{error}</p>
      ) : (
        <p className="deck-kicker">Verifiserer innloggingslenken …</p>
      )}
    </div>
  );
}
