import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getInvite, submitRsvp } from '../lib/dinnerApi';
import type { DinnerInvite } from '../types/dinner';
import '../styles/middag.css';

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Poppins:wght@300;400;500&display=swap';

type Phase = 'loading' | 'no-invite' | 'choose' | 'form' | 'answered' | 'done';

function useMiddagHead() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Invitasjon · Mashwara investormiddag';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    let link = document.querySelector<HTMLLinkElement>(`link[href="${FONTS_HREF}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONTS_HREF;
      document.head.appendChild(link);
    }
    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);
}

export default function Middag() {
  useMiddagHead();
  const [params] = useSearchParams();
  const token = (params.get('g') ?? '').toLowerCase();

  const [invite, setInvite] = useState<DinnerInvite | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [attending, setAttending] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [dietary, setDietary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const [cardInView, setCardInView] = useState(true);

  // Mobil: når kortet er scrollet ut av syne, vises en svarknapp nederst som tar gjesten tilbake.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([entry]) => setCardInView(entry.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToCompanies = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('middag-co')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const scrollToCard = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cardRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!/^[0-9a-f]{32}$/.test(token)) {
      setPhase('no-invite');
      return;
    }
    getInvite(token)
      .then((inv) => {
        if (!inv) { setPhase('no-invite'); return; }
        setInvite(inv);
        setFullName(inv.full_name ?? '');
        setEmail(inv.email ?? '');
        setPartySize(inv.party_size ?? 1);
        setDietary(inv.dietary ?? '');
        if (inv.attending !== null) setAttending(inv.attending);
        setPhase(inv.attending === null ? 'choose' : 'answered');
      })
      .catch(() => setPhase('no-invite'));
  }, [token]);

  const firstName = (invite?.full_name ?? '').split(' ')[0];

  const openForm = (yes: boolean) => {
    setAttending(yes);
    setError(null);
    setPhase('form');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError('Fyll inn navn og en gyldig e-postadresse.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const ok = await submitRsvp(token, { attending, fullName, email, partySize, dietary });
      if (!ok) throw new Error('rejected');
      setPhase('done');
    } catch {
      setError('Svaret ble ikke lagret. Prøv igjen, eller svar Jamil direkte.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="middag">
      <header className="hero">
        <div className="constellation" aria-hidden="true"><i className="d1" /><i className="d2" /><i className="d3" /></div>
        <div className="wrap hero-grid">
          <article className="card" ref={cardRef}>
            <span className="logo"><img src="/middag/mashwara.svg" alt="Mashwara" /></span>
            <p className="lead-in">{firstName ? `Kjære ${firstName}, du er invitert til investormiddag` : 'Du er invitert til investormiddag'}</p>
            <h1>Vi har bygget.<br />Nå skal vi skalere.</h1>
            <p className="sub">En privat kveld med ledelsen i Mashwara. Vi presenterer neste vekstfase og en emisjon for en lukket krets av investorer.</p>
            <dl className="details">
              <dt>Når</dt><dd>Torsdag 5. november, kl. 18.00</dd>
              <dt>Hvor</dt><dd>Lysaker torg 5<span>Spesialistklinikkenes lokaler</span></dd>
            </dl>

            {phase === 'loading' && <p className="note">Henter invitasjonen …</p>}

            {phase === 'no-invite' && (
              <p className="note">Denne invitasjonen er personlig. Bruk lenken du fikk tilsendt for å svare.</p>
            )}

            {phase === 'choose' && (
              <div className="actions" role="group" aria-label="Svar på invitasjonen">
                <button className="btn primary" type="button" onClick={() => openForm(true)}>Jeg kommer</button>
                <button className="btn ghost" type="button" onClick={() => openForm(false)}>Jeg kan dessverre ikke</button>
              </div>
            )}

            {phase === 'answered' && (
              <>
                <p className="done">
                  {attending
                    ? `Du har takket ja${partySize > 1 ? ' for to personer' : ''}. Vi gleder oss.`
                    : 'Du har takket nei. Takk for at du ga beskjed.'}
                </p>
                <button className="link" type="button" onClick={() => setPhase('choose')}>Endre svaret</button>
              </>
            )}

            {phase === 'form' && (
              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="middag-navn">Navn
                  <input id="middag-navn" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </label>
                <label htmlFor="middag-epost">E-post
                  <input id="middag-epost" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                {attending && (
                  <div className="pair">
                    <label htmlFor="middag-antall">Antall
                      <select id="middag-antall" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </label>
                    <label htmlFor="middag-kosthold">Allergier eller kosthold
                      <input id="middag-kosthold" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="Valgfritt" maxLength={300} />
                    </label>
                  </div>
                )}
                <button className="btn primary" type="submit" disabled={saving}>
                  {saving ? 'Lagrer …' : attending ? 'Bekreft plass' : 'Send svar'}
                </button>
                {error && <p className="err" role="alert">{error}</p>}
              </form>
            )}

            {phase === 'done' && (
              <p className="done" role="status">
                {attending
                  ? `Takk, ${fullName.split(' ')[0]}. Vi gleder oss til å se deg 5. november.`
                  : `Takk for svaret, ${fullName.split(' ')[0]}. Vi sender deg gjerne en oppsummering etterpå.`}
              </p>
            )}

            <p className="deadline">Svar innen fredag 30. oktober. Begrenset antall plasser.</p>
          </article>
          <button className={`cue${scrolled ? ' gone' : ''}`} type="button" onClick={scrollToCompanies} aria-label="Les mer om kvelden">
            <span>Om kvelden</span>
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            <span className="cue-line" aria-hidden="true"><i /></span>
          </button>
        </div>
      </header>

      <section className="companies wrap" aria-labelledby="middag-co">
        <h2 className="section-title" id="middag-co">To integrerte selskaper, ett marked på over 250 millioner</h2>
        <div className="pair-co">
          <article className="co ai">
            <div className="co-mark"><img src="/middag/mashwara-ai.png" alt="Mashwara AI" /></div>
            <div className="co-body">
              <span className="status">Ny versjon 1. november</span>
              <h3>Fra helseapp til personlig helseplattform</h3>
              <p>En ny måte å forstå, organisere og følge opp egen helse på.</p>
              <ul className="badges" aria-label="Sertifisering og tilgjengelighet"><li>ISO/IEC 27001-sertifisert</li><li>På App Store og Google Play</li></ul>
              <div className="partners">
                <span className="lbl">Partnere</span>
                <img src="/middag/partners/efu.png" alt="EFU Life" />
                <img src="/middag/partners/chughtai.png" alt="Chughtai Lab" />
              </div>
            </div>
          </article>
          <div className="link-co" aria-hidden="true">
            <span className="lbl">Anbefalinger</span>
            <span className="line"><i className="fwd" /><i className="back" /></span>
            <span className="lbl">Helsehjelp</span>
          </div>
          <article className="co med">
            <div className="co-mark"><img src="/middag/mashwara-med.png" alt="Mashwara MED" /></div>
            <div className="co-body">
              <span className="status">Ny satsing</span>
              <h3>Fra produsent til pasient</h3>
              <p>B2B-distribusjon av legemidler i Pakistan, med internasjonale partnere og egne merkevarer. Import og nettapotek kommer som neste steg.</p>
              <ul className="badges" aria-label="Lisens"><li>Lisensiert legemiddeldistributør · Punjab, gyldig til 2031</li></ul>
              <div className="partners">
                <span className="lbl">Partnere</span>
                <img className="framed" src="/middag/partners/proponent.png" alt="Proponent Biotech, avtale signert" />
                <img src="/middag/partners/dr-harleys.png" alt="Dr. Harley's" />
                <img src="/middag/partners/herbwiser.png" alt="Herbwiser" />
                <img src="/middag/partners/noorani.webp" alt="Noorani Surgical" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="evening wrap" aria-labelledby="middag-ev">
        <h2 className="section-title" id="middag-ev">Kvelden</h2>
        <ol className="timeline">
          <li><time>18.00</time><b>Velkommen</b><span>Mingling</span></li>
          <li><time>18.30</time><b>Presentasjon</b><span>Mashwara AI og Mashwara MED</span></li>
          <li><time>19.15</time><b>Middag</b><span>Buffet og den gode samtalen</span></li>
        </ol>
      </section>

      {(phase === 'choose' || phase === 'form') && (
        <div className={`rsvp-bar${cardInView ? '' : ' show'}`}>
          <button className="btn" type="button" onClick={scrollToCard}>Svar på invitasjonen</button>
        </div>
      )}

      <footer className="wrap signoff">
        <div className="sig">Jamil Rehman<small>Vert, styreleder i Juni AI AS</small></div>
        <p>Personlig invitasjon</p>
      </footer>
    </div>
  );
}
