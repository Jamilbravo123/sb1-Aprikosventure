import { useNavigate } from 'react-router-dom';

export default function RegistrationReceived() {
  const navigate = useNavigate();

  return (
    <div className="deck-page">
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center"
        style={{ background: 'var(--deck-bg-2)', padding: 'clamp(32px, 5vw, 64px)' }}
      >
        <div style={{ fontSize: '40px', color: 'var(--deck-gold)', marginBottom: '24px' }}>
          ✓
        </div>
        <h2 className="deck-display" style={{ fontSize: '28px', marginBottom: '12px' }}>
          You're on the list
        </h2>
        <p className="deck-lede" style={{ maxWidth: '440px' }}>
          Thank you for registering your interest. We are currently updating our
          investor materials and will reach out to you personally.
        </p>

        <button
          className="deck-btn-ghost mt-8"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>

        <p
          className="mt-10"
          style={{
            fontSize: '12px',
            lineHeight: 1.6,
            color: 'var(--deck-ink-faint)',
            maxWidth: '480px',
          }}
        >
          For professional and qualified investors only. Minimum commitment €100,000.
        </p>
      </div>
    </div>
  );
}
