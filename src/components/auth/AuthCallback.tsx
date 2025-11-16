import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    console.log('AuthCallback render:', { user: !!user, loading, attempts, redirected: hasRedirectedRef.current });

    // Prevent multiple redirects
    if (hasRedirectedRef.current) {
      console.log('AuthCallback: Already redirected, skipping');
      return;
    }

    // Wait for loading to complete
    if (!loading) {
      if (user) {
        console.log('AuthCallback: ✅ User found!', user.email);
        hasRedirectedRef.current = true;
        navigate('/investor-dashboard', { replace: true });
      } else {
        console.log('AuthCallback: ❌ No user, attempt:', attempts);
        // Give it multiple attempts before giving up
        if (attempts < 3) {
          setTimeout(() => setAttempts(a => a + 1), 500);
        } else {
          console.log('AuthCallback: Failed after 3 attempts, redirecting to login');
          hasRedirectedRef.current = true;
          navigate('/investor-login', { replace: true });
        }
      }
    }
  }, [user, loading, navigate, attempts]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center p-8">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Verifying your login...
        </h2>
        <p className="text-slate-600">
          Please wait while we authenticate you.
        </p>
      </div>
    </div>
  );
}

