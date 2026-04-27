import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterLanding() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInSent, setSignInSent] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSignInError(null);
    const { error } = await signIn(signInEmail);
    setSending(false);
    if (error) {
      setSignInError('Could not send sign-in link. Please try again.');
    } else {
      setSignInSent(true);
    }
  };

  return (
    <div className="deck-page">
      <div
        className="deck-mesh-bg min-h-screen flex flex-col justify-center"
        style={{ padding: 'clamp(32px, 5vw, 64px)' }}
      >
        {/* Logo */}
        <div className="mb-12">
          <span
            className="text-xl"
            style={{ fontFamily: 'var(--deck-f-display)', fontWeight: 500 }}
          >
            Aprikos<span style={{ color: 'var(--deck-gold)' }}>.</span>
          </span>
        </div>

        {/* Eyebrow */}
        <div className="deck-eyebrow mb-5">Investor Pre-Registration</div>

        {/* Headline */}
        <h1
          className="deck-display mb-7"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', maxWidth: '700px' }}
        >
          Early access to a{' '}
          <em className="deck-italic-gold">cross-border</em> venture platform
        </h1>

        {/* Lede */}
        <p className="deck-lede mb-9" style={{ maxWidth: '560px' }}>
          A Norway-based venture builder developing technology-driven companies
          across digital assets, healthcare, and AI. Pre-register for access to
          our investor deck and updates.
        </p>

        {/* Stats row */}
        <div
          className="flex flex-wrap gap-8 sm:gap-12 mb-10 pb-8"
          style={{ borderBottom: '1px solid var(--deck-rule)' }}
        >
          {[
            { n: '€5M', l: 'Raise Target' },
            { n: '5', l: 'Active Ventures' },
            { n: '3', l: 'Verticals' },
            { n: '4+', l: 'Years Building' },
          ].map((s) => (
            <div key={s.l}>
              <div
                className="deck-display"
                style={{ fontSize: '32px', color: 'var(--deck-gold)' }}
              >
                {s.n}
              </div>
              <div className="deck-kicker mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="deck-btn-primary"
          onClick={() => navigate('/register/wizard')}
        >
          Pre-Register Now <span className="text-lg">→</span>
        </button>

        {/* Sign in link */}
        <div className="mt-4">
          {!showSignIn ? (
            <button
              className="text-sm"
              style={{
                color: 'var(--deck-ink-faint)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setShowSignIn(true)}
            >
              Already registered?{' '}
              <span
                style={{
                  color: 'var(--deck-gold)',
                  textDecoration: 'underline',
                }}
              >
                Sign in with magic link
              </span>
            </button>
          ) : signInSent ? (
            <p className="text-sm" style={{ color: 'var(--deck-gold-light)' }}>
              ✉ Check your inbox at{' '}
              <strong>{signInEmail}</strong>
            </p>
          ) : (
            <form onSubmit={handleSignIn} className="flex flex-wrap gap-3 items-center mt-2">
              <input
                type="email"
                className="deck-field"
                style={{ maxWidth: '280px' }}
                placeholder="Your email address"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <button className="deck-btn-primary" style={{ padding: '16px 24px' }} disabled={sending}>
                {sending ? 'Sending...' : 'Send Link'}
              </button>
              {signInError && (
                <span className="text-sm" style={{ color: '#c94a4a' }}>{signInError}</span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
