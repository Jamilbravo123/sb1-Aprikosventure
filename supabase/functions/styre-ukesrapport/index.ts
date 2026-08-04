// Ukentlig sammendrag til styret — kjøres av pg_cron (mandag 06:00 UTC).
// Sender KUN hvis noe har endret seg siden forrige VELLYKKEDE utsending (board_report_log).
//
// Autorisasjon: plattformens verify_jwt stopper ikke anon-nøkkelen (den ligger åpent i
// frontenden), så vi krever i tillegg enten service_role-JWT eller x-cron-secret-header.
// Hemmeligheter: RESEND_API_KEY og CRON_SECRET er Edge Function secrets; SUPABASE_URL og
// SUPABASE_SERVICE_ROLE_KEY injiseres av plattformen.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const PORTAL_URL = 'https://aprikosventure.com/styret';
const AVSENDER = 'Aprikos Venture <noreply@updates.aprikosventure.com>';
const FALLBACK_DAGER = 7;
const MIN_TIMER_MELLOM_SENDINGER = 20;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

interface Prosjekt { name: string; slug: string }
interface Milepael { title: string; status: string; target_date: string; board_projects: Prosjekt | null }
interface Dokument { title: string; doc_type: string }

function formatDato(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function svar(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

// Kallet må komme fra cron — ikke fra en tilfeldig klient med den offentlige anon-nøkkelen.
function erAutorisert(req: Request): boolean {
  const cronSecret = Deno.env.get('CRON_SECRET');
  if (cronSecret && req.headers.get('x-cron-secret') === cronSecret) return true;

  const auth = req.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const deler = token.split('.');
  if (deler.length !== 3) return false;
  try {
    const padded = deler[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(padded + '='.repeat((4 - padded.length % 4) % 4)));
    return payload.role === 'service_role';
  } catch {
    return false;
  }
}

function seksjon(tittel: string, linjer: string[]): string {
  if (linjer.length === 0) return '';
  return `
    <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9935E; margin: 28px 0 8px;">${esc(tittel)}</p>
    <ul style="margin: 0; padding-left: 18px; color: #b3aa98; font-size: 14px; line-height: 1.7;">
      ${linjer.map((l) => `<li>${l}</li>`).join('')}
    </ul>`;
}

Deno.serve(async (req: Request) => {
  if (!erAutorisert(req)) {
    return svar({ error: 'Ikke autorisert' }, 401);
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    console.error('RESEND_API_KEY mangler');
    return svar({ error: 'Konfigurasjonsfeil' }, 500);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Vindu = siden forrige vellykkede sending (fallback: 7 dager).
  const { data: forrige } = await supabase
    .from('board_report_log')
    .select('sent_at')
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (forrige?.sent_at) {
    const timerSiden = (Date.now() - new Date(forrige.sent_at).getTime()) / 3_600_000;
    if (timerSiden < MIN_TIMER_MELLOM_SENDINGER) {
      return svar({ sendt: false, grunn: 'sendt nylig' }, 200);
    }
  }

  const siden = forrige?.sent_at ?? new Date(Date.now() - FALLBACK_DAGER * 86_400_000).toISOString();

  const [prosjekter, milepaeler, dokumenter, medlemmer] = await Promise.all([
    supabase.from('board_projects').select('name, slug').gte('created_at', siden).eq('is_archived', false),
    supabase.from('board_milestones')
      .select('title, status, target_date, board_projects!inner(name, slug, is_archived)')
      .eq('is_archived', false)
      .eq('board_projects.is_archived', false)
      .gte('updated_at', siden),
    supabase.from('board_documents').select('title, doc_type').gte('created_at', siden),
    supabase.from('board_members').select('email'),
  ]);

  const feil = [prosjekter.error, milepaeler.error, dokumenter.error, medlemmer.error].find(Boolean);
  if (feil) {
    console.error('Databasefeil:', feil.message);
    return svar({ error: 'Kunne ikke hente data' }, 500);
  }

  const nyeProsjekter = (prosjekter.data ?? []) as Prosjekt[];
  const endredeMilepaeler = (milepaeler.data ?? []) as unknown as Milepael[];
  const nyeDokumenter = (dokumenter.data ?? []) as Dokument[];
  const mottakere = (medlemmer.data ?? []).map((m: { email: string }) => m.email);

  const antall = nyeProsjekter.length + endredeMilepaeler.length + nyeDokumenter.length;
  if (antall === 0) return svar({ sendt: false, grunn: 'ingen endringer' }, 200);
  if (mottakere.length === 0) return svar({ sendt: false, grunn: 'ingen mottakere' }, 200);

  const innhold = [
    seksjon('Nye prosjekter', nyeProsjekter.map((p) => `<strong style="color:#f3ece1">${esc(p.name)}</strong>`)),
    seksjon('Milepæler', endredeMilepaeler.map((m) =>
      `<strong style="color:#f3ece1">${esc(m.board_projects?.name ?? '')}</strong> — ${esc(m.title)}
       <span style="color:#9a917f">· ${esc(m.status)} · ${esc(formatDato(m.target_date))}</span>`)),
    seksjon('Nye dokumenter', nyeDokumenter.map((d) => `${esc(d.title)} <span style="color:#9a917f">· ${esc(d.doc_type)}</span>`)),
  ].join('');

  const endringsord = antall === 1 ? 'endring' : 'endringer';
  const html = `
<div style="background-color:#0c0c0c; padding:48px 24px; font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:520px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:32px;">
      <img src="https://aprikosventure.com/social/aprikos-venture-logo-white.png" alt="Aprikos Venture" style="height:40px;" />
    </div>
    <div style="height:1px; background:linear-gradient(90deg,transparent,#C9935E,transparent); margin-bottom:32px;"></div>
    <h1 style="font-family:Georgia,'Times New Roman',serif; font-size:22px; font-weight:500; color:#f3ece1; text-align:center; margin:0 0 8px;">
      Ukens oppdatering
    </h1>
    <p style="font-size:13px; color:#9a917f; text-align:center; margin:0;">
      ${antall} ${endringsord} i porteføljen
    </p>
    ${innhold}
    <div style="text-align:center; margin:36px 0 32px;">
      <a href="${PORTAL_URL}" style="display:inline-block; padding:14px 40px; background-color:#C9935E; color:#0c0c0c; font-size:13px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; text-decoration:none;">
        Åpne styreportalen →
      </a>
    </div>
    <div style="height:1px; background:rgba(243,236,225,0.1); margin-bottom:20px;"></div>
    <p style="font-size:11px; line-height:1.6; color:#555; text-align:center; margin:0;">
      Automatisk ukesoppdatering fra Styreportalen til Aprikos Venture.<br>
      <a href="https://aprikosventure.com" style="color:#C9935E; text-decoration:none;">aprikosventure.com</a>
    </p>
  </div>
</div>`;

  const tekst = [
    `Ukens oppdatering — ${antall} ${endringsord} i porteføljen.`,
    ...nyeProsjekter.map((p) => `Nytt prosjekt: ${p.name}`),
    ...endredeMilepaeler.map((m) => `Milepæl (${m.board_projects?.name ?? ''}): ${m.title} — ${m.status}, ${formatDato(m.target_date)}`),
    ...nyeDokumenter.map((d) => `Nytt dokument: ${d.title} (${d.doc_type})`),
    '',
    `Åpne styreportalen: ${PORTAL_URL}`,
  ].join('\n');

  const resendSvar = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: AVSENDER,
      to: mottakere,
      subject: `Styreportalen — ukens oppdatering (${antall} ${endringsord})`,
      html,
      text: tekst,
    }),
  });

  if (!resendSvar.ok) {
    console.error('Resend-feil:', resendSvar.status, await resendSvar.text());
    return svar({ error: 'Utsending feilet' }, 502);
  }

  // Logg FØRST etter vellykket sending — beskytter mot dubletter ved cron-retry.
  await supabase.from('board_report_log').insert({ endringer: antall, mottakere: mottakere.length });

  return svar({ sendt: true, mottakere: mottakere.length, endringer: antall }, 200);
});
