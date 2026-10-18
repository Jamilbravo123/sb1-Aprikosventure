---
name: project-middag
description: /middag — Mashwara investormiddag 2026-11-05 med personlige invitasjonslenker, svar og e-postvarsel (lansert 2026-10-18)
type: project
---

# /middag: investormiddag 5. november 2026

- Side: `src/pages/Middag.tsx` + `src/styles/middag.css` (alt scopet under `.middag`, Mashwara-merket, mobil først).
  Design godkjent via Artifact-mock 2026-10-18. Logoer i `public/middag/`.
- Personlige lenker: `/middag?g=<token>` (32 hex, 128 bit). Uten gyldig kode vises kun «personlig invitasjon».
- Database (`20261018120000_middag.sql`, kjørt direkte med `supabase db query --linked -f` + `migration repair`,
  fordi lokal og remote migrasjonshistorikk er ute av takt; IKKE bruk `db push`):
  `dinner_guests`, `dinner_rsvps`. Anon har ingen tabellrettigheter; gjester går kun via SECURITY DEFINER-RPC
  `dinner_get_invite` / `dinner_submit_rsvp`. Admin via RLS `is_board_admin()`.
- Varsel: Edge Function `middag-varsel` (kalles fra siden etter lagret svar), Resend, mottaker i secret
  `MIDDAG_VARSEL_TIL`. Dedupe: `notified_at` lagrer svarets `updated_at`; uendret svar gir ingen ny versjon.
- Admin: fanen «middag» i `/styret/admin` — legg til gjest, kopier lenke, status, allergier til cateringen.
- Sikkerhetsgjennomgang (Fable, 2026-10-18): ingen datalekkasje; varselfiksene er lagt inn. Ende-til-ende-test mot prod OK.
- 2026-10-18 kveld: `link_copied_at` lagt til `dinner_guests` (`20261018190000_middag_copied.sql`, kjørt med
  `db query --linked` + `migration repair`). Portalen viser «✓ Kopiert <tid>» permanent. Scroll-knapp på mobil bruker
  `window.scrollTo` med absolutt posisjon (scrollIntoView skjøt forbi på iOS). Kontaktblokk med ikoner på kortet.
