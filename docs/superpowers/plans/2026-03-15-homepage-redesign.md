# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Aprikos Venture homepage from dark navy + gold to dark + warm copper, restructure sections, add split portfolio and venture model timeline.

**Architecture:** Update design tokens first, then rebuild sections bottom-up (data → components → page assembly). Each task produces a working component that can be verified in isolation. No new dependencies needed.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3.4, GSAP + ScrollTrigger, Vite

**Spec:** `docs/superpowers/specs/2026-03-15-homepage-redesign-design.md`

---

## File Structure

### Files to Create
- `src/data/portfolio-categories.ts` — category definitions + venture groupings
- `src/components/sections/portfolio/PortfolioSplit.tsx` — split container with divider
- `src/components/sections/portfolio/CategoryColumn.tsx` — single category with expandable ventures
- `src/components/sections/portfolio/VentureRow.tsx` — individual venture row item
- `src/components/sections/portfolio/CopperDivider.tsx` — animated vertical divider
- `src/components/sections/portfolio/CodeEntropyStrip.tsx` — "Powered by" strip
- `src/components/sections/venture-model/VentureModel.tsx` — timeline section
- `src/components/sections/venture-model/TimelineStep.tsx` — individual step
- `src/components/sections/venture-model/venture-model.data.ts` — step data
- `src/components/sections/thesis/Thesis.tsx` — thesis/about replacement
- `src/utils/splitWords.ts` — manual word-split utility for hero animation

### Files to Modify
- `tailwind.config.js` — update color tokens
- `src/constants/colors.ts` — update darkTheme, darkGradients, all color values
- `src/index.css` — update hero mesh gradient, global styles to copper palette
- `src/types/dashboard.ts` — add `PortfolioCategory` type, `category` field, update color maps
- `src/data/ventures.mock.ts` — add 3 new ventures, update categories
- `src/data/portfolio.ts` — replace with portfolio-categories import (or delete)
- `src/components/sections/hero/HeroHeading.tsx` — new headline + word rotation
- `src/components/sections/hero/HeroContent.tsx` — new subtitle, CTAs, overline
- `src/components/sections/hero/HeroBackground.tsx` — update to copper gradient
- `src/components/sections/hero/Hero.tsx` — minor animation adjustments
- `src/components/sections/portfolio/Portfolio.tsx` — replace BentoGrid with PortfolioSplit
- `src/components/sections/portfolio/PortfolioHeader.tsx` — update text
- `src/components/sections/marquee/LogoMarquee.tsx` — update to include new ventures
- `src/components/sections/team/team.data.ts` — add one-line bios
- `src/components/sections/team/TeamMemberCard.tsx` — show one-line bio, restyle
- `src/components/sections/team/TeamHeader.tsx` — update text
- `src/components/sections/team/TeamGrid.tsx` — 5-column layout
- `src/components/sections/news/News.tsx` — restyle to copper
- `src/components/sections/news/NewsCard.tsx` — restyle to copper
- `src/components/sections/news/NewsHeader.tsx` — update text
- `src/components/sections/contact/ContactSection.tsx` — restyle to copper
- `src/components/sections/contact/ContactHeader.tsx` — update text
- `src/components/sections/contact/ContactInfo.tsx` — restyle
- `src/components/sections/contact/ContactForm.tsx` — restyle
- `src/components/layout/Navbar.tsx` — rename Portfolio→Ventures, remove Get Started
- `src/components/layout/Footer.tsx` — simplify, restyle
- `src/pages/HomePage.tsx` — new section order, add VentureModel + Thesis, remove About + Stats

### Files to Delete (or leave unused)
- `src/components/sections/about/About.tsx` — replaced by Thesis
- `src/components/sections/stats/Stats.tsx` — integrated into Thesis
- `src/components/sections/portfolio/BentoGrid.tsx` — replaced by PortfolioSplit
- `src/components/sections/portfolio/BentoCard.tsx` — replaced by VentureRow

---

## Chunk 1: Design System + Data Layer

### Task 1: Update Tailwind color tokens

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Update color values in tailwind.config.js**

Replace the `colors` extend block:

```js
'dark-primary': '#0c0c0c',
'dark-secondary': '#141420',
'dark-elevated': '#141420',
gold: {
  DEFAULT: '#C9935E',
  light: '#E8C896',
  dark: '#A67A45',
},
```

- [ ] **Step 2: Verify Vite dev server still starts**

Run: `npm run dev`
Expected: No build errors, site loads (colors will look different but functional)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "refactor: update Tailwind color tokens to copper palette"
```

---

### Task 2: Update color constants

**Files:**
- Modify: `src/constants/colors.ts`

- [ ] **Step 1: Update darkTheme object**

```typescript
export const darkTheme = {
  primary: '#0c0c0c',
  secondary: '#141420',
  elevated: '#141420',
  text: {
    primary: '#ffffff',
    secondary: '#bbbbbb',
    muted: '#777777',
    dim: '#555555',
    ghost: '#333333',
  },
  glass: {
    background: 'rgba(20, 20, 32, 0.4)',
    border: 'rgba(100, 100, 120, 0.08)',
    borderHover: 'rgba(201, 147, 94, 0.2)',
  },
  gold: {
    primary: '#C9935E',
    light: '#E8C896',
    dark: '#A67A45',
  },
};
```

- [ ] **Step 2: Update darkGradients**

```typescript
export const darkGradients = {
  hero: 'bg-gradient-to-br from-[#0c0c0c] via-[#141420] to-[#0c0c0c]',
  goldText: 'bg-gradient-to-r from-[#C9935E] via-[#E8C896] to-[#C9935E]',
  goldLine: 'bg-gradient-to-r from-transparent via-[rgba(201,147,94,0.4)] to-transparent',
  section: 'bg-gradient-to-b from-[#0c0c0c] to-[#141420]',
};
```

- [ ] **Step 3: Update the colors object and gradients at the top of the file to use copper values**

Update primary, secondary, accent colors to match new palette. Update `gradientCSS` strings.

- [ ] **Step 4: Commit**

```bash
git add src/constants/colors.ts
git commit -m "refactor: update color constants to copper palette"
```

---

### Task 3: Update dashboard types and color maps

**Files:**
- Modify: `src/types/dashboard.ts`

- [ ] **Step 1: Add PortfolioCategory type**

Add after the existing type declarations:

```typescript
export type PortfolioCategory = 'digital-assets' | 'health-tech';
```

- [ ] **Step 2: Add optional fields to Venture interface**

Add to the Venture interface:

```typescript
category?: PortfolioCategory;
statusText?: string; // Custom display text override for status badge (e.g., "Live Beta", "Launching Q1 2026")
```

- [ ] **Step 3: Update statusColors, industryColors, ownershipColors to copper values**

Replace gold `#B8860B` → `#C9935E` and `#D4A84B` → `#E8C896` throughout all color maps.

- [ ] **Step 4: Commit**

```bash
git add src/types/dashboard.ts
git commit -m "refactor: add PortfolioCategory type and update color maps to copper"
```

---

### Task 4: Add new ventures and portfolio categories

**Files:**
- Modify: `src/data/ventures.mock.ts`
- Create: `src/data/portfolio-categories.ts`

- [ ] **Step 1: Add statusText to existing ventures that need custom display**

On the Mashwara AI venture object, add: `statusText: 'Live Beta'`
On the ShippingX venture object, add: `statusText: 'Launching Q1 2026'`

- [ ] **Step 2: Add 3 new ventures to ventures.mock.ts**

Add after the existing ventures in the `ventures` array:

```typescript
{
  id: 'nayapaisa',
  name: 'Nayapaisa',
  tagline: 'Cross-border digital payment infrastructure', // TODO: confirm with stakeholder
  kind: 'venture' as VentureKind,
  industry: 'fintech' as Industry,
  hqCountry: 'PK' as Country,
  markets: ['PK', 'NO'] as Market[],
  status: 'building' as VentureStatus,
  ownershipType: 'core' as OwnershipType,
  aprikosRole: 'Venture Builder',
  logo: '', // TODO: add logo
  links: [],
  details: { highlights: ['Cross-border payments', 'Nordic-South Asian corridor'] },
},
{
  id: 'mkv32-cultural-care',
  name: 'MKV32 Cultural Care',
  tagline: 'Culturally adapted healthcare solutions', // TODO: confirm with stakeholder
  kind: 'venture' as VentureKind,
  industry: 'healthtech' as Industry,
  hqCountry: 'NO' as Country,
  markets: ['NO', 'NORDICS'] as Market[],
  status: 'building' as VentureStatus,
  ownershipType: 'core' as OwnershipType,
  aprikosRole: 'Venture Builder',
  logo: '',
  links: [],
  details: { highlights: ['Cultural care', 'Nordic healthcare'] },
},
{
  id: 'pharmesa',
  name: 'Pharmesa',
  tagline: 'Pharmaceutical innovation platform', // TODO: confirm with stakeholder
  kind: 'venture' as VentureKind,
  industry: 'medtech' as Industry,
  hqCountry: 'NO' as Country,
  markets: ['NO', 'EU'] as Market[],
  status: 'building' as VentureStatus,
  ownershipType: 'core' as OwnershipType,
  aprikosRole: 'Venture Builder',
  logo: '',
  links: [],
  details: { highlights: ['Pharma innovation', 'European markets'] },
},
```

- [ ] **Step 3: Create portfolio-categories.ts**

```typescript
import { ventures } from './ventures.mock';
import type { PortfolioCategory } from '../types/dashboard';

export interface CategoryConfig {
  id: PortfolioCategory;
  title: string;
  icon: string;
  description: string;
  ventureIds: string[];
}

export const portfolioCategories: CategoryConfig[] = [
  {
    id: 'digital-assets',
    title: 'Digital Assets',
    icon: '◈',
    description: 'Tokenization, digital payments, and blockchain infrastructure.',
    ventureIds: ['venturetoken', 'nayapaisa', 'shippingx'],
  },
  {
    id: 'health-tech',
    title: 'Health Tech',
    icon: '✦',
    description: 'AI diagnostics, medical devices, and culturally adapted care.',
    ventureIds: ['mashwara-ai', 'aprikos-medical', 'mkv32-cultural-care', 'pharmesa'],
  },
];

export function getVenturesForCategory(categoryId: PortfolioCategory) {
  const category = portfolioCategories.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.ventureIds
    .map((id) => ventures.find((v) => v.id === id))
    .filter(Boolean);
}
```

- [ ] **Step 4: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing ones)

- [ ] **Step 5: Commit**

```bash
git add src/data/ventures.mock.ts src/data/portfolio-categories.ts
git commit -m "feat: add new ventures and portfolio category data"
```

---

### Task 5: Update global CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Update hero mesh gradient colors**

Find the `.hero-mesh-gradient` class and replace all navy/blue color values with copper equivalents:
- `#0A0E1A` → `#0c0c0c`
- `#B8860B` → `#C9935E`
- `#D4A84B` → `#E8C896`
- `rgba(184, 134, 11,` → `rgba(201, 147, 94,`

- [ ] **Step 2: Update any other hardcoded old palette colors in index.css**

Search for `#0A0E1A`, `#111827`, `#1E293B`, `#B8860B`, `#D4A84B` and replace with new values.

- [ ] **Step 3: Verify dev server shows updated styles**

Run: `npm run dev`
Expected: Background is near-black (#0c0c0c), any visible gold accents are now warmer copper

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "refactor: update global CSS to copper palette"
```

---

## Chunk 2: Hero Section Rebuild

### Task 6: Create word-split utility

**Files:**
- Create: `src/utils/splitWords.ts`

- [ ] **Step 1: Write the utility**

```typescript
/**
 * Wraps each word in a span for GSAP animation.
 * Returns an array of React elements.
 */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/splitWords.ts
git commit -m "feat: add splitWords utility for hero animation"
```

---

### Task 7: Rewrite HeroBackground

**Files:**
- Modify: `src/components/sections/hero/HeroBackground.tsx`

- [ ] **Step 1: Replace the background with copper gradient**

Replace the entire component with a simplified copper gradient background. Remove the floating orbs and noise texture. Use a subtle radial gradient glow:

```tsx
import { useRef } from 'react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#141420] to-[#0c0c0c]" />
      {/* Subtle copper radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,147,94,0.04) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify hero background renders correctly**

Run: `npm run dev`, navigate to homepage
Expected: Dark background with very subtle copper glow at top center

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/hero/HeroBackground.tsx
git commit -m "refactor: simplify hero background to copper gradient"
```

---

### Task 8: Rewrite HeroHeading with word rotation

**Files:**
- Modify: `src/components/sections/hero/HeroHeading.tsx`

- [ ] **Step 1: Rewrite with new headline and word rotation**

Replace the entire component:

```tsx
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import { splitWords } from '../../../utils/splitWords';

const ROTATION_WORDS = ['BUILD', 'INVEST', 'SCALE'];

export default function HeroHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wordIndexRef = useRef(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Staggered word reveal on headline
    const words = containerRef.current.querySelectorAll('.hero-word');
    gsap.from(words, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  // Word rotation effect
  useEffect(() => {
    if (!wordRef.current) return;
    const el = wordRef.current;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    ROTATION_WORDS.forEach((word, i) => {
      if (i > 0) {
        tl.to(el, {
          y: -10,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => { el.textContent = word; },
        });
        tl.fromTo(el,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        );
      }
      tl.to({}, { duration: 2 }); // Hold for 2 seconds
    });

    return () => { tl.kill(); };
  }, []);

  const line1Words = splitWords('Turning Ideas Into');
  const line2Word = 'Impactful';
  const line2Rest = 'Ventures';

  return (
    <div ref={containerRef} className="text-center">
      <div className="font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-white">
        {line1Words.map((word, i) => (
          <span key={i} className="hero-word inline-block mr-[0.3em]">{word}</span>
        ))}
        <br />
        <span className="hero-word inline-block mr-[0.3em] text-gold italic">{line2Word}</span>
        <span className="hero-word inline-block">{line2Rest}</span>
      </div>

      {/* Word rotation strip */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <span className="text-[#444] text-xs tracking-[3px] uppercase">WE</span>
        <div className="bg-gold/[0.06] border border-gold/[0.12] rounded-lg px-5 py-2">
          <span
            ref={wordRef}
            className="text-gold-light text-sm font-semibold tracking-wider"
          >
            {ROTATION_WORDS[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify headline renders with animation**

Run: `npm run dev`
Expected: "Turning Ideas Into / Impactful Ventures" with staggered word reveal, word rotation cycling BUILD → INVEST → SCALE

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/hero/HeroHeading.tsx
git commit -m "feat: rewrite hero heading with copper accent and word rotation"
```

---

### Task 9: Rewrite HeroContent

**Files:**
- Modify: `src/components/sections/hero/HeroContent.tsx`

- [ ] **Step 1: Replace with new overline, subtitle, and CTAs**

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import HeroHeading from './HeroHeading';

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Fade in overline, subtitle, CTAs sequentially after headline
    gsap.from('.hero-fade', {
      y: 15,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.8, // after headline word reveal finishes
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Overline */}
      <p className="hero-fade text-gold text-[11px] tracking-[5px] uppercase mb-6">
        Venture Studio · Oslo
      </p>

      <HeroHeading />

      {/* Subtitle */}
      <p className="hero-fade text-[#777] text-base leading-relaxed max-w-[520px] mt-5">
        We build and scale ventures across AI, digital assets, and emerging markets.
      </p>

      {/* CTAs */}
      <div className="hero-fade flex gap-3.5 mt-10">
        <a
          href="#ventures"
          className="px-7 py-3 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white text-sm font-medium hover:shadow-[0_8px_24px_rgba(201,147,94,0.25)] hover:-translate-y-0.5 transition-all"
        >
          Explore Ventures
        </a>
        <a
          href="#contact"
          className="px-7 py-3 rounded-full border border-gold/25 text-gold text-sm font-medium hover:bg-gold/[0.08] transition-all"
        >
          Get in Touch
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="hero-fade absolute bottom-10 flex flex-col items-center gap-2">
        <span className="text-[#333] text-[10px] tracking-[3px] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify full hero section**

Run: `npm run dev`
Expected: Complete hero with overline, heading, subtitle, CTAs, scroll indicator. Clean copper aesthetic.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/hero/HeroContent.tsx
git commit -m "feat: rewrite hero content with copper CTAs and scroll indicator"
```

---

## Chunk 3: Portfolio Section Rebuild

### Task 10: Create VentureRow component

**Files:**
- Create: `src/components/sections/portfolio/VentureRow.tsx`

- [ ] **Step 1: Write VentureRow component**

```tsx
import type { Venture } from '../../../types/dashboard';
import { countryFlags, industryLabels, statusLabels } from '../../../types/dashboard';
import { ExternalLink } from 'lucide-react';

interface VentureRowProps {
  venture: Venture;
  mirrored?: boolean;
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

export default function VentureRow({ venture, mirrored = false }: VentureRowProps) {
  const flag = countryFlags[venture.hqCountry] || '';
  const statusText = venture.statusText || statusLabels[venture.status];
  const industryText = industryLabels[venture.industry];

  const handleClick = () => {
    const websiteLink = venture.links?.find((l) => l.type === 'website');
    if (websiteLink) window.open(websiteLink.url, '_blank', 'noopener');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      className={`
        group flex items-center gap-3 p-3.5 rounded-xl cursor-pointer
        bg-dark-secondary/40 border border-white/[0.08]
        hover:border-gold/20 hover:-translate-y-0.5
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)]
        transition-all duration-300
        ${mirrored ? 'flex-row-reverse text-right' : ''}
      `}
    >
      {/* Logo or monogram */}
      <div className="w-[34px] h-[40px] rounded-lg bg-gold/10 border border-gold/[0.12] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {venture.logo ? (
          <img
            src={venture.logo}
            alt={venture.name}
            className="w-full h-full object-contain p-1.5"
          />
        ) : (
          <span className="text-gold text-[11px] font-bold">{getInitials(venture.name)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-white truncate">
          {mirrored && <span className="text-xs mr-1">{flag}</span>}
          {venture.name}
          {!mirrored && <span className="text-xs ml-1">{flag}</span>}
        </div>
        <div className="text-[11px] text-[#555] truncate">{venture.tagline}</div>
      </div>

      {/* Badges */}
      <div className={`flex gap-1.5 flex-shrink-0 ${mirrored ? 'mr-auto ml-0' : 'ml-auto mr-0'}`}>
        <span className="text-[8px] px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">
          {industryText}
        </span>
        <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
          {statusText}
        </span>
      </div>

      {/* Arrow */}
      <ExternalLink className={`w-3.5 h-3.5 text-[#333] group-hover:text-gold transition-colors flex-shrink-0 ${mirrored ? 'order-first' : ''}`} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/portfolio/VentureRow.tsx
git commit -m "feat: add VentureRow component for portfolio split"
```

---

### Task 11: Create CopperDivider component

**Files:**
- Create: `src/components/sections/portfolio/CopperDivider.tsx`

- [ ] **Step 1: Write CopperDivider**

```tsx
export default function CopperDivider() {
  return (
    <div className="relative hidden lg:block">
      {/* Gradient line */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(201,147,94,0.15) 10%, rgba(201,147,94,0.45) 50%, rgba(201,147,94,0.15) 90%, transparent 100%)',
        }}
      />
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-gold shadow-[0_0_16px_rgba(201,147,94,0.5)]" />
      {/* Pulse ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-gold/20 animate-[pulse-ring_3s_ease-out_infinite]" />
    </div>
  );
}
```

- [ ] **Step 2: Add pulse-ring keyframe to tailwind.config.js**

Add to the `keyframes` section:

```js
'pulse-ring': {
  '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
  '100%': { transform: 'translate(-50%, -50%) scale(2.5)', opacity: '0' },
},
```

And add to `animation`:

```js
'pulse-ring': 'pulse-ring 3s ease-out infinite',
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/portfolio/CopperDivider.tsx tailwind.config.js
git commit -m "feat: add CopperDivider with pulse animation"
```

---

### Task 12: Create CategoryColumn component

**Files:**
- Create: `src/components/sections/portfolio/CategoryColumn.tsx`

- [ ] **Step 1: Write CategoryColumn with expand/collapse**

```tsx
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../../lib/gsap';
import type { Venture } from '../../../types/dashboard';
import type { CategoryConfig } from '../../../data/portfolio-categories';
import VentureRow from './VentureRow';

interface CategoryColumnProps {
  config: CategoryConfig;
  ventures: Venture[];
  mirrored?: boolean;
}

export default function CategoryColumn({ config, ventures, mirrored = false }: CategoryColumnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!panelRef.current || !cardsRef.current) return;

    if (!isOpen) {
      setIsOpen(true);
      gsap.fromTo(panelRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' },
      );
      gsap.from(cardsRef.current.children, {
        y: 12, opacity: 0, duration: 0.4,
        stagger: 0.1, ease: 'power2.out', delay: 0.1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: 0, opacity: 0, duration: 0.4, ease: 'power2.in',
        onComplete: () => setIsOpen(false),
      });
    }
  };

  return (
    <div
      className={`p-7 cursor-pointer group ${mirrored ? 'text-right' : ''}`}
      onClick={toggle}
    >
      {/* Header */}
      <div className={`mb-0 ${mirrored ? 'flex flex-col items-end' : ''}`}>
        <div className="w-10 h-10 rounded-[10px] bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center text-base mb-3.5 group-hover:bg-gold/[0.15] group-hover:border-gold/30 group-hover:shadow-[0_0_24px_rgba(201,147,94,0.15)] transition-all">
          {config.icon}
        </div>
        <h3 className="font-display text-[22px] font-bold mb-1.5 group-hover:text-gold-light transition-colors">
          {config.title}
        </h3>
        <p className="text-[#555] text-[12px] leading-relaxed max-w-[300px]">
          {config.description}
        </p>
        <div className={`inline-flex items-center gap-1.5 text-gold text-xs font-medium mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : ''}`}>
          {isOpen ? 'Close' : 'Explore ventures'} <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>

      {/* Expandable panel */}
      <div ref={panelRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div ref={cardsRef} className="pt-6 space-y-2" onClick={(e) => e.stopPropagation()}>
          {ventures.map((v) => (
            <VentureRow key={v.id} venture={v} mirrored={mirrored} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/portfolio/CategoryColumn.tsx
git commit -m "feat: add CategoryColumn with GSAP expand/collapse"
```

---

### Task 13: Create CodeEntropyStrip and PortfolioSplit

**Files:**
- Create: `src/components/sections/portfolio/CodeEntropyStrip.tsx`
- Create: `src/components/sections/portfolio/PortfolioSplit.tsx`

- [ ] **Step 1: Write CodeEntropyStrip**

```tsx
export default function CodeEntropyStrip() {
  return (
    <div className="flex items-center justify-center gap-2.5 pt-7">
      <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/15" />
      <p className="text-[#444] text-[11px] tracking-wider">
        Powered by{' '}
        <a
          href="https://codentropy.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold font-medium hover:text-gold-light transition-colors"
        >
          Code Entropy
        </a>
        {' '}— AI-first studio · Lahore / Oslo
      </p>
      <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/15" />
    </div>
  );
}
```

- [ ] **Step 2: Write PortfolioSplit**

```tsx
import { portfolioCategories, getVenturesForCategory } from '../../../data/portfolio-categories';
import CategoryColumn from './CategoryColumn';
import CopperDivider from './CopperDivider';
import CodeEntropyStrip from './CodeEntropyStrip';
import type { Venture } from '../../../types/dashboard';

export default function PortfolioSplit() {
  const [digitalAssets, healthTech] = portfolioCategories;
  const digitalVentures = getVenturesForCategory('digital-assets') as Venture[];
  const healthVentures = getVenturesForCategory('health-tech') as Venture[];

  return (
    <div>
      {/* Split grid: on mobile stack vertically, on lg show split */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]">
        <CategoryColumn config={digitalAssets} ventures={digitalVentures} />
        <CopperDivider />
        {/* Mobile divider */}
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent my-4" />
        <CategoryColumn config={healthTech} ventures={healthVentures} mirrored />
      </div>
      <CodeEntropyStrip />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/portfolio/CodeEntropyStrip.tsx src/components/sections/portfolio/PortfolioSplit.tsx
git commit -m "feat: add PortfolioSplit with CodeEntropyStrip"
```

---

### Task 14: Update Portfolio section to use PortfolioSplit

**Files:**
- Modify: `src/components/sections/portfolio/Portfolio.tsx`
- Modify: `src/components/sections/portfolio/PortfolioHeader.tsx`

- [ ] **Step 1: Update PortfolioHeader text**

Update title to "Ventures We Build", description to "Building and investing across two core verticals where technology meets opportunity."

- [ ] **Step 2: Update Portfolio.tsx to use PortfolioSplit**

Replace BentoGrid import/usage with PortfolioSplit. Update section ID to `ventures`. Update background to `bg-[#0c0c0c]`.

```tsx
import PortfolioHeader from './PortfolioHeader';
import PortfolioSplit from './PortfolioSplit';

export default function Portfolio() {
  return (
    <section id="ventures" className="py-24 bg-[#0c0c0c]">
      <div className="max-w-[1100px] mx-auto px-6">
        <PortfolioHeader />
        <PortfolioSplit />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify portfolio section renders**

Run: `npm run dev`
Expected: Portfolio shows split view with Digital Assets left, Health Tech right, copper divider, ventures expand on click

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/portfolio/Portfolio.tsx src/components/sections/portfolio/PortfolioHeader.tsx
git commit -m "feat: integrate PortfolioSplit into Portfolio section"
```

---

## Chunk 4: Venture Model + Thesis Sections

### Task 15: Create Venture Model section

**Files:**
- Create: `src/components/sections/venture-model/venture-model.data.ts`
- Create: `src/components/sections/venture-model/TimelineStep.tsx`
- Create: `src/components/sections/venture-model/VentureModel.tsx`

- [ ] **Step 1: Write data file**

```typescript
export interface ModelStep {
  number: string;
  title: string;
  description: string;
}

export const modelSteps: ModelStep[] = [
  {
    number: '01',
    title: 'Build',
    description: 'We identify opportunities, assemble founding teams, and take ventures from concept to product through our AI-first studio.',
  },
  {
    number: '02',
    title: 'Invest',
    description: 'We provide capital, technology infrastructure, and strategic support to accelerate growth.',
  },
  {
    number: '03',
    title: 'Scale',
    description: 'We expand ventures across international markets, leveraging our cross-border network and operational expertise.',
  },
];
```

- [ ] **Step 2: Write TimelineStep**

```tsx
import type { ModelStep } from './venture-model.data';

interface TimelineStepProps {
  step: ModelStep;
}

export default function TimelineStep({ step }: TimelineStepProps) {
  return (
    <div className="flex-1 text-center relative px-4">
      <div className="text-[#333] text-[10px] tracking-[2px] mb-1.5">{step.number}</div>
      <div className="w-3.5 h-3.5 rounded-full bg-[#0c0c0c] border-2 border-gold mx-auto mb-6 relative z-10 shadow-[0_0_12px_rgba(201,147,94,0.3)] timeline-dot" />
      <h3 className="font-display text-[22px] font-bold text-gold-light mb-2.5">{step.title}</h3>
      <p className="text-[#666] text-[13px] leading-relaxed max-w-[260px] mx-auto">{step.description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Write VentureModel with ScrollTrigger timeline animation**

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { modelSteps } from './venture-model.data';
import TimelineStep from './TimelineStep';

export default function VentureModel() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !lineRef.current) return;

    // Animate timeline line drawing
    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      },
    );

    // Stagger dots and content
    const dots = sectionRef.current.querySelectorAll('.timeline-dot');
    const steps = sectionRef.current.querySelectorAll('.flex-1');

    gsap.from(dots, {
      scale: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
      },
    });

    gsap.from(steps, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 bg-[#0c0c0c]">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-[11px] tracking-[4px] uppercase mb-3.5">How We Work</p>
          <h2 className="font-display text-4xl font-bold mb-3.5">From Idea to Impact</h2>
          <p className="text-[#666] text-[15px] max-w-[460px] mx-auto leading-relaxed">
            A repeatable model for building ventures across markets and sectors.
          </p>
        </div>

        {/* Timeline — stacks vertically on mobile */}
        <div className="flex flex-col md:flex-row items-start relative px-5">
          {/* Line */}
          <div
            ref={lineRef}
            className="absolute top-[28px] left-5 right-5 h-0.5 origin-left hidden md:block"
            style={{
              background: 'linear-gradient(90deg, rgba(201,147,94,0.1), rgba(201,147,94,0.4), rgba(201,147,94,0.4), rgba(201,147,94,0.1))',
            }}
          />
          {modelSteps.map((step) => (
            <TimelineStep key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify VentureModel renders**

Temporarily add `<VentureModel />` to HomePage.tsx to test.
Expected: Horizontal 3-step timeline with copper dots, line animates on scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/venture-model/
git commit -m "feat: add Venture Model timeline section"
```

---

### Task 16: Create Thesis section

**Files:**
- Create: `src/components/sections/thesis/Thesis.tsx`

- [ ] **Step 1: Write Thesis section with integrated stats**

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';

const stats = [
  { value: 7, label: 'Ventures' },
  { value: 6, label: 'Markets' },
  { value: 2, label: 'Verticals' },
  { value: 4, label: 'Years Building', suffix: '+' },
];

export default function Thesis() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Counter animation
    const counters = sectionRef.current.querySelectorAll('.stat-num');
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-value') || '0', 10);
      gsap.from(el, {
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
        onUpdate: function () {
          const suffix = el.getAttribute('data-suffix') || '';
          el.textContent = Math.round(parseFloat(el.textContent || '0')) + suffix;
        },
      });
    });

    // Fade in content
    gsap.from(sectionRef.current.querySelectorAll('.thesis-animate'), {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 65%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-[#0c0c0c]">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <p className="thesis-animate text-gold text-[11px] tracking-[4px] uppercase mb-3.5">
          Why Aprikos Venture
        </p>
        <h2 className="thesis-animate font-display text-4xl font-bold mb-5">
          Where Innovation Meets<br />Emerging Opportunity
        </h2>
        <p className="thesis-animate text-[#777] text-base leading-[1.8] max-w-[600px] mx-auto mb-10">
          We focus on building companies where technology, capital, and emerging markets
          intersect — from AI and digital health to blockchain infrastructure and new
          digital economies. Our cross-border model connects Nordic precision with
          South Asian scale.
        </p>

        {/* TODO: Add founder image once photo is confirmed */}
        {/* <img src={founderPhoto} alt="Jamil Rehman" className="w-32 h-32 rounded-2xl object-cover mx-auto mb-8 opacity-80" /> */}

        {/* Stats row */}
        <div className="thesis-animate flex gap-12 justify-center flex-wrap">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="stat-num text-[28px] font-bold text-gold font-body"
                data-value={s.value}
                data-suffix={s.suffix || ''}
              >
                {s.value}{s.suffix || ''}
              </div>
              <div className="text-[#555] text-[10px] tracking-[2px] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/thesis/Thesis.tsx
git commit -m "feat: add Thesis section with integrated stats"
```

---

## Chunk 5: Restyle Existing Sections + Page Assembly

### Task 17: Update Team section

**Files:**
- Modify: `src/components/sections/team/team.data.ts`
- Modify: `src/components/sections/team/TeamHeader.tsx`
- Modify: `src/components/sections/team/TeamMemberCard.tsx`
- Modify: `src/components/sections/team/TeamGrid.tsx`

- [ ] **Step 1: Add one-line bios to team.data.ts**

Add a `shortBio` field to each team member. Examples:
- Jamil: "Entrepreneur focused on AI, digital assets and cross-border ventures."
- Sara: "Technology-driven brand and growth strategist."
- Robert: "Operational leader with expertise in scaling Nordic ventures."
- Farooq: "Clinical expert bridging healthcare and technology."
- Vishal: "Property and investment specialist across European markets."

- [ ] **Step 2: Update TeamHeader text**

Title: "The People Behind the Ventures". Update colors to copper palette.

- [ ] **Step 3: Update TeamMemberCard to show shortBio and use copper colors**

Replace gold `#B8860B` references with copper `#C9935E`. Add shortBio display below role. Update hover gradient overlay to copper tones.

- [ ] **Step 4: Update TeamGrid to 5 columns on lg**

Change grid from `lg:grid-cols-3` to `lg:grid-cols-5`, reduce card image height to accommodate narrower cards.

- [ ] **Step 5: Update Team.tsx background color**

Change `bg-[#0A0E1A]` to `bg-[#0c0c0c]` in `src/components/sections/team/Team.tsx`.

- [ ] **Step 6: Verify team section**

Run: `npm run dev`
Expected: 5-column team grid with one-line bios, copper styling

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/team/
git commit -m "feat: update team section with bios and copper styling"
```

---

### Task 18: Restyle News section

**Files:**
- Modify: `src/components/sections/news/NewsCard.tsx`
- Modify: `src/components/sections/news/NewsHeader.tsx`
- Modify: `src/components/sections/news/News.tsx`

- [ ] **Step 1: Update NewsHeader**

Title: "News & Milestones". Update overline and colors.

- [ ] **Step 2: Update NewsCard colors**

Replace old palette references with copper. Update card background, borders, hover effects.

- [ ] **Step 3: Update News.tsx background**

Change from `bg-gradient-to-b from-[#0A0E1A] to-[#111827]` to `bg-[#0c0c0c]`.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/news/
git commit -m "refactor: restyle news section to copper palette"
```

---

### Task 19: Restyle Contact section

**Files:**
- Modify: `src/components/sections/contact/ContactHeader.tsx`
- Modify: `src/components/sections/contact/ContactForm.tsx`
- Modify: `src/components/sections/contact/ContactInfo.tsx`
- Modify: `src/components/sections/contact/ContactSection.tsx`

- [ ] **Step 1: Update ContactHeader**

Title: "Let's Build Together". Subtitle: "Whether you're a founder, investor, or potential partner — we'd love to hear from you."

- [ ] **Step 2: Update ContactSection background**

Change from `bg-[#111827]` to `bg-[#0c0c0c]`.

- [ ] **Step 3: Update ContactForm button and input colors**

Button: copper gradient. Inputs: dark-secondary background, copper focus border.

- [ ] **Step 4: Update ContactInfo colors**

Replace old palette references with copper.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/contact/
git commit -m "refactor: restyle contact section to copper palette"
```

---

### Task 20: Update Navbar and Footer

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Update Navbar**

- Rename "Portfolio" link to "Ventures" (update label and href to `#ventures`)
- Reorder nav links to: Ventures, About, Team, News, Contact (match spec)
- Remove "Get Started" button (the `OwnerRegistrationButton` or equivalent)
- Keep "Investor Login" as sole action button with copper border styling
- Update scroll background color from old navy to `#0c0c0c`

- [ ] **Step 2: Update Footer**

- Simplify to single row: `© 2026 Aprikos Venture AS` left, `Privacy | LinkedIn | Investor Login` right
- Update colors to copper palette
- Remove legal notice from homepage footer (keep for dashboard only)

- [ ] **Step 3: Verify nav and footer**

Run: `npm run dev`
Expected: Clean navbar with Ventures link, single Investor Login action. Minimal footer.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "refactor: update navbar and footer for redesign"
```

---

### Task 21: Update LogoMarquee

**Files:**
- Modify: `src/components/sections/marquee/LogoMarquee.tsx`

- [ ] **Step 1: Ensure new ventures appear in marquee**

The marquee currently filters for top-level ventures with logos. Ensure Nayapaisa, MKV32, and Pharmesa are included even without logos (show text name as fallback). Also ensure BalderX stays in the marquee.

Update the label text above marquee to: "Ventures across our ecosystem"

- [ ] **Step 2: Update marquee styling to copper**

Replace any old gold/navy color references.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/marquee/LogoMarquee.tsx
git commit -m "refactor: update logo marquee for new ventures and copper palette"
```

---

### Task 22: Assemble HomePage with new section order

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Update imports and section order**

```tsx
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/hero';
import LogoMarquee from '../components/sections/marquee/LogoMarquee';
import Portfolio from '../components/sections/portfolio/Portfolio';
import VentureModel from '../components/sections/venture-model/VentureModel';
import Thesis from '../components/sections/thesis/Thesis';
import Team from '../components/sections/team/Team';
import News from '../components/sections/news';
import ContactSection from '../components/sections/contact/ContactSection';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <LogoMarquee />
      <Portfolio />
      <VentureModel />
      <Thesis />
      <Team />
      <News />
      <ContactSection />
    </Layout>
  );
}
```

- [ ] **Step 2: Verify full page renders in correct order**

Run: `npm run dev`
Expected: All 8 sections render in order: Hero → Marquee → Portfolio → Venture Model → Thesis → Team → News → Contact

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build`
Expected: No TypeScript errors, successful build

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: assemble redesigned homepage with new section order"
```

---

### Task 23: Final cleanup

**Files:**
- Old files to clean up

- [ ] **Step 1: Verify no imports reference old About, Stats, or portfolio.ts**

Search for imports of `About`, `Stats`, and `portfolio.ts`. Ensure nothing else imports them. If `src/data/portfolio.ts` is only used by the old BentoGrid, delete it or update it to re-export from `portfolio-categories.ts`. The old section files can stay in the codebase but are no longer used by HomePage.

- [ ] **Step 2: Full visual QA in browser**

Run: `npm run dev` and check:
- [ ] Hero: headline, word rotation, CTAs, scroll indicator
- [ ] Marquee: logos scroll infinitely
- [ ] Portfolio: categories clickable, ventures expand, divider visible
- [ ] Venture Model: timeline animates on scroll
- [ ] Thesis: stats count up, content fades in
- [ ] Team: 5 columns, bios visible, hover effects
- [ ] News: cards load from Supabase, copper styling
- [ ] Contact: form works, copper styling
- [ ] Navbar: Ventures link scrolls correctly, Investor Login works
- [ ] Mobile: all sections stack correctly
- [ ] Footer: clean, minimal

- [ ] **Step 3: Final build check**

Run: `npm run build`
Expected: Clean build, no warnings

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: homepage redesign cleanup and final adjustments"
```
