---
name: project-styreportal
description: Styreportalen på /styret — arkitektur, tilgangsstyring og driftsfakta (lansert 2026-08-04)
type: project
---

# Styreportal (/styret) — lansert 2026-08-04

Innlogget område for det kommende styret. Spec/plan: `docs/superpowers/specs/2026-08-03-styreportal-design.md`
og `docs/superpowers/plans/2026-08-03-styreportal.md` (planen er synket med faktisk kode, inkl. alle review-fikser).

## Arkitektur

- Ruter: `/styret` (login ELLER dashboard), `/styret/callback` (egen — rører ALDRI `investors`/`/deck`),
  `/styret/prosjekt/:slug`, `/styret/dokumenter`, `/styret/admin`. Kode i `src/pages/styret/` + `src/components/styret/`.
- Datalag: `src/lib/boardApi.ts`, typer i `src/types/board.ts`. Tabeller: `board_members`, `board_projects`
  (m/ `partners`, `logo_url`), `board_milestones` (v1.4 2026-08-04: UBEGRENSET antall per prosjekt,
  `is_archived` for historikk — `position`-kolonnen er DROPPET; lagres id-basert upsert), `board_documents`.
- Storage: `board-docs` (privat, kun PDF, signert URL 300 s) og `board-logos` (offentlig, bilder, 2 MB).
  Seed-logoene peker på eksisterende `/social/…`-assets, ikke bøtta.

## Tilgangsstyring (viktig å ikke brekke)

- Reell håndhevelse er RLS + `is_board_member()`/`is_board_admin()` (SECURITY DEFINER) — klientsjekkene er kosmetiske.
- `board_members` har to triggere: `guard_self_update` (medlem kan KUN endre user_id/last_seen_at — stopper
  rolle-eskalering) og `guard_last_admin` (siste admin kan aldri slettes/nedgraderes; advisory-lock mot race).
  NB: triggerne gjelder også service_role — manuelle korrigeringer i SQL-editor kan kreve midlertidig `disable trigger`.
- `check_board_email(text)`: anon-kallbar ja/nei-RPC brukt FØR OTP sendes. Åpent enumerasjonsorakel (akseptert).
- «Siden sist»: `last_seen_at` LESES før `touchLastSeen` — ikke bytt rekkefølge.

## Drift

- Supabase-prosjekt `uvmthunaitnojimjkhmc`. Auth Redirect URLs inkluderer `/styret/callback`-variantene
  (prod, www, localhost:5173) — fjernes de, lander styre-lenker i investorflyten.
- E-postmalen «Magic Link» i Supabase deles av investor- og styreflyten; kan skreddersys med
  `{{ if eq .RedirectTo "https://aprikosventure.com/styret/callback" }}`.
- Medlemmer administreres i `/styret/admin` → Medlemmer (per 2026-08-04: Jamil + Robert Lyngmoe admin;
  Farooq, Abid, Haroon Malik, Vishal medlem). E-postadresser skal ALDRI inn i git — kun i databasen.
- Prosjektdata seedet fra `aprikos-hq/portefølje/` 2026-08-04; vedlikeholdes nå i admin, ikke via SQL.

## v1.2-forside (2026-08-04, godkjent via Artifact-mock før koding)

- Struktur: KPI-rad (auto-beregnet) → «Siste aktivitet» (getRecentActivity, 3 nyeste globalt) → prosjektgrid
  m/ fremdriftsmåler (fullført=kobber, pågår=svak tone, beregnes fra milepælstatus) → dato-grupperte
  milepæler (pågår før planlagt, 5 synlige + «Vis alle»). SinceLastPanel er slettet — «siden sist»-logikken
  lever videre i KPI-flisen «Oppdateringer».
- Forsiden gjør konstant antall spørringer (listAllMilestones — IKKE per prosjekt; ikke gjeninnfør N+1).
- Datoformat: formatShortDate («30. sep. 2026») på forsiden, formatDate (lang) ellers; aktivitetsstrømmen
  bruker bevisst kortform uten år. Kjent minor: date-strenger tolkes som UTC (én dag feil vest for UTC).
- Jamils arbeidsflyt for UI-endringer: mock på Artifact-URL godkjennes FØR koden endres.

## v1.3/v1.4 (2026-08-04)

- Kort: mini-milepælliste (inntil 3 nærmeste AKTIVE) på desktop, kompakt «Neste» på mobil, klikk-affordanse.
- Milepæler: admin har dynamisk liste + Arkiver/Gjenåpne + «Historikk (N)»; prosjektsiden bruker
  MilestoneList (MilestoneStepper er slettet). Alle lesefunksjoner filtrerer `is_archived=false`.
- «Siste aktivitet»: segmentknapper I dag/Uke/3 mnd (default Uke), fast høyde ~3 rader m/ scroll,
  `getActivity(sinceIso)` (getRecentActivity er fjernet).
- Magic Link-e-postmalen i Supabase har Go-template-betingelser på `.RedirectTo` (styret = norsk tekst,
  investor = engelsk) — endret via dashboard 2026-08-04; betingelsene dekker prod/www/localhost-callback.
