import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DeckWelcome() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    supabase
      .from('investors')
      .select('full_name')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setName(data.full_name.split(' ')[0]);
      });
  }, [user]);

  return (
    <div className="deck-page">
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center"
        style={{
          padding: 'clamp(32px, 5vw, 64px)',
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,147,94,0.06) 0%, transparent 70%), var(--deck-bg-2)',
        }}
      >
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            border: '2px solid var(--deck-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            color: 'var(--deck-gold)',
            fontSize: '36px',
          }}
        >
          ✓
        </div>

        <h2
          className="deck-display"
          style={{ fontSize: 'clamp(40px, 5vw, 56px)', marginBottom: '24px' }}
        >
          Welcome, <em className="deck-italic-gold">{name || 'Investor'}</em>
        </h2>

        <p className="deck-lede" style={{ maxWidth: '540px', marginBottom: '48px', fontSize: '20px' }}>
          Your registration is confirmed. You now have exclusive access to the
          Aprikos Venture investor deck.
        </p>

        <button
          className="deck-btn-primary"
          onClick={() => navigate('/deck/view')}
          style={{ padding: '20px 64px', fontSize: '15px' }}
        >
          View Investor Deck →
        </button>

        <p
          style={{
            marginTop: '32px',
            maxWidth: '460px',
            lineHeight: 1.7,
            fontSize: '14px',
            color: 'var(--deck-ink-faint)',
          }}
        >
          The deck is interactive and always up-to-date.
          <br />
          <span style={{ color: 'var(--deck-gold)' }}>
            Investment access via Anchor S.F.
          </span>{' '}
          will be available soon.
        </p>

        <button
          className="deck-btn-ghost mt-10"
          onClick={signOut}
          style={{ fontSize: '11px', padding: '12px 24px' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
