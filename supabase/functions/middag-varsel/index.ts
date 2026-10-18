// Varsler verten på e-post når en gjest svarer på invitasjonen til investormiddagen (/middag).
// Kalles fra nettsiden rett etter at svaret er lagret.
//
// Misbruksvern: funksjonen tar KUN imot gjestens lenkekode, slår opp svaret selv med service_role og
// sender bare når svaret er nytt eller endret siden forrige varsel (notified_at). Et nytt kall med
// samme kode gir derfor ingen ny e-post. Mottaker er fast (secret), aldri fra forespørselen.
// Secrets: RESEND_API_KEY, MIDDAG_VARSEL_TIL. SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY injiseres.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const AVSENDER = 'Aprikos Venture <noreply@updates.aprikosventure.com>';
const ADMIN_URL = 'https://aprikosventure.com/styret/admin';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function svar(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return svar({ error: 'Kun POST' }, 405);

  let token = '';
  try {
    token = String((await req.json())?.token ?? '');
  } catch {
    return svar({ error: 'Ugyldig forespørsel' }, 400);
  }
  if (!/^[0-9a-f]{32}$/.test(token)) return svar({ ok: true }, 200);

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const til = Deno.env.get('MIDDAG_VARSEL_TIL');
  if (!resendKey || !til) {
    console.error('RESEND_API_KEY eller MIDDAG_VARSEL_TIL mangler');
    return svar({ error: 'Konfigurasjonsfeil' }, 500);
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { data: gjest } = await supabase.from('dinner_guests')
    .select('id, full_name').eq('token', token).maybeSingle();
  if (!gjest) return svar({ ok: true }, 200);

  const { data: rsvp } = await supabase.from('dinner_rsvps')
    .select('attending, full_name, email, party_size, dietary, updated_at, notified_at')
    .eq('guest_id', gjest.id).maybeSingle();
  if (!rsvp) return svar({ ok: true }, 200);
  if (rsvp.notified_at && new Date(rsvp.notified_at) >= new Date(rsvp.updated_at)) {
    return svar({ ok: true }, 200);
  }

  // Merk versjonen som varslet FØR sending, betinget på at ingen annen forespørsel rakk det først.
  // notified_at lagrer svarets egen updated_at (DB-tid), så sammenligningen er eksakt og klokkeuavhengig.
  const { data: merket } = await supabase.from('dinner_rsvps')
    .update({ notified_at: rsvp.updated_at })
    .eq('guest_id', gjest.id)
    .or(`notified_at.is.null,notified_at.lt."${rsvp.updated_at}"`)
    .select('guest_id');
  if (!merket || merket.length === 0) return svar({ ok: true }, 200);

  const { data: alle } = await supabase.from('dinner_rsvps').select('attending, party_size');
  const kommer = (alle ?? []).filter((r) => r.attending).reduce((n, r) => n + (r.party_size ?? 1), 0);
  const nei = (alle ?? []).filter((r) => !r.attending).length;

  const status = rsvp.attending ? `kommer${rsvp.party_size > 1 ? ` (${rsvp.party_size} personer)` : ''}` : 'kommer ikke';
  const emne = `Middag 5. nov: ${rsvp.full_name.replace(/[\r\n]+/g, ' ')} ${status}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0F2E2E; font-size: 15px; line-height: 1.6;">
      <p><strong>${esc(rsvp.full_name)}</strong> ${esc(status)}.</p>
      <p>E-post: ${esc(rsvp.email)}${rsvp.dietary ? `<br>Allergier/kosthold: ${esc(rsvp.dietary)}` : ''}</p>
      <p>Så langt: ${kommer} kommer, ${nei} har takket nei.</p>
      <p><a href="${ADMIN_URL}" style="color: #008080;">Se alle svar i styreportalen</a></p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: AVSENDER, to: [til], subject: emne, html }),
  });
  if (!res.ok) {
    console.error('Resend feilet', res.status, await res.text());
    await supabase.from('dinner_rsvps').update({ notified_at: null })
      .eq('guest_id', gjest.id).eq('notified_at', rsvp.updated_at);
    return svar({ error: 'Kunne ikke sende varsel' }, 502);
  }

  return svar({ ok: true }, 200);
});
