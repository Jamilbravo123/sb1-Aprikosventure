# Aprikos Venture — Homepage Redesign Spec

## Overview

Redesign the Aprikos Venture homepage from the current dark navy + gold aesthetic to a modern venture studio site with a dark + warm copper palette. The goal is to position Aprikos Venture as a credible, growing venture studio — not a fund, not a startup — that builds and scales companies across two verticals.

**Core message:** "Turning ideas into impactful ventures. We build and scale ventures across AI, digital assets, and emerging markets."

## Design System Changes

### Color Palette — Dark + Warm Copper

| Token | Old Value | New Value | Usage |
|-------|-----------|-----------|-------|
| `dark-primary` | `#0A0E1A` (navy) | `#0c0c0c` (near-black) | Page background |
| `dark-secondary` | `#111827` | `#141420` | Card backgrounds, elevated surfaces |
| `dark-elevated` | `#1E293B` | `#141420` | Elevated surfaces (use Tailwind opacity modifier `bg-dark-elevated/50` for glass) |
| `gold` | `#B8860B` | `#C9935E` (warm copper) | Primary accent |
| `gold-light` | `#D4A84B` | `#E8C896` (champagne) | Hover states, highlighted text |
| `gold-dark` | `#8B6508` | `#A67A45` | Gradient endpoints, pressed states |
| Border subtle | `slate-700/30` | `rgba(100,100,120,0.08)` | Card borders default |
| Border hover | `gold/40` | `rgba(201,147,94,0.2)` | Card borders on hover |
| Text primary | `#F1F5F9` | `#fff` | Headings |
| Text body | `#94A3B8` (slate-400) | `#777` | Body copy |
| Text muted | — | `#555` | Tertiary text, tags |
| Text dim | — | `#444` | Labels, dates |
| Text ghost | — | `#333` | Faintest text |

### Typography — No changes to fonts

- Display: Playfair Display (serif) — `font-display`
- Body: Inter (sans-serif) — `font-body`
- Hero headline: ~56px desktop, Playfair Display 700, letter-spacing -1.5px
- Section headings: 36px, Playfair Display 700
- Overlines: 11px, Inter, letter-spacing 4px, uppercase, copper color
- Body: 15-16px, Inter 400, line-height 1.7

### Where to Update Colors

1. **`tailwind.config.js`** — update `dark.primary`, `dark.secondary`, `dark.elevated`, `gold.DEFAULT`, `gold.light`, `gold.dark` hex values
2. **`src/constants/colors.ts`** — update `darkTheme` and `darkGradients` objects to match new values. Update `statusColors` and `ownershipColors` to use new copper values.
3. **Components** — borders and glass effects use Tailwind arbitrary values since they need rgba with opacity

### Shared Component Patterns

- **Cards:** `bg-dark-secondary/40 border border-white/[0.08] rounded-[14px]`
- **Card hover:** `hover:border-gold/20 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]`
- **Buttons primary:** pill shape (`rounded-full`), gradient `from-gold to-gold-dark`, white text
- **Buttons secondary:** pill shape, `border-gold/25`, copper text
- **Badges:** 9px, pill shape, sector-specific background tints
- **Section dividers:** `bg-gradient-to-r from-transparent via-white/[0.08] to-transparent`

## Page Structure

### Navbar

**Links:** Ventures | About | Team | News | Contact | `[Investor Login]` (pill button)

Changes from current:
- "Portfolio" renamed to "Ventures" — scrolls to `#ventures` anchor (update section ID from `portfolio`)
- Remove "Get Started" button — unclear CTA
- Keep "Investor Login" as sole action button
- Existing mobile menu structure stays — update link labels to match

### Section 1 — Hero

**Type:** Full-height, centered, typography-driven

**Content:**
- Overline: `VENTURE STUDIO · OSLO`
- Headline: `Turning Ideas Into` / `Impactful Ventures` ("Impactful" in italic copper)
- Subtitle: `We build and scale ventures across AI, digital assets, and emerging markets.`
- Word rotation strip: `WE` + `BUILD · INVEST · SCALE` (animated, cycling through words)
- CTAs: `Explore Ventures` (primary) + `Get in Touch` (secondary)
- Scroll indicator at bottom

**Animations (GSAP):**
- Manual text split on headline: wrap each word in a `<span>`, animate with staggered `gsap.from({ opacity: 0, y: 20 }, { stagger: 0.05 })`. Do NOT use GSAP SplitText plugin (paid). Implement a simple `splitWords()` utility.
- Word rotation: cycle through BUILD, INVEST, SCALE with fade/slide transition using `gsap.timeline({ repeat: -1 })`. Each word fades out + slides up, next word slides in from below.
- Overline and subtitle fade in after headline
- CTAs fade in last
- Subtle radial copper gradient glow behind hero (CSS, not animated)

**Removes:** Current hero background mesh gradient, current hero image grid

### Section 2 — Logo Marquee

**Type:** Horizontal infinite scroll strip

**Content:**
- Label above: `Ventures across our ecosystem`
- Logos: Mashwara AI, Venturetoken, BalderX, ShippingX, Aprikos Medical, Nayapaisa, Pharmesa, MKV32 Cultural Care
- Use actual SVG/PNG logos where available, monogram fallback for missing
- Logos displayed at ~40% opacity, full opacity on hover

**Animation:** CSS `@keyframes marquee` (existing pattern), 40s linear infinite

**Note:** BalderX stays in marquee as ecosystem social proof even though it's not in the portfolio split.

### Section 3 — Portfolio (Split + Expand)

**Type:** Two-column split with interactive expand

**Structure:**
```
[Digital Assets]  |copper divider|  [Health Tech]
```

**Left column — Digital Assets:**
- Icon: ◈
- Title: "Digital Assets"
- Description: "Tokenization, digital payments, and blockchain infrastructure."
- Ventures (shown as rows, expand on category click):
  - Venturetoken 🇳🇴 — MiCA-registered utility token — `Live`
  - Nayapaisa 🇵🇰 — Cross-border digital payments — `Building`
  - ShippingX 🇳🇴 — Tokenized maritime assets — `Launching Q1 2026`

**Center — Copper divider:**
- Vertical gradient line (transparent → copper 50% → transparent)
- Centered glowing dot with pulse-ring animation
- Signature design element

**Right column — Health Tech (mirrored alignment):**
- Icon: ✦
- Title: "Health Tech"
- Description: "AI diagnostics, medical devices, and culturally adapted care."
- Ventures:
  - Mashwara AI 🇵🇰 — AI healthcare platform — `Live Beta`
  - Aprikos Medical 🇳🇴 — MDR-certified medical devices — `Live`
  - MKV32 Cultural Care 🇳🇴 — Culturally adapted care — `Building`
  - Pharmesa 🇳🇴 — Pharmaceutical innovation — `Building`

**Each venture row shows:**
- Logo (actual logo if available, monogram fallback with initials)
- Name + country flag
- One-line tagline
- Status badge (colored by status type)

**Interaction:**
- Click category header → ventures expand below with staggered animation (0.1s delay per card)
- Cards slide up + fade in with `cubic-bezier(0.4, 0, 0.2, 1)`
- Venture rows hover: lift -2px, copper border glow, arrow slides right
- Both categories can be open simultaneously

**Below portfolio — Code Entropy strip:**
```
——— Powered by Code Entropy — AI-first studio · Lahore / Oslo ———
```
- Subtle, centered, copper text for "Code Entropy" linking to codentropy.io
- Flanked by thin copper gradient lines
- Communicates execution capability without being a portfolio item

**Data changes:**
- Remove BalderX and Code Entropy from portfolio ventures
- Add Nayapaisa, MKV32 Cultural Care, Pharmesa to ventures data
- Need taglines/details for new ventures from stakeholder

### Section 4 — Venture Model (Timeline)

**Type:** Horizontal 3-step timeline

**Content:**
```
01 BUILD ————— 02 INVEST ————— 03 SCALE
```

- **BUILD:** "We identify opportunities, assemble founding teams, and take ventures from concept to product through our AI-first studio."
- **INVEST:** "We provide capital, technology infrastructure, and strategic support to accelerate growth."
- **SCALE:** "We expand ventures across international markets, leveraging our cross-border network and operational expertise."

**Visual:**
- Horizontal line connecting three dots (copper border, dark fill)
- Step numbers above dots (01, 02, 03)
- Titles in Playfair Display, champagne color
- Descriptions in body text below

**Animation (GSAP ScrollTrigger):**
- Line draws from left to right as user scrolls section into view
- Dots light up sequentially (border glows)
- Step content fades in as line reaches each dot
- `scrub: true` for scroll-linked animation

**New section — does not exist in current codebase. Create from scratch.**

### Section 5 — Thesis / About (with integrated stats + founder image)

**Type:** Centered text block with stats row and founder photo

**Content:**
- Overline: `WHY APRIKOS VENTURE`
- Heading: `Where Innovation Meets Emerging Opportunity`
- Body: "We focus on building companies where technology, capital, and emerging markets intersect — from AI and digital health to blockchain infrastructure and new digital economies. Our cross-border model connects Nordic precision with South Asian scale."
- Founder image: Jamil Rehman portrait, subtly placed (left-aligned or as a background element with low opacity)
- Stats row (integrated, not a separate section):
  - 7 Ventures (count of homepage portfolio ventures only, not dashboard total)
  - 6 Markets
  - 2 Verticals
  - 4+ Years Building

**Animation:** Stats count up with GSAP ScrollTrigger on enter

**Replaces:** Current About section (4 generic value cards) + current Stats section (standalone). Two sections merged into one.

### Section 6 — Team

**Type:** Grid of team member cards

**Content (5 members):**
1. Jamil Rehman — CEO & Founder — one-line bio
2. Sara Rana — Co-founder — one-line bio
3. Robert Lyngmoe — Venture Builder — one-line bio
4. Dr. Farooq Maqsood — Co-founder — one-line bio
5. Vishal Sarna — Partner — one-line bio

**Each card:** Photo, name, role (copper), one-line bio, location, social links (LinkedIn)

**Change from current:** Add one-line bio per person (data exists in `team.data.ts`, just needs shortening to one sentence)

**Layout:** 5-column grid desktop, 2-column tablet, 1-column mobile

### Section 7 — News

**Type:** 3-column card grid

**Data source:** Supabase `news` table (existing `useNews` hook)

**Each card:** Date, title, excerpt, hover lift

**No structural changes** from current implementation — just restyle to copper palette.

### Section 8 — Contact

**Type:** Centered header + contact boxes + existing EmailJS form

**Content:**
- Heading: "Let's Build Together"
- Subtitle: "Whether you're a founder, investor, or potential partner — we'd love to hear from you."
- Contact boxes: Email, Location (Oslo), LinkedIn
- Contact form below (existing EmailJS integration)

**Minor restyle** to copper palette — no functional changes.

### Footer

- Left: `© 2026 Aprikos Venture AS`
- Right: Privacy, LinkedIn, Investor Login
- Minimal, single line

## Sections Removed

- **HeroImageGrid** — replaced by typography-only hero
- **About (value cards)** — replaced by Thesis section with real content
- **Stats (standalone)** — integrated into Thesis section
- **PortfolioGrid/PortfolioCard/PortfolioSection** — replaced by split portfolio

## Sections Added

- **Venture Model (Timeline)** — entirely new component
- **Code Entropy strip** — new sub-component under portfolio

## Data Changes Required

### New ventures to add (`ventures.mock.ts` or `portfolio.ts`):
- **Nayapaisa** — needs: tagline, industry, status, hqCountry, logo
- **MKV32 Cultural Care** — needs: tagline, industry, status, hqCountry, logo
- **Pharmesa** — needs: tagline, industry, status, hqCountry, logo

### Ventures to remove from portfolio display:
- **BalderX** — keep in marquee, remove from portfolio split
- **Code Entropy** — moved to "Powered by" strip, remove from portfolio

### Portfolio categorization (new data structure):

Add a `category` field to the existing `Venture` interface in `src/types/dashboard.ts`:

```typescript
type PortfolioCategory = 'digital-assets' | 'health-tech';
// Add to Venture interface:
category?: PortfolioCategory; // optional — only set for homepage portfolio ventures
```

Create a new file `src/data/portfolio-categories.ts` that exports the two category groups with their venture IDs, header text, icons, and descriptions. This replaces the current `src/data/portfolio.ts`.

### Venture status display:

The current codebase already supports custom status display text via `statusText` overrides (see recent commits). Use this pattern for "Live Beta" (Mashwara) and "Launching Q1 2026" (ShippingX) — the underlying `VentureStatus` enum stays unchanged.

### Monogram fallback for ventures without logos:

When a venture has no logo image, render a 34x40px rounded box with `bg-gold/10 border border-gold/12` containing the venture's 2-letter initials (e.g., "Vt", "Ma") in `text-gold text-[13px] font-bold`.

### Team data updates (`team.data.ts`):
- Add one-line bio field (shorten existing bios to single sentence)

## Animation Inventory (GSAP)

| Element | Trigger | Animation |
|---------|---------|-----------|
| Hero headline | Page load | SplitText word reveal, staggered |
| Hero word rotation | Page load + interval | Fade/slide cycle: BUILD → INVEST → SCALE |
| Hero overline, sub, CTAs | Page load | Fade in sequence after headline |
| Logo marquee | Always | CSS infinite scroll (existing) |
| Portfolio categories | Click | Expand panel, staggered card reveal |
| Portfolio venture rows | Hover | Lift, border glow, arrow slide |
| Venture Model timeline | ScrollTrigger | Line draws left→right, dots light up, text fades in |
| Thesis stats | ScrollTrigger | Counter animation (count up) |
| Team cards | ScrollTrigger | Staggered fade-in |
| News cards | ScrollTrigger | Staggered fade-in |
| All sections | ScrollTrigger | Fade + slight translateY on enter |

## Responsive Behavior

- **Desktop (1024+):** Full layout as described
- **Tablet (768-1023):** Portfolio split stacks vertically (Digital Assets above Health Tech), divider becomes horizontal. Team grid → 2 columns.
- **Mobile (<768):** Single column throughout. Hero headline scales to ~32px. Timeline steps stack vertically. Contact boxes stack.

## What Stays Unchanged

- React 18 + TypeScript + Vite + Tailwind stack
- Supabase auth (magic link PKCE flow)
- Investor Dashboard (separate page, untouched)
- EmailJS contact form integration
- Lenis smooth scroll provider
- React Router routes
- All auth components
- News fetching from Supabase
- Mobile menu structure (just restyle)

## Dependencies

No new packages needed. Existing stack covers everything:
- GSAP + @gsap/react + ScrollTrigger (already installed)
- Lenis (already installed)
- lucide-react (already installed)
- Tailwind CSS (already installed)

## Open Items (Need Stakeholder Input)

- [ ] Nayapaisa: full tagline, status, country, logo
- [ ] MKV32 Cultural Care: full tagline, status, what exactly they do
- [ ] Pharmesa: full tagline, status, logo
- [ ] Confirm BalderX removal from portfolio (keep in marquee only)
- [ ] Founder photo selection for Thesis section (which Jamil portrait?)
- [ ] Team one-line bios — review/approve shortened versions

## Implementation Notes

- Use placeholder taglines for new ventures (Nayapaisa, MKV32, Pharmesa) during initial build. Mark with `// TODO: confirm with stakeholder` comments. The portfolio structure and styling can be built without final copy.
- Team roles: keep current role text from `team.data.ts` (e.g., "Co-founder / Venture Builder") — do not simplify.
- Dashboard constants (`statusColors`, `ownershipColors` in `dashboard.ts`) should be updated to new copper values since they're shared with homepage badge rendering.
- The 5-column team grid works within the 1100px max-width container. At `max-w-[1100px]`, each card is ~200px which is sufficient for photo + name + role.
