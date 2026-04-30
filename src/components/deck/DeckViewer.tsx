import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function DeckViewer() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--deck-bg)',
          borderBottom: '1px solid var(--deck-rule)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate('/deck')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--deck-ink-faint)',
            fontFamily: 'var(--deck-f-body)',
            fontSize: '12px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >
          ← Back
        </button>
        <span
          style={{
            fontFamily: 'var(--deck-f-display)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--deck-ink)',
          }}
        >
          Aprikos<span style={{ color: 'var(--deck-gold)' }}>.</span>{' '}
          <span style={{ color: 'var(--deck-ink-faint)', fontWeight: 300, fontSize: '12px' }}>
            Investor Deck
          </span>
        </span>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '1px solid var(--deck-rule)',
            color: 'var(--deck-ink-faint)',
            fontFamily: 'var(--deck-f-body)',
            fontSize: '10px',
            padding: '6px 12px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}
        >
          Sign Out
        </button>
      </div>

      <iframe
        src="/_iv_e9ffaba54fb6ed1b/index.html"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          background: '#000',
        }}
        title="Aprikos Venture Investor Deck"
        allow="fullscreen"
      />
    </div>
  );
}
