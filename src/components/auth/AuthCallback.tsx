import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Check if we already have a session (onAuthStateChange may have handled it)
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Session exists — update last_login and redirect
        await supabase
          .from('investors')
          .update({ last_login: new Date().toISOString(), user_id: session.user.id })
          .eq('email', session.user.email);
        navigate('/deck', { replace: true });
        return;
      }

      // No session yet — try to exchange code/token from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('investors')
              .update({ last_login: new Date().toISOString(), user_id: user.id })
              .eq('email', user.email);
          }
          navigate('/deck', { replace: true });
          return;
        }
      }

      // Try hash-based tokens (older Supabase flow)
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
          if (user) {
            await supabase
              .from('investors')
              .update({ last_login: new Date().toISOString(), user_id: user.id })
              .eq('email', user.email);
          }
          navigate('/deck', { replace: true });
          return;
        }
      }

      // Nothing worked — wait a moment for onAuthStateChange to fire
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { data: { session: retrySession } } = await supabase.auth.getSession();
      if (retrySession) {
        navigate('/deck', { replace: true });
        return;
      }

      setError('Sign-in link expired. Please request a new one.');
      setTimeout(() => navigate('/register'), 3000);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="deck-page flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-center">
          <p className="deck-lede" style={{ color: '#c94a4a' }}>{error}</p>
          <p className="deck-kicker mt-4">Redirecting to registration...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="deck-kicker">Verifying your sign-in link...</p>
        </div>
      )}
    </div>
  );
}
