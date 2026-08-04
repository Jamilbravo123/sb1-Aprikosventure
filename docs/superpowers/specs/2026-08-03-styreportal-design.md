# Styreportal — designspesifikasjon

Sist oppdatert: 2026-08-03
Status: Til godkjenning hos Jamil

## Bakgrunn og mål

Det kommende styret i Aprikos Venture AS (Jamil Rehman + fire medlemmer) trenger et innlogget
område på aprikosventure.com der de kan se porteføljen: prosjekter, eierandel per prosjekt,
de tre viktigste milepælene med anslått dato, og protokoller/referater. Forsiden skal raskt
vise hva som er nytt siden sist og hvilke milepæler som kommer.

Designet er godkjent av Jamil 2026-08-03 og arkitektvurdert (Cursor-plan
`styreportal_arkitektur_5b9068a2`), med fire obligatoriske justeringer (A–D under) innbakt her.

**Viktig språkbruk:** Styret er ennå ikke registrert i Brønnøysund. Portalen heter «Styreportal»
og omtaler gruppen som «det kommende styret» — aldri «styret i Aprikos Venture AS» — inntil
registreringen er på plass. Da er det én tekstendring.

## Omfang

**Bygges:** Beskyttet område `/styret` i dette repoet (`sb1-Aprikosventure`), med Supabase-tabeller,
privat Storage-bøtte, magisk lenke-innlogging mot lukket allowlist, og admin-grensesnitt for Jamil.

**Ikke-mål (v1):**
- Ingen endring i `/deck`/investorflyten eller `investors`-tabellen — kun gjenbruk av mønstre.
- Offentlig portefølje (`src/data/ventures.mock.ts`) forblir urørt markedsføringsinnhold.
- Ingen engelsk språkversjon, ingen kommentarer/signering, ingen møtekalender.
- `aprikos-hq`-repoet røres ikke (én linje i beslutningsloggen *etter* lansering, ikke før).

## Arkitektur

- **Stack:** eksisterende — Vite + React 18 + TypeScript + Tailwind, React Router, Supabase
  (prosjekt `uvmthunaitnojimjkhmc`), deploy via Netlify på aprikosventure.com.
- **Mapper:** `src/pages/styret/` (sider) + `src/components/styret/` (komponenter).
- **Stil:** gjenbruk «Editorial Lounge»-stilen fra `src/styles/deck.css`; alle tekster på norsk bokmål.
- **Prosjekt ≠ selskap:** egen `board_projects`-entitet. Et prosjekt kan eksistere før det finnes
  AS/JV — selskapsfelt er valgfrie, og eierandel kan være tom med forklarende notat.

## Datamodell (ny Supabase-migrasjon)

### `board_members`
| Felt | Type | Merknad |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid NULL → `auth.users` | bindes ved første innlogging |
| `email` | text **UNIQUE**, lagres lowercase | |
| `full_name` | text | |
| `role` | text CHECK (`'medlem'`,`'admin'`) | Jamil = `admin` |
| `last_seen_at` | timestamptz NULL | driver «siden sist» |
| `created_at` | timestamptz default now() | |

### `board_projects`
| Felt | Type | Merknad |
|---|---|---|
| `id` | uuid PK | |
| `name` | text NOT NULL | |
| `slug` | text UNIQUE NOT NULL | brukes i URL |
| `description` | text | |
| `ownership_pct` | numeric(5,2) NULL | tom når ikke avklart/stiftet |
| `ownership_note` | text NULL | f.eks. «50/50 JV med NBX», «ikke stiftet ennå» |
| `partners` | text NULL | hvem partnerskapet er med, f.eks. «NBX», «Pharma Nordic» |
| `company_name` | text NULL | kun når selskap finnes |
| `company_orgnr` | text NULL | |
| `sort_order` | int default 0 | |
| `is_archived` | boolean default false | |
| `created_at` / `updated_at` | timestamptz | `updated_at` via trigger |

### `board_milestones`
| Felt | Type | Merknad |
|---|---|---|
| `id` | uuid PK | |
| `project_id` | uuid FK → `board_projects` ON DELETE CASCADE | |
| `title` | text NOT NULL | |
| `target_date` | date NOT NULL | anslått dato |
| `status` | text CHECK (`'planlagt'`,`'pågår'`,`'fullført'`,`'forsinket'`) | |
| `position` | int **CHECK (position BETWEEN 1 AND 3)** | |
| | | **UNIQUE (project_id, position)** — maks tre håndheves i SQL, ikke bare UI |
| `created_at` / `updated_at` | timestamptz | |

### `board_documents`
| Felt | Type | Merknad |
|---|---|---|
| `id` | uuid PK | |
| `project_id` | uuid NULL FK → `board_projects` | tom = selskapsnivå |
| `title` | text NOT NULL | |
| `doc_type` | text CHECK (`'protokoll'`,`'referat'`,`'annet'`) | |
| `meeting_date` | date NULL | |
| `file_path` | text NOT NULL | sti i Storage-bøtten |
| `uploaded_by` | uuid → `auth.users` | |
| `created_at` | timestamptz | |

### Hjelpefunksjoner og RLS

- SQL-funksjoner `is_board_member()` og `is_board_admin()` (`SECURITY DEFINER`, sjekker
  `auth.uid()`/JWT-e-post mot `board_members`) brukes i **alle** policies — én kilde til sannhet.
- Alle fire tabeller: RLS på. SELECT krever `is_board_member()`. INSERT/UPDATE/DELETE krever
  `is_board_admin()`. Unntak: et medlem kan oppdatere **egen** `last_seen_at`/`user_id`.
- RPC `check_board_email(email text) returns boolean` (`SECURITY DEFINER`): returnerer kun ja/nei
  om e-posten finnes i allowlisten. Brukes før OTP sendes (justering C). Lekker aldri listen.
- **Seed:** 5 rader i `board_members`. E-postadressene legges inn direkte i Supabase
  (SQL-editor/dashboard) — **de committes ikke til git**. Migrasjonsfilen inneholder skjema, ikke persondata.

### Storage (justering D)

- Privat bøtte `board-docs`. Policies: les/skriv kun for board-medlem (skriv kun admin).
- Klienten åpner filer via `createSignedUrl` med kort TTL (~5 min), først etter at
  `board_documents`-raden er lesbar under RLS.
- All admin-skriving går via anon-key + brukerens JWT; RLS avgjør. **Aldri service-rolle i frontend.**
- Kun PDF i v1 — andre MIME-typer avvises ved opplasting.

## Innlogging og auth-flyt

1. `/styret` uinnlogget: e-postfelt → kall `check_board_email` → hvis ukjent: nøytral melding
   «Denne e-posten har ikke tilgang». Hvis kjent: `signInWithOtp` med
   `emailRedirectTo: ${origin}/styret/callback`.
2. **Egen callback-rute `/styret/callback`** (justering A). Dagens `AuthCallback.tsx` oppdaterer
   `investors` og navigerer til `/deck` i alle grener — den røres ikke. Styre-callbacken:
   - etablerer sesjon (code exchange / hash-tokens, samme mønstre som eksisterende callback),
   - binder `board_members.user_id` hvis tom,
   - navigerer til `/styret` (forsiden). Aldri `investors`, aldri `/deck`.
3. `BoardProtectedRoute`: innlogget bruker som **ikke** er i `board_members` sendes til `/styret`
   med avvisningsmelding (ikke til `/register`). Samme person kan være både investor og
   styremedlem — RLS skiller dataene, begge portaler fungerer uavhengig.
4. **«Siden sist» (justering B) — les først, oppdater etterpå:** ved sesjonsstart leses
   `last_seen_at` og panelet beregnes fra denne verdien; **deretter** settes `last_seen_at = now()`.
   Motsatt rekkefølge gir alltid tomt panel.

## Sider og flyt

```
/styret (login) → /styret (forside) → /styret/prosjekt/:slug
                                    → /styret/dokumenter
                                    → /styret/admin (kun admin)
```

### Forside `/styret` (v1.2, godkjent via layoutmock 2026-08-04)
Rekkefølge:
1. **KPI-rad** — 4 fliser: Aktive prosjekter, Kommende milepæler (+ neste frist), Milepæler pågår,
   Nytt siden sist (samme datagrunnlag som tidligere «siden sist»-mekanikk, nå som nøkkeltall
   med undertekst «siste besøk …»).
2. **Siste aktivitet** — de 3 nyeste hendelsene globalt (nye prosjekter, oppdaterte milepæler,
   nye dokumenter), sortert på tidsstempel. Tom tilstand: «Ingen aktivitet ennå.»
3. **Prosjektgrid** — kompakte kort: logo/navn, eierandel, partnerlinje, neste milepæl,
   fremdriftsmåler («X av Y fullført · Z pågår»), sist oppdatert-dato. Arkiverte skjult som
   standard; enkel «Vis arkiverte»-lenke i seksjonshodet (ingen filterknapper).
4. **Kommende milepæler** — gruppert på `target_date` (dato som gruppeoverskrift), sortert dato
   stigende og innen samme dato pågår før planlagt/forsinket, deretter prosjektnavn. Første 5
   radene synlige, resten bak «Vis alle (N)»/«Vis færre».

### Prosjektside `/styret/prosjekt/:slug`
De tre milepælene som visuell horisontal stegviser/tidslinje (posisjon 1–3, status-farger,
datoer merket «anslått» når status ≠ `fullført`), eierandel + eierandelsnotat, ev. selskapsinfo,
beskrivelse, prosjektets dokumenter.

### Dokumenter `/styret/dokumenter`
Alle protokoller/referater, filter på type og prosjekt, sortert på møtedato. Åpnes via signert lenke.

### Admin `/styret/admin` (kun `role = 'admin'`)
- CRUD prosjekter (inkl. arkivering, sortering).
- CRUD milepæler (maks 3 per prosjekt — UI viser tre faste plasser).
- Opplasting av dokumenter (kun PDF) + metadata; sletting.
- Medlemsliste: legg til/fjern e-post, sett rolle.

## Feilhåndtering

- Tomtilstander på alle lister («Ingen dokumenter ennå» osv.).
- Laste- og feiltilstander på alle datakall; utløpt magisk lenke → be om ny.
- Signert lenke utløpt ved klikk → hent ny automatisk.

## Verifisering

Repoet har ikke testoppsett. Verifisering før deploy:
1. `npm run build` + `npm run lint` grønne.
2. Manuell gjennomklikking lokalt mot Supabase: innlogging (kjent/ukjent e-post), forside,
   prosjektside, dokumentåpning, admin-CRUD.
3. **RLS-verifisering:** en innlogget investor-bruker (fra `/deck`-flyten) skal få 0 rader fra
   alle `board_*`-tabeller og avvises av `BoardProtectedRoute`.
4. Regresjon: `/deck`- og `/register`-flyten fungerer uendret.

## Blokkere før produksjon

- [ ] E-postadresser for de 5 medlemmene bekreftet av Jamil (leveres utenfor git, seedes rett i Supabase).
- [ ] Migrasjon kjørt i Supabase-prosjekt `uvmthunaitnojimjkhmc` med RLS-verifisering (punkt 3 over).
- [ ] Netlify-redirect/SPA-fallback dekker `/styret/*` (sjekk prerender-oppsettet ikke knekker rutene).

## Prosess

- Implementeringsplan skrives til `docs/superpowers/plans/2026-08-03-styreportal.md`.
- Ingen koding før Jamil eksplisitt sier gå. Ingen commit uten å spørre Jamil.
