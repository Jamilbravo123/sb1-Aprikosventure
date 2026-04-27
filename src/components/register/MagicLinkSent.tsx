import { useState, useEffect } from 'react';

interface MagicLinkSentProps {
  email: string;
  onResend: () => Promise<void>;
}

export default function MagicLinkSent({ email, onResend }: MagicLinkSentProps) {
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    await onResend();
    setResending(false);
    setCooldown(60);
  };

  return (
    <div className="deck-page">
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center"
        style={{ background: 'var(--deck-bg-2)', padding: 'clamp(32px, 5vw, 64px)' }}
      >
        <div style={{ fontSize: '40px', color: 'var(--deck-gold)', marginBottom: '24px' }}>
          ✉
        </div>
        <h2 className="deck-display" style={{ fontSize: '28px', marginBottom: '12px' }}>
          Check your inbox
        </h2>
        <p className="deck-lede" style={{ maxWidth: '420px' }}>
          We've sent a secure sign-in link to
          <br />
          <strong style={{ color: 'var(--deck-gold-light)', fontWeight: 500 }}>
            {email}
          </strong>
        </p>
        <p
          className="mt-4"
          style={{ fontSize: '12px', color: 'var(--deck-ink-faint)' }}
        >
          Click the link in your email to access the investor deck. The link expires in 24 hours.
        </p>
        <button
          className="deck-btn-ghost mt-6"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend link'}
        </button>
      </div>
    </div>
  );
}
