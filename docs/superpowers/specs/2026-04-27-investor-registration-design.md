# Investor Pre-Registration Flow

**Date:** 2026-04-27
**Status:** Approved
**Mockups:** `.superpowers/brainstorm/19561-1777291310/content/full-flow.html`

## Overview

A pre-registration flow for investors/stakeholders interested in Aprikos Venture. Users register through a full-screen wizard, receive a magic link via email, and gain access to the interactive pitch deck (16 slides) behind authentication. No investor lounge or dashboard — the deck *is* the product.

## Scope

**In scope:**
- Landing page with investment teaser
- 6-step full-screen registration wizard
- Magic link authentication (Supabase Auth OTP)
- Supabase `investors` table for registration data
- Confirmation/welcome page post-login
- Interactive pitch deck viewer (protected route) — converted from existing HTML prototype
- Delete all existing auth/dashboard/portal code and rebuild from scratch

**Out of scope:**
- Investor dashboard / lounge (future)
- Actual investment flow via Anchor S.F. (future, placeholder CTA only)
- Admin panel for managing registrations
- Email notifications beyond magic link

## Design System

Adopted from the pitch deck (Editorial Lounge direction). Replaces existing Tailwind config where it conflicts.

```
Background:    #0c0c0c (primary), #141420 (secondary)
Text:          #f3ece1 (ink), #9b9382 (dim), #555 (faint)
Accent:        #C9935E (gold), #E8C896 (gold-light), #A67A45 (gold-dark)
Rules:         rgba(243,236,225,0.10)

Fonts:
  Display:     Playfair Display (italic for emphasis)
  Body:        Inter (300/400/500/600)
  Script:      Allura (decorative only)
  Mono:        JetBrains Mono (labels, kickers)

Patterns:
  - Gold progress bars (2px segments)
  - Bordered chips for selections (1px solid rule, gold on select)
  - Corner marks on hero elements
  - Mesh gradient backgrounds (radial, gold tint)
  - Mono uppercase labels (10-12px, 0.15-0.2em letter-spacing)
```

## Routes

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/register` | RegisterLanding | Public | Landing page with teaser + CTA |
| `/register/wizard` | RegisterWizard | Public | 6-step registration wizard |
| `/auth/callback` | AuthCallback | Public | Handles magic link redirect |
| `/deck` | DeckWelcome | Protected | Welcome page post-login |
| `/deck/view` | DeckViewer | Protected | Interactive pitch deck (16 slides) |

Existing homepage (`/`) remains unchanged.

## User Flow

```
Landing (/register)
  └─ "Pre-Register Now" CTA
      └─ Wizard Step 1: Investor Type (4 chips)
          └─ Step 2: Identity (name, email, phone)
              └─ Step 3: Organisation (company, country)
                  └─ Step 4: Interest (4 chips, multi-select)
                      └─ Step 5: Commitment (4 chips)
                          └─ Step 6: Review (summary table)
                              └─ Submit → Supabase insert + magic link sent
                                  └─ "Check your inbox" screen
                                      └─ Click magic link → /auth/callback
                                          └─ /deck (welcome + "View Deck" CTA)
                                              └─ /deck/view (interactive 16-slide deck)
```

**Returning users:** Landing page has "Already registered? Sign in with magic link" link that shows an inline email input on the landing page itself (no separate route). Submit → magic link → `/auth/callback` → `/deck`.

## Components

### 1. RegisterLanding

Full-screen landing page matching pitch deck cover aesthetic.

- Aprikos logo (Playfair italic wordmark)
- Eyebrow: "Investor Pre-Registration"
- Headline: "Early access to a *cross-border* venture platform"
- Lede paragraph (1-2 sentences about the opportunity)
- Stats row: €5M raise · 5 Active Ventures · 3 Verticals · 4+ Years Building
- Primary CTA: "Pre-Register Now →" (gold button)
- Secondary: "Already registered? Sign in with magic link"
- Mesh gradient background

### 2. RegisterWizard

Full-screen, one-question-per-step wizard. 6 steps.

**Shared chrome:**
- Progress bar (6 segments, 2px, gold fill)
- Step label (mono, uppercase, e.g., "STEP 1 · INVESTOR TYPE")
- Question headline (Playfair Display, 32px, gold italic for emphasis word)
- Navigation: Back button (ghost) + Continue button (gold) + keyboard hint (Enter)
- Smooth transition between steps (fade or slide)

**Step 1 — Investor Type:**
- Question: "What best describes *you?*"
- 4 chips in 2x2 grid: Private Investor · Institutional · Family Office · Fund / LP
- Single select (required)

**Step 2 — Identity:**
- Question: "Let's get *acquainted*"
- 3 fields: Full name (required) · Email (required) · Phone with country code (required)
- Inline validation (email format, phone format)

**Step 3 — Organisation:**
- Question: "Where are you *based?*"
- 2 fields: Company/Organisation (optional) · Country (dropdown with flags, required)

**Step 4 — Interest:**
- Question: "Which verticals *interest* you?"
- 4 chips in 4-column grid: Digital Assets · Healthcare · AI & Studio · All Verticals
- Multi-select allowed. "All Verticals" deselects others and vice versa.

**Step 5 — Commitment:**
- Question: "Anticipated *commitment?*"
- 4 chips: €100K–250K · €250K–1M · €1M+ · Undisclosed
- Single select (required)

**Step 6 — Review:**
- Question: "Everything *correct?*"
- Mono-styled summary table showing all entered data
- Each row is clickable to jump back to that step
- Submit button: "Submit Registration →"

**State management:** React useState, wizard state held in parent component. No external state library.

### 3. MagicLinkSent

Centered confirmation screen after wizard submission.

- Mail icon
- "Check your inbox"
- Email address highlighted in gold
- "Link expires in 24 hours" note
- Resend link option (with cooldown timer)

### 4. AuthCallback

Handles Supabase magic link redirect.

- Shows loading spinner while verifying
- On success: redirect to `/deck`
- On failure: redirect to `/register` with error message
- Max 3 retry attempts before giving up

### 5. DeckWelcome

Welcome/confirmation screen after first login.

- Checkmark icon (gold circle)
- "Welcome, *{name}*" headline
- Confirmation message
- "View Investor Deck →" CTA (gold button)
- Note about Anchor S.F. investment access coming soon
- Shows on every login (simple, serves as a lobby)

### 6. DeckViewer

The interactive pitch deck — 16 slides rendered as full-screen React components.

- Source: Convert `/tmp/aprikos-venture-pitch-deck/project/Aprikos Venture Pitch Deck.html` to React
- Full-screen slide navigation (arrow keys, swipe, click)
- Slide counter (N / 16) in footer
- Same CSS variables, fonts, and layout as the HTML prototype
- Assets (logos, images) copied to `public/deck/`
- Each slide is a React component for maintainability

**Slide structure (from pitch deck):**
1. Cover
2. Founder Letter
3. Thesis
4. Why Pakistan
5. Build / Invest / Scale
6. Portfolio
7. Mashwara AI
8. Kinetic Energy
9. NDAP
10. Code Entropy
11. Milestones
12. Team
13. Why Now
14. The Ask
15. Use of Proceeds
16. Thank You

## Data Model

### Supabase `investors` table

```sql
CREATE TABLE investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  investor_type TEXT NOT NULL CHECK (investor_type IN ('private', 'institutional', 'family_office', 'fund')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  company TEXT,
  country TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  commitment TEXT NOT NULL CHECK (commitment IN ('100k-250k', '250k-1m', '1m_plus', 'undisclosed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- RLS: users can only read their own row
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON investors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anon can insert during registration"
  ON investors FOR INSERT
  WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email'
              OR auth.role() = 'anon');
```

### Registration + Auth Flow (technical)

1. User fills wizard → clicks Submit
2. Frontend calls Supabase `auth.signInWithOtp({ email })` to trigger magic link
3. Frontend inserts registration data into `investors` table (via service call or edge function)
4. User receives magic link email
5. User clicks link → redirected to `/auth/callback`
6. AuthCallback exchanges token → session established
7. Frontend updates `investors.user_id` with the authenticated user's ID and `last_login`
8. Redirect to `/deck`

**Returning users:** Email input → `auth.signInWithOtp({ email })` → magic link → `/auth/callback` → `/deck`. No wizard.

## File Structure (new/modified)

```
src/
  components/
    auth/                          # DELETE existing, rebuild
      AuthCallback.tsx             # Magic link handler
      ProtectedRoute.tsx           # Route guard
    register/                      # NEW
      RegisterLanding.tsx          # Landing page
      RegisterWizard.tsx           # Wizard container + state
      steps/
        InvestorTypeStep.tsx       # Step 1
        IdentityStep.tsx           # Step 2
        OrganisationStep.tsx       # Step 3
        InterestStep.tsx           # Step 4
        CommitmentStep.tsx         # Step 5
        ReviewStep.tsx             # Step 6
      MagicLinkSent.tsx            # Post-submit confirmation
    deck/                          # NEW
      DeckWelcome.tsx              # Welcome/lobby
      DeckViewer.tsx               # Slide navigator
      slides/                     # One component per slide
        CoverSlide.tsx
        FounderSlide.tsx
        ThesisSlide.tsx
        ... (16 total)
      DeckChrome.tsx               # Header/footer/nav overlay
  contexts/
    AuthContext.tsx                 # DELETE existing, rebuild (simpler)
  pages/                           # DELETE InvestorDashboard.tsx
  styles/
    deck.css                       # Pitch deck CSS variables + shared styles

DELETE entirely:
  src/components/auth/MagicLinkLogin.tsx
  src/components/dashboard/        # All 9 files
  src/components/portal/           # InvestorPortalPopup, OwnerRegistrationPopup
  src/components/common/UserMenu.tsx
  src/components/common/InvestorButton.tsx
  src/pages/InvestorDashboard.tsx
  src/constants/copy.ts            # Investor club copy (outdated)
  src/types/dashboard.ts
```

## Error Handling

- **Wizard validation:** Inline per-step. Cannot advance without required fields. Email format + phone format validated client-side.
- **Duplicate email:** If email already exists in `investors`, show "You're already registered" with sign-in link instead of error.
- **Magic link expired:** AuthCallback shows "Link expired" with option to request a new one.
- **Network errors:** Toast notification with retry option. Wizard state preserved in memory.

## Mobile

- Full-screen steps work identically on mobile
- Chips stack to 2x2 or 1-column on narrow screens
- Touch swipe for deck navigation
- No split-screen or side panels
