---
name: project-portefolje-oktober-2026
description: Porteføljeendringer 2026-10-21 — 4 vertikaler (ny PropTech/TomErik), Mashwara MED + Aprikos Medical i Health Tech, nye lenker (shippingx.io, nayapaisa.pk, kineticfoods.pk), Kinetic uten Venturetoken-kobling
metadata:
  type: project
---

# Porteføljeoppdatering 2026-10-21

- **Fire vertikaler:** Digital Assets · Health Tech · **PropTech** (ny, TomErik/tomerik.com) · Brands.
  «3 Verticals» → 4 i Thesis, /register og PortfolioHeader. Investordecket og aprikos-hq sier fortsatt 3.
  Antall ventures står fortsatt på 9 (ikke endret).
- **Pharmesa beholdes** (Proponent skal lanseres under den) — logo uten firkant, gjort mindre (max-h-11).
- Nayapaisa-kortet: «Digital asset exchange» (uten «Regulated») — kun kortet; strip/index.html/deck bevisst urørt.
- **Mashwara MED** i Health Tech (mashwaramed.com, logo hentet fra nettbutikken). Kode-repoene heter
  `mashwaraBE`/`MashwaraFE`, men finnes ikke på denne maskinen — fakta fra aprikos-hq `portefølje/mashwara-med.md`.
- TomErik-logoen på siden er en lys variant (`tomerik-logo-light.svg`) av `TomErik/brand/tomerik-logo.svg`.
- Porteføljeradene bryter nå (tre kort per rad på desktop) — en rad med flere enn tre kort går til ny linje.

- **Aprikos Medical er tilbake** under Health Tech (lenke aprikosmedical.com). Det reverserer
  oppryddingen 2026-07-21 (`ops/nettside-avvik.md` i aprikos-hq sier fortsatt «fjernet» — må oppdateres der).
- **Nayapaisa lenker til nayapaisa.pk** — eieren valgte bevisst å beholde lenken selv om aprikos-hq
  sier «ingen Pakistan-referanser før NOC» (PVARA). Ikke fjern den på eget initiativ.
- **Kinetic:** nettside kineticfoods.pk, lansering H1 2027, region PK, status Pre-launch.
  «Powered by Venturetoken» og all token-kobling (QR-belønning, «Rails») er fjernet — også i investordecket
  (`public/_iv_e9ffaba54fb6ed1b/index.html`). Ikke gjeninnfør.
- **ShippingX** lenker til shippingx.io.
- JV-partnerlinjen («JV with NBX/Pharma Nordic») er bevisst diskret (logo h-2.5, 50 % opasitet).

Relatert: [[reference-aprikos-hq]], [[project-investor-registration]]

## Tillitsgjennomgang 2026-10-21
- Adresse overalt = **Brreg: Nordalveien 8B, 0580 Oslo** (Jamils valg). Footer: org.nr. 926 056 743 MVA.
- `/privacy` laget (`src/pages/Privacy.tsx`) — var tom side i prod. Lagringstider (24 mnd) er forslag Jamil bør bekrefte.
- Dubai fjernet fra hero og mobilmeny («vi er ikke lenger der»).
- Partnerrad i Thesis: NBX (Nayapaisa · LOI signed), Pharma Nordic (JV · Pharmesa), BMCP GmbH (BaFin · ShippingX, uten lenke — URL ukjent).
- Jamil 2026-10-21: **BaFin-registreringen via BMCP er OK**. JV med NBX er signert internt (Horizon Markets AS registrert 15.10), men **siden sier fortsatt «LOI signed» til NBX har børsmeldt JV-en** (NBX er notert — de må offentliggjøre først). Bytt til JV-tekst + JV-nyhet etter børsmeldingen.
- Nyhetene ble oppdatert i prod 2026-10-21 (4 nye saker, 3 skjult, NBX-tittel rettet til LOI).
- ShippingX første utstedelse: **Q4 2026** (side + deck).
- Kinetic: **ordet «energy» fjernet overalt** (PFA forbyr det). Navn «Kinetic», ny logo `kinetic-logo-white.png` (ikon + «kinetic», laget fra deck-logoen).
- Footer har juridisk disclaimer (ikke investeringsråd/tilbud, kryptorisiko, kun profesjonelle).
- Nyheter ligger i Supabase-tabellen `news` (prod), ikke i koden — endringer der går live umiddelbart.

## Pause-sjekkpunkt 2026-10-21 (alt pushet og live, siste commit `58599b3`)
Åpne punkter:
- **«6 Markets»** står urørt — Jamil sjekker selv hvilke seks markeder (Dubai er ute).
- **NBX-JV:** når NBX har børsmeldt den signerte JV-en → bytt «LOI signed» til JV (kort, stripe, partnerrad, index.html) og legg inn JV-nyhet i `news`-tabellen.
- **Sikkerhet (utenfor nettsiden):** en Django `SECRET_KEY` for marketplaceBE ligger i klartekst i en Slack-DM (Umair, 2026-07-23) — bør roteres.
- aprikos-hq `ops/nettside-avvik.md` er utdatert (sier Aprikos Medical fjernet, 3 vertikaler, Dubai) — ikke oppdatert herfra.
Gjort i økta: se commits `b7223cf`, `53c4d6c`, `4285e03`, `d6b787c`, `58599b3`.

