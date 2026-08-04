import { useState, type FormEvent } from 'react';
import { useBoardMember } from '../../hooks/useBoardMember';
import { checkBoardEmail, sendBoardOtp, verifyBoardOtp } from '../../lib/boardApi';
import BoardDashboard from './BoardDashboard';

type Phase = 'idle' | 'sending' | 'sent';

export default function BoardLanding() {
  const { member, loading } = useBoardMember();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

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

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    try {
      await verifyBoardOtp(email, code);
      // Ingen navigering nødvendig — auth-endringen gjør at useBoardMember
      // henter medlemmet og komponenten rendrer dashboardet selv.
    } catch {
      setError('Feil eller utløpt kode. Prøv igjen, eller be om ny lenke.');
    } finally {
      setVerifying(false);
    }
  };

  const handleRequestNewLink = () => {
    setPhase('idle');
    setCode('');
    setError(null);
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
          <div className="mt-8">
            <p className="deck-lede">
              Innloggingslenke sendt til <span className="deck-italic-gold">{email}</span>.
              Sjekk innboksen din.
            </p>
            <form onSubmit={handleVerifyCode} className="mt-8 flex flex-col gap-4">
              <p className="deck-kicker">
                Virker ikke lenken? Skriv inn den 6-sifrede koden fra e-posten:
              </p>
              <input
                type="text"
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="deck-field"
              />
              <button type="submit" className="deck-btn-primary justify-center" disabled={verifying}>
                {verifying ? 'Verifiserer …' : 'Logg inn med kode'}
              </button>
              {error && <p className="deck-kicker" style={{ color: '#c94a4a' }}>{error}</p>}
            </form>
            <button type="button" onClick={handleRequestNewLink} className="deck-btn-ghost mt-4">
              Send ny lenke
            </button>
          </div>
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
