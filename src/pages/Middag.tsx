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

  const scrollToEvening = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.getElementById('middag-ev');
    if (!el) return;
    // Absolute document position, not scrollIntoView: on iOS the toolbar collapses during a smooth
    // scrollIntoView, the viewport grows and the page overshoots past the programme.
    const top = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
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
              <dt>Hvor</dt><dd>Lysaker torg 5</dd>
            </dl>

            {phase === 'loading' && <p className="note">Henter invitasjonen …</p>}

            {phase === 'no-invite' && (
              <p className="note">Denne invitasjonen er personlig.</p>
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
            <div className="contact">
              <p>Spørsmål? Ta kontakt med Jamil Rehman.</p>
              <ul>
                <li><a href="tel:+4798691760"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg><span>986 91 760</span></a></li>
                <li><a href="mailto:jamil@aprikosventure.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg><span>jamil@aprikosventure.com</span></a></li>
              </ul>
            </div>
          </article>
          <button className={`cue${scrolled ? ' gone' : ''}`} type="button" onClick={scrollToEvening} aria-label="Se programmet og selskapene">
            <span className="cue-label">Se programmet og selskapene</span>
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            <span className="cue-line" aria-hidden="true"><i /></span>
          </button>
        </div>
      </header>

      <section className="evening wrap" aria-labelledby="middag-ev">
        <h2 className="section-title" id="middag-ev">Kvelden</h2>
        <ol className="timeline">
          <li><time>18.00</time><b>Velkommen</b><span>Mingling</span></li>
          <li><time>18.30</time><b>Presentasjon</b><span>Mashwara AI og Mashwara MED</span></li>
          <li><time>19.15</time><b>Middag</b><span>Buffet og den gode samtalen</span></li>
        </ol>
      </section>

      <section className="companies wrap" aria-labelledby="middag-co">
        <h2 className="section-title" id="middag-co">To integrerte selskaper, ett marked på over 250 millioner</h2>
        <div className="pair-co">
          <article className="co ai">
            <div className="co-mark"><img src="/middag/mashwara-ai.png" alt="Mashwara AI" /></div>
            <div className="co-body">
              <span className="status">Ny versjon 1. november</span>
              <ul className="badges" aria-label="Sertifisering"><li>ISO/IEC 27001-sertifisert</li></ul>
              <h3>Fra helseapp til personlig helseplattform</h3>
              <p>En ny måte å forstå, organisere og følge opp egen helse på.</p>
              <div className="stores">
                <a href="https://apps.apple.com/pk/app/mashwara-ai/id6757075379" target="_blank" rel="noopener noreferrer"><img className="ios" src="/middag/stores/app-store.svg" alt="Last ned fra App Store" /></a>
                <a href="https://play.google.com/store/apps/details?id=com.codentropy.mashwara" target="_blank" rel="noopener noreferrer"><img className="gp" src="/middag/stores/google-play.png" alt="Last ned på Google Play" /></a>
              </div>
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
              <span className="status">I drift</span>
              <ul className="badges" aria-label="Lisens"><li>Lisensiert legemiddeldistributør · Punjab, gyldig til 2031</li></ul>
              <h3>Fra produsent til pasient</h3>
              <p>B2B-distribusjon av legemidler, egen nettbutikk, internasjonale partnerskap og egne merkevarer. Vi har søkt om importlisens og bygger nettapotek med hjemlevering.</p>
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
