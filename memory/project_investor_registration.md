---
name: Investor pre-registration flow
description: Full investor registration wizard + magic link auth + interactive pitch deck viewer — built 2026-04-27/28
type: project
---

## What was built (2026-04-27/28)

Investor pre-registration flow from scratch, replacing all old auth/dashboard/portal code (21 files deleted).

**Routes:**
- `/register` — Landing page with stats (€5M, 5 ventures, 3 verticals, 4+ years), sign-in toggle
- `/register/wizard` — 6-step full-screen wizard
- `/auth/callback` — Magic link handler (PKCE + hash + session retry)
- `/deck` — Welcome page (protected)
- `/deck/view` — Interactive pitch deck in iframe (protected)

**Wizard steps:** Investor Type → Identity (with phone flag dropdown) → Organisation (context-aware placeholder) → Interest (5 verticals: Digital Assets, Health Tech, Brands, AI Studio, All) → Commitment (€100K-250K / €250K-1M / €1M+ / Undisclosed) → Review (with investor confirmation checkbox)

**Auth:** Supabase magic link (OTP). Duplicate emails handled gracefully (23505 → send magic link). AuthProvider wraps entire app in main.tsx.

**Database:** `investors` table in Supabase with RLS. Columns: investor_type, full_name, email (unique), phone, company, country, interests (text[]), commitment, user_id, last_login.

**Pitch deck:** HTML embed via iframe from `public/deck/index.html` (16 slides from Claude Design). Not React components — full HTML with deck-stage.js runtime.

**Design system:** `src/styles/deck.css` with `--deck-*` CSS variables. Editorial Lounge direction: dark bg (#0c0c0c), gold accent (#C9935E), Playfair Display + Inter + Allura + JetBrains Mono.

**Disclaimer:** "For professional and qualified investors only. Minimum commitment €100,000." on all pages + checkbox confirmation on review step.

**Email:** Custom SMTP via Resend → `noreply@updates.aprikosventure.com`. Branded magic link template in Supabase (logo image pending deploy).

**Netlify:** `public/_redirects` for SPA routing.

**Why:** To let investors pre-register interest, get magic link access to the interactive pitch deck, and eventually invest through Anchor S.F. (Luxembourg).

**How to apply:** This is the primary investor-facing flow. All future investor features build on this foundation.

## Fixes applied (2026-04-28)

- **Magic link send failures:** Both registration paths (new + duplicate) now gracefully proceed to "Check your inbox" screen even if OTP send fails. Errors logged to console. User can retry via "Resend link" button. Root cause likely Supabase rate limiting (1 OTP per 60s) or Resend SMTP issue — not yet confirmed.
- **Mobile menu transparency:** MobileMenu rendered via `createPortal(…, document.body)` to escape header's `backdrop-blur` + 90% opacity. Now has solid `#0c0c0c` background.
- **Mobile menu CTA:** Added "Investor Pre-Registration →" link to mobile menu.
- **Register landing responsive:** Logo, headline, stats, lede, margins all use `clamp()` for mobile.
- **Windows dropdown styling:** Added `select.deck-field option` rule with dark bg/light text for native dropdowns on PC.
- **LinkedIn links:** Robert Lyngmoe and Vishal Sarna now have real LinkedIn URLs in team.data.ts.
