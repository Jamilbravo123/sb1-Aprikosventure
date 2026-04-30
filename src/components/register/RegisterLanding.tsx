import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/aprikos-venture-logo.svg';

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
      console.error('Supabase OTP error:', error.message, error);
      setSignInError(`Could not send sign-in link: ${error.message}`);
    } else {
      setSignInSent(true);
    }
  };

  return (
    <div className="deck-page">
      <div
        className="deck-mesh-bg min-h-screen flex flex-col items-center justify-center text-center"
        style={{ padding: 'clamp(32px, 5vw, 64px)' }}
      >
        {/* Logo */}
        <div className="mb-8 sm:mb-14">
          <img
            src={logo}
            alt="Aprikos Venture"
            style={{ height: 'clamp(80px, 15vw, 140px)', filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Eyebrow */}
        <div className="deck-eyebrow mb-4 sm:mb-6">Investor Pre-Registration</div>

        {/* Headline */}
        <h1
          className="deck-display mb-5 sm:mb-8"
          style={{ fontSize: 'clamp(28px, 6vw, 72px)', maxWidth: '800px' }}
        >
          Early access to a{' '}
          <em className="deck-italic-gold">cross-border</em> venture platform
        </h1>

        {/* Lede */}
        <p className="deck-lede mb-6 sm:mb-10" style={{ maxWidth: '580px', fontSize: 'clamp(15px, 2.5vw, 19px)' }}>
          A Norway-based venture builder developing technology-driven companies
          across digital assets, healthcare, and AI. Pre-register for access to
          our investor deck and updates.
        </p>

        {/* Stats row */}
        <div
          className="flex flex-wrap justify-center gap-6 sm:gap-16 mb-8 sm:mb-12 pb-6 sm:pb-8 w-full"
          style={{ borderBottom: '1px solid var(--deck-rule)', maxWidth: '700px' }}
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
                style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--deck-gold)' }}
              >
                {s.n}
              </div>
              <div className="deck-kicker mt-2">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="deck-btn-primary"
          onClick={() => navigate('/register/wizard')}
          style={{ padding: '18px 56px', fontSize: '14px' }}
        >
          Pre-Register Now <span className="text-lg">→</span>
        </button>

        {/* Sign in link */}
        <div className="mt-5">
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
            <form onSubmit={handleSignIn} className="flex flex-col items-center gap-3 mt-2">
              <input
                type="email"
                className="deck-field"
                style={{ maxWidth: '360px', textAlign: 'center' }}
                placeholder="Your email address"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <button className="deck-btn-primary" style={{ padding: '16px 48px' }} disabled={sending}>
                {sending ? 'Sending...' : 'Send Link'}
              </button>
              {signInError && (
                <span className="text-sm" style={{ color: '#c94a4a' }}>{signInError}</span>
              )}
            </form>
          )}
        </div>

        {/* Disclaimer */}
        <p
          className="mt-8 sm:mt-12"
          style={{
            fontSize: '12px',
            lineHeight: 1.7,
            color: 'var(--deck-ink-faint)',
            maxWidth: '560px',
          }}
        >
          This opportunity is directed at professional and qualified investors only.
          Minimum commitment €100,000. This is not a public offering and does not
          constitute investment advice or a solicitation to invest.
        </p>
      </div>
    </div>
  );
}
