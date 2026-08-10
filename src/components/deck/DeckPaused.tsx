import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/aprikos-venture-logo.svg';

export default function DeckPaused() {
  const navigate = useNavigate();

  return (
    <div className="deck-page">
      <div
        className="deck-mesh-bg min-h-screen flex flex-col items-center justify-center text-center"
        style={{ padding: 'clamp(32px, 5vw, 64px)' }}
      >
        <div className="mb-10">
          <img
            src={logo}
            alt="Aprikos Venture"
            style={{ height: 'clamp(64px, 12vw, 110px)', filter: 'brightness(0) invert(1)' }}
          />
        </div>

        <div className="deck-eyebrow mb-5">Investor Deck</div>

        <h1 className="deck-display mb-5" style={{ fontSize: 'clamp(26px, 5vw, 48px)', maxWidth: '640px' }}>
          Our investor materials are being <em className="deck-italic-gold">updated</em>
        </h1>

        <p className="deck-lede mb-10" style={{ maxWidth: '480px' }}>
          We are refreshing the deck to reflect our current focus. If you have
          registered your interest, we will reach out to you personally as soon
          as the updated materials are ready.
        </p>

        <button
          className="deck-btn-primary"
          onClick={() => navigate('/')}
          style={{ padding: '16px 48px', fontSize: '14px' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
