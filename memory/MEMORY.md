# Aprikos Venture - Project Memory

## References
- [Supabase CLI and API access](reference_supabase_access.md) — How to run SQL, manage auth users, and access the Aprikos Venture Club Supabase project
- [Magic link trigger fix](project_magic_link_trigger_fix.md) — Broken auth trigger on auth.users that blocked new user signups (fixed 2026-04-30)
- [Code Entropy restructuring](code_entropy_restructuring.md) — ⚠️ 2026-06-27 PIVOT: venture model DROPPED, focus only on Mashwara, downsize 22→~6–7 (validation phase). Insta Doctor = real-time central feature, fill-rate too thin → employ local doctor(s) to guarantee supply. (Earlier parallel-venture/16-people plan superseded.)
- [Code Entropy dev workflow](code_entropy_dev_workflow.md) — 7-step AI-native workflow, 11 .md templates, 3 gates, "one topic one home" principle. Templates at `docs/templates/`
- [Feedback: no specialist headcount](feedback-no-specialist-headcount.md) — don't propose Flutter/DevOps/QA roles for work AI coding absorbs

## Mashwara AI (Code Entropy's primary project)
- Backend: Django 4.2 + DRF on GCP Cloud Run
- Web: Next.js 15 + React 19 + Tailwind CSS 4
- Mobile: Flutter (User + Doctor apps — Kotlin cut)
- AI: Vertex AI (Gemini 2.5 Flash), Whisper, SentenceTransformers
- GCP project: mashwara-423517
- Repo: /Users/jamilrehman/Repositories/Mashwara app/

## Tech Stack
- React 18 + TypeScript + Vite + Tailwind CSS 3.4 + React Router v7
- Email: EmailJS (contact form)
- Animation: GSAP + @gsap/react (ScrollTrigger, typewriter, counters), Lenis (smooth scroll)
- Icons: lucide-react
- Fonts: Inter (body), Playfair Display (display headings) — both from Google Fonts
- News: Supabase `news` table (project: Aprikos Venture Club, id: uvmthunaitnojimjkhmc)

## Architecture
- Single page: `HomePage` (public only — investor dashboard removed, to be rebuilt later)
- No state management library - React useState only
- Venture data: static mock (`src/data/ventures.mock.ts`), categories (`src/data/portfolio-categories.ts`)
- Smooth scroll: Lenis provider wraps entire app
- No testing framework configured

## Key Directories
- `src/components/sections/` - hero, portfolio, venture-model, thesis, team, news, contact
- `src/components/layout/` - Layout, Navbar, Footer, NavLink, mobile/
- `src/components/providers/` - SmoothScrollProvider (Lenis)
- `src/hooks/` - useNews.ts
- `src/lib/` - supabase.ts, gsap.ts
- `src/constants/` - brand.ts, colors.ts, copy.ts
- `src/data/` - ventures.mock.ts, portfolio-categories.ts

## Design System (Dark + Warm Copper)
- Background: #0c0c0c (near-black), secondary: #141420
- Accent: #C9935E (copper), light: #E8C896 (champagne), dark: #A67A45
- Font classes: `font-display` (Playfair), `font-body` (Inter)
- Tailwind custom colors: `dark-primary`, `dark-secondary`, `dark-elevated`, `gold`, `gold-light`, `gold-dark`

## HomePage Section Order
Hero → Portfolio (horizontal rows with accordion on mobile) → Venture Model (BUILD/INVEST/SCALE timeline) → Thesis (Why Aprikos + stats) → Team → News (editorial feed) → Contact

## Portfolio Structure (3 verticals)
- Digital Assets: Venturetoken, ShippingX, Nayapaisa
- Health Tech: Aprikos Medical, Mashwara AI, Pharmesa
- Industry: November Property, Kinetic Energy
- Code Entropy: shown as "Powered by" strip (not a portfolio venture)

## Data Model (ventures)
- 11 ventures in mock data, 8 shown in portfolio (3 verticals)
- PortfolioCategory: 'digital-assets' | 'health-tech' | 'nordic-legacy'
- VentureKind: venture | platform | hub
- statusText field for custom display (e.g., "Live Beta", "Launching Q1 2026", "Pre-launch")

## Venture Logos (public/social/)
- Venturetoken: venturetoken-3dicon.png
- ShippingX: shippingx-logo3.png
- Nayapaisa: Nayapaisa.png
- Mashwara AI: mashwara_bot.png + mashwara_Artboard2.png (urdu)
- November Property: November-Property-Logo-white.png
- Kinetic Energy: ke-logo.png
- Pharmesa: no logo yet (monogram P)

## Conventions
- User prefers: ask before committing, explain changes
- 2-space indent, single quotes, modern ES modules
- npm (not pnpm)
- User often gets ChatGPT feedback — evaluate critically, only implement what adds value
