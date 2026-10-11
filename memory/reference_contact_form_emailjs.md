---
name: reference-contact-form-emailjs
description: Kontaktskjemaet (EmailJS) — hvor nøklene ligger og de to kjente feilårsakene (manglende Netlify-env, utløpt Outlook-grant)
metadata:
  type: reference
---

Kontaktskjemaet på aprikosventure.com sender via EmailJS (`src/components/sections/contact/ContactSection.tsx`).

- **Nøkler:** `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` og `VITE_EMAILJS_PUBLIC_KEY` ligger i Netlify sine miljøvariabler (prosjekt `aprikosventure`), ikke i repoet. `.env` ble fjernet i commit 7836e4e (2026-04-30). Uten variablene bygges kallet som `sendForm(void 0, …)` og skjemaet feiler i stillhet. Variablene leses ved build, så ny deploy kreves etter endring.
- **EmailJS-tjenesten** sender via Outlook (Jamil@aprikosventure.com). Feilen `412 Outlook: Invalid grant` betyr utløpt OAuth: EmailJS-dashboard → Email Services → Disconnect → Connect Account → Update Service. «Connected as …» kan stå selv om tilgangen er død.
- **Rask diagnose:** hent det live bundlet og grep etter `sendForm(` for å se hvilke verdier som er bygget inn. Les så EmailJS-feilteksten i nettleserkonsollen.

Skjemaet var nede fra ca. 2026-04-30 til 2026-10-11 (begge feilene ble fikset 2026-10-11).
