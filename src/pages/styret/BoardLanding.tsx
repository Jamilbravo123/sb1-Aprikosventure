import { useState, type FormEvent } from 'react';
import { useBoardMember } from '../../hooks/useBoardMember';
import { checkBoardEmail, sendBoardOtp } from '../../lib/boardApi';
import BoardDashboard from './BoardDashboard';

type Phase = 'idle' | 'sending' | 'sent';

export default function BoardLanding() {
  const { member, loading } = useBoardMember();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="deck-page styret-page flex items-center justify-center min-h-screen">
        <div className="deck-kicker">Laster …</div>
      </div>
    );
  }

  if (member) return <BoardDashboard member={member} />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhase('sending');
    try {
      const allowed = await checkBoardEmail(email);
      if (!allowed) {
        setError('Denne e-posten har ikke tilgang.');
        setPhase('idle');
        return;
      }
      const { error: otpError } = await sendBoardOtp(email);
      if (otpError) {
        setError('Kunne ikke sende innloggingslenke. Prøv igjen.');
        setPhase('idle');
        return;
      }
      setPhase('sent');
    } catch {
      setError('Noe gikk galt. Prøv igjen.');
      setPhase('idle');
    }
  };

  return (
    <div className="deck-page styret-page flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md text-center">
        <p className="deck-eyebrow justify-center">Aprikos Venture</p>
        <h1 className="deck-display text-4xl mt-4">
          Styre<span className="deck-italic-gold">portal</span>
        </h1>
        <p className="deck-lede mt-4">For det kommende styret i Aprikos Venture.</p>
        {phase === 'sent' ? (
          <p className="deck-lede mt-8">
            Innloggingslenke sendt til <span className="deck-italic-gold">{email}</span>.
            Sjekk innboksen din.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="deck-field"
              autoComplete="email"
            />
            <button type="submit" className="deck-btn-primary justify-center" disabled={phase === 'sending'}>
              {phase === 'sending' ? 'Sender …' : 'Send innloggingslenke'}
            </button>
            {error && <p className="deck-kicker" style={{ color: '#c94a4a' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
