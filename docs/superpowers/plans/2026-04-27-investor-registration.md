# Investor Pre-Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen registration wizard + magic link auth + interactive pitch deck viewer, replacing all existing auth/dashboard code.

**Architecture:** Public landing page → 6-step wizard → Supabase insert + magic link → auth callback → protected pitch deck viewer. All old auth/dashboard/portal code deleted. Pitch deck is a single-page HTML embed (not 16 separate React components) for speed and fidelity.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + React Router v7 + Supabase Auth (OTP magic link) + Supabase DB

**Spec:** `docs/superpowers/specs/2026-04-27-investor-registration-design.md`
**Mockups:** `.superpowers/brainstorm/19561-1777291310/content/full-flow.html`

---

## Task 0: Delete Old Auth/Dashboard/Portal Code

**Files to delete:**
- `src/components/auth/MagicLinkLogin.tsx`
- `src/components/auth/AuthCallback.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/VentureList.tsx`
- `src/components/dashboard/VentureCard.tsx`
- `src/components/dashboard/VentureModal.tsx`
- `src/components/dashboard/HubCard.tsx`
- `src/components/dashboard/PlatformCard.tsx`
- `src/components/dashboard/NewsList.tsx`
- `src/components/dashboard/NewsItem.tsx`
- `src/components/dashboard/MembershipStatus.tsx`
- `src/components/portal/InvestorPortalPopup.tsx`
- `src/components/portal/OwnerRegistrationPopup.tsx`
- `src/components/common/UserMenu.tsx`
- `src/components/common/InvestorButton.tsx`
- `src/components/common/OwnerRegistrationButton.tsx`
- `src/components/layout/NavbarActions.tsx`
- `src/pages/InvestorDashboard.tsx`
- `src/contexts/AuthContext.tsx`
- `src/constants/copy.ts`

**Files to keep but note:** `src/types/dashboard.ts` is imported by portfolio components on the homepage (`PortfolioSplit.tsx`, `CategoryColumn.tsx`, `BentoCard.tsx`, `VentureRow.tsx`) and data files (`ventures.mock.ts`, `portfolio-categories.ts`, `news.mock.ts`, `portfolio.ts`). **Do NOT delete it** — it contains `Venture`, `TeamMember`, `PortfolioCategory` types used by the homepage.

- [ ] **Step 1: Delete all old files**

```bash
rm src/components/auth/MagicLinkLogin.tsx
rm src/components/auth/AuthCallback.tsx
rm src/components/auth/ProtectedRoute.tsx
rm -rf src/components/dashboard/
rm -rf src/components/portal/
rm src/components/common/UserMenu.tsx
rm src/components/common/InvestorButton.tsx
rm src/components/common/OwnerRegistrationButton.tsx
rm src/components/layout/NavbarActions.tsx
rm src/pages/InvestorDashboard.tsx
rm src/contexts/AuthContext.tsx
rm src/constants/copy.ts
```

- [ ] **Step 2: Verify no broken imports in remaining code**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: Clean compile (none of the deleted files were imported in App.tsx or active routes). If any errors appear from portfolio components importing `dashboard.ts` — that file was kept and should be fine. If `NavbarActions` is imported somewhere, remove that import.

- [ ] **Step 3: Verify app still builds**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old auth, dashboard, portal, and investor code

Deleting 21 files: auth components, dashboard (9 files), portal popups,
investor buttons, NavbarActions, InvestorDashboard page, AuthContext,
and copy constants. All were unused in routing (never wired in App.tsx).
Keeping types/dashboard.ts as it's used by homepage portfolio."
```

---

## Task 1: Design System CSS + Google Fonts

**Files:**
- Create: `src/styles/deck.css`
- Modify: `index.html` (add font links)

- [ ] **Step 1: Add Google Fonts to index.html**

Add these lines inside `<head>` in `index.html`, before any other stylesheets:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Allura&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

Note: Inter is already loaded. Playfair Display may be loaded too. Check existing `<link>` tags first — only add what's missing (Allura, JetBrains Mono, and any missing weights).

- [ ] **Step 2: Create deck.css**

Create `src/styles/deck.css`:

```css
/* ─── Investor Registration & Deck Design System ─── */
/* Adopted from pitch deck (Editorial Lounge direction) */

:root {
  --deck-bg: #0c0c0c;
  --deck-bg-2: #141420;
  --deck-ink: #f3ece1;
  --deck-ink-dim: #9b9382;
  --deck-ink-faint: #555;
  --deck-ink-faintest: #333;
  --deck-gold: #C9935E;
  --deck-gold-light: #E8C896;
  --deck-gold-dark: #A67A45;
  --deck-rule: rgba(243, 236, 225, 0.10);
  --deck-rule-strong: rgba(243, 236, 225, 0.22);
  --deck-f-display: 'Playfair Display', 'Times New Roman', serif;
  --deck-f-body: 'Inter', system-ui, sans-serif;
  --deck-f-script: 'Allura', cursive;
  --deck-f-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* ─── Base page styles for /register and /deck routes ─── */
.deck-page {
  background: var(--deck-bg);
  color: var(--deck-ink);
  font-family: var(--deck-f-body);
  min-height: 100vh;
}

/* ─── Typography ─── */
.deck-eyebrow {
  font-family: var(--deck-f-body);
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--deck-gold);
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.deck-eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--deck-gold);
}

.deck-display {
  font-family: var(--deck-f-display);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--deck-ink);
}

.deck-italic-gold {
  font-style: italic;
  color: var(--deck-gold);
  font-weight: 500;
}

.deck-lede {
  font-size: 17px;
  line-height: 1.7;
  color: var(--deck-ink-dim);
  font-weight: 300;
}

.deck-kicker {
  font-family: var(--deck-f-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--deck-ink-faint);
}

/* ─── Buttons ─── */
.deck-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  background: var(--deck-gold);
  color: var(--deck-bg);
  font-family: var(--deck-f-body);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.deck-btn-primary:hover {
  background: var(--deck-gold-light);
}

.deck-btn-ghost {
  padding: 14px 24px;
  background: transparent;
  color: var(--deck-ink-faint);
  font-family: var(--deck-f-body);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid var(--deck-rule);
  cursor: pointer;
  transition: border-color 0.2s;
}
.deck-btn-ghost:hover {
  border-color: var(--deck-rule-strong);
}

/* ─── Chips (selectable options) ─── */
.deck-chip {
  padding: 20px 24px;
  border: 1px solid var(--deck-rule);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  text-align: left;
  width: 100%;
}
.deck-chip:hover {
  border-color: rgba(201, 147, 94, 0.4);
}
.deck-chip[data-selected='true'] {
  border-color: var(--deck-gold);
  background: rgba(201, 147, 94, 0.06);
}
.deck-chip-title {
  font-weight: 500;
  font-size: 15px;
  color: var(--deck-ink);
}
.deck-chip[data-selected='true'] .deck-chip-title {
  color: var(--deck-gold-light);
}
.deck-chip-sub {
  font-size: 12px;
  color: var(--deck-ink-faint);
  font-weight: 300;
}

/* ─── Form fields ─── */
.deck-field {
  padding: 16px 20px;
  border: 1px solid var(--deck-rule);
  background: transparent;
  font-family: var(--deck-f-body);
  font-size: 14px;
  color: var(--deck-ink);
  font-weight: 300;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
.deck-field::placeholder {
  color: var(--deck-ink-faint);
}
.deck-field:focus {
  border-color: var(--deck-gold);
}
.deck-field-error {
  border-color: #c94a4a;
}

/* ─── Progress bar ─── */
.deck-progress {
  display: flex;
  gap: 4px;
  max-width: 320px;
}
.deck-progress-seg {
  height: 2px;
  flex: 1;
  background: var(--deck-rule);
  border-radius: 1px;
  transition: background 0.3s;
}
.deck-progress-seg[data-state='done'] {
  background: var(--deck-gold);
}
.deck-progress-seg[data-state='current'] {
  background: var(--deck-gold-light);
}

/* ─── Mesh gradient background ─── */
.deck-mesh-bg {
  background:
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(201, 147, 94, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse 70% 45% at 15% 85%, rgba(15, 27, 45, 0.6) 0%, transparent 55%),
    var(--deck-bg-2);
}

/* ─── Mono facts table ─── */
.deck-facts {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--deck-f-mono);
  font-size: 13px;
  color: var(--deck-ink-dim);
}
.deck-facts td {
  padding: 12px 0;
  border-top: 1px solid var(--deck-rule);
}
.deck-facts td:first-child {
  color: var(--deck-ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  width: 40%;
  font-size: 10px;
}
.deck-facts td:last-child {
  color: var(--deck-ink);
  text-align: right;
}
```

- [ ] **Step 3: Import deck.css in main.tsx**

Add to the top of `src/main.tsx`:

```typescript
import './styles/deck.css';
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/deck.css index.html src/main.tsx
git commit -m "feat: add pitch deck design system CSS and fonts"
```

---

## Task 2: Auth Context + Supabase Setup

**Files:**
- Create: `src/contexts/AuthContext.tsx`
- Create: `src/components/auth/ProtectedRoute.tsx`
- Create: `src/components/auth/AuthCallback.tsx`

- [ ] **Step 1: Create new AuthContext**

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

- [ ] **Step 2: Create ProtectedRoute**

Create `src/components/auth/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="deck-page flex items-center justify-center">
        <div className="deck-kicker">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 3: Create AuthCallback**

Create `src/components/auth/AuthCallback.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        // Try hash-based flow (magic link with fragment)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) {
            setError('Sign-in link expired. Please request a new one.');
            setTimeout(() => navigate('/register'), 3000);
            return;
          }
        } else {
          setError('Sign-in link expired. Please request a new one.');
          setTimeout(() => navigate('/register'), 3000);
          return;
        }
      }

      // Update last_login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('investors')
          .update({ last_login: new Date().toISOString(), user_id: user.id })
          .eq('email', user.email);
      }

      navigate('/deck', { replace: true });
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="deck-page flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-center">
          <p className="deck-lede" style={{ color: '#c94a4a' }}>{error}</p>
          <p className="deck-kicker mt-4">Redirecting to registration...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="deck-kicker">Verifying your sign-in link...</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Wire AuthProvider into main.tsx**

Modify `src/main.tsx` — add AuthProvider wrapping App:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SmoothScrollProvider from './components/providers/SmoothScrollProvider';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import './styles/deck.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 5: Commit**

```bash
git add src/contexts/AuthContext.tsx src/components/auth/ProtectedRoute.tsx src/components/auth/AuthCallback.tsx src/main.tsx
git commit -m "feat: add new AuthContext, ProtectedRoute, and AuthCallback

Supabase OTP magic link flow. AuthProvider wraps entire app.
ProtectedRoute redirects to /register. AuthCallback handles
both PKCE and hash-based magic link flows."
```

---

## Task 3: Registration Landing Page

**Files:**
- Create: `src/components/register/RegisterLanding.tsx`

- [ ] **Step 1: Create RegisterLanding component**

Create `src/components/register/RegisterLanding.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterLanding() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInSent, setSignInSent] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSignInError(null);
    const { error } = await signIn(signInEmail);
    setSending(false);
    if (error) {
      setSignInError('Could not send sign-in link. Please try again.');
    } else {
      setSignInSent(true);
    }
  };

  return (
    <div className="deck-page">
      <div
        className="deck-mesh-bg min-h-screen flex flex-col justify-center"
        style={{ padding: '64px' }}
      >
        {/* Logo */}
        <div className="mb-12">
          <span
            className="text-xl"
            style={{ fontFamily: 'var(--deck-f-display)', fontWeight: 500 }}
          >
            Aprikos<span style={{ color: 'var(--deck-gold)' }}>.</span>
          </span>
        </div>

        {/* Eyebrow */}
        <div className="deck-eyebrow mb-5">Investor Pre-Registration</div>

        {/* Headline */}
        <h1
          className="deck-display mb-7"
          style={{ fontSize: 'clamp(36px, 5vw, 56px)', maxWidth: '700px' }}
        >
          Early access to a{' '}
          <em className="deck-italic-gold">cross-border</em> venture platform
        </h1>

        {/* Lede */}
        <p className="deck-lede mb-9" style={{ maxWidth: '560px' }}>
          A Norway-based venture builder developing technology-driven companies
          across digital assets, healthcare, and AI. Pre-register for access to
          our investor deck and updates.
        </p>

        {/* Stats row */}
        <div
          className="flex gap-12 mb-10 pb-8"
          style={{ borderBottom: '1px solid var(--deck-rule)' }}
        >
          {[
            { n: '€5M', l: 'Raise Target' },
            { n: '5', l: 'Active Ventures' },
            { n: '3', l: 'Verticals' },
            { n: '4+', l: 'Years Building' },
          ].map((s) => (
            <div key={s.l}>
              <div
                className="deck-display"
                style={{ fontSize: '32px', color: 'var(--deck-gold)' }}
              >
                {s.n}
              </div>
              <div className="deck-kicker mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="deck-btn-primary"
          onClick={() => navigate('/register/wizard')}
        >
          Pre-Register Now <span className="text-lg">→</span>
        </button>

        {/* Sign in link */}
        <div className="mt-4">
          {!showSignIn ? (
            <button
              className="text-sm"
              style={{
                color: 'var(--deck-ink-faint)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setShowSignIn(true)}
            >
              Already registered?{' '}
              <span
                style={{
                  color: 'var(--deck-gold)',
                  textDecoration: 'underline',
                }}
              >
                Sign in with magic link
              </span>
            </button>
          ) : signInSent ? (
            <p className="text-sm" style={{ color: 'var(--deck-gold-light)' }}>
              ✉ Check your inbox at{' '}
              <strong>{signInEmail}</strong>
            </p>
          ) : (
            <form onSubmit={handleSignIn} className="flex gap-3 items-center mt-2">
              <input
                type="email"
                className="deck-field"
                style={{ maxWidth: '280px' }}
                placeholder="Your email address"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <button className="deck-btn-primary" style={{ padding: '16px 24px' }} disabled={sending}>
                {sending ? 'Sending...' : 'Send Link'}
              </button>
              {signInError && (
                <span className="text-sm" style={{ color: '#c94a4a' }}>{signInError}</span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/register/RegisterLanding.tsx
git commit -m "feat: add RegisterLanding page with stats and sign-in"
```

---

## Task 4: Registration Wizard (6 Steps)

**Files:**
- Create: `src/components/register/RegisterWizard.tsx`
- Create: `src/components/register/steps/InvestorTypeStep.tsx`
- Create: `src/components/register/steps/IdentityStep.tsx`
- Create: `src/components/register/steps/OrganisationStep.tsx`
- Create: `src/components/register/steps/InterestStep.tsx`
- Create: `src/components/register/steps/CommitmentStep.tsx`
- Create: `src/components/register/steps/ReviewStep.tsx`
- Create: `src/components/register/MagicLinkSent.tsx`

This is the largest task. Each step component receives wizard data + an `onNext`/`onBack` callback. The parent `RegisterWizard` manages state and step navigation.

- [ ] **Step 1: Define wizard types**

Create `src/components/register/types.ts`:

```typescript
export type InvestorType = 'private' | 'institutional' | 'family_office' | 'fund';
export type Commitment = '100k-250k' | '250k-1m' | '1m_plus' | 'undisclosed';
export type Vertical = 'digital_assets' | 'healthcare' | 'ai_studio' | 'all';

export interface WizardData {
  investorType: InvestorType | null;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  interests: Vertical[];
  commitment: Commitment | null;
}

export const INITIAL_WIZARD_DATA: WizardData = {
  investorType: null,
  fullName: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  interests: [],
  commitment: null,
};

export interface StepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}
```

- [ ] **Step 2: Create WizardShell (shared chrome)**

Create `src/components/register/WizardShell.tsx`:

```typescript
import type { ReactNode } from 'react';

interface WizardShellProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
  question: ReactNode;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
}

export default function WizardShell({
  step,
  totalSteps,
  stepLabel,
  question,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue →',
  nextDisabled = false,
  showBack = true,
}: WizardShellProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !nextDisabled) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="deck-page" onKeyDown={handleKeyDown}>
      <div
        className="min-h-screen flex flex-col"
        style={{
          padding: 'clamp(32px, 5vw, 64px)',
          background: 'var(--deck-bg-2)',
        }}
      >
        {/* Progress bar */}
        <div className="deck-progress mb-10">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className="deck-progress-seg"
              data-state={i < step ? 'done' : i === step ? 'current' : undefined}
            />
          ))}
        </div>

        {/* Step label */}
        <div className="deck-kicker mb-3">
          Step {step + 1} · {stepLabel}
        </div>

        {/* Question */}
        <h2
          className="deck-display mb-8"
          style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}
        >
          {question}
        </h2>

        {/* Content */}
        <div className="flex-1">{children}</div>

        {/* Navigation */}
        <div className="flex items-center gap-4 pt-8 mt-auto">
          {showBack && (
            <button className="deck-btn-ghost" onClick={onBack}>
              ← Back
            </button>
          )}
          <button
            className="deck-btn-primary"
            onClick={onNext}
            disabled={nextDisabled}
            style={{ opacity: nextDisabled ? 0.4 : 1 }}
          >
            {nextLabel}
          </button>
          <span
            className="ml-auto"
            style={{
              fontFamily: 'var(--deck-f-mono)',
              fontSize: '10px',
              color: 'var(--deck-ink-faintest)',
              letterSpacing: '0.1em',
            }}
          >
            ↵ Enter
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create InvestorTypeStep**

Create `src/components/register/steps/InvestorTypeStep.tsx`:

```typescript
import type { StepProps, InvestorType } from '../types';
import WizardShell from '../WizardShell';

const OPTIONS: { value: InvestorType; label: string; sub: string }[] = [
  { value: 'private', label: 'Private Investor', sub: 'Individual / HNW' },
  { value: 'institutional', label: 'Institutional', sub: 'Pension / Sovereign' },
  { value: 'family_office', label: 'Family Office', sub: 'Single or Multi' },
  { value: 'fund', label: 'Fund / LP', sub: 'VC / PE / FoF' },
];

export default function InvestorTypeStep({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <WizardShell
      step={0}
      totalSteps={6}
      stepLabel="Investor Type"
      question={<>What best describes <em className="deck-italic-gold">you?</em></>}
      onNext={onNext}
      onBack={onBack}
      showBack={false}
      nextDisabled={!data.investorType}
    >
      <div className="grid grid-cols-2 gap-3" style={{ maxWidth: '520px' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="deck-chip"
            data-selected={data.investorType === opt.value}
            onClick={() => onUpdate({ investorType: opt.value })}
          >
            <span className="deck-chip-title">{opt.label}</span>
            <span className="deck-chip-sub">{opt.sub}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
```

- [ ] **Step 4: Create IdentityStep**

Create `src/components/register/steps/IdentityStep.tsx`:

```typescript
import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

export default function IdentityStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const isValid = data.fullName.trim() !== '' && data.email.includes('@') && data.phone.trim() !== '';

  return (
    <WizardShell
      step={1}
      totalSteps={6}
      stepLabel="Your Identity"
      question={<>Let's get <em className="deck-italic-gold">acquainted</em></>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="grid grid-cols-2 gap-4" style={{ maxWidth: '520px' }}>
        <input
          className="deck-field"
          placeholder="Full name"
          value={data.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          autoFocus
        />
        <input
          className="deck-field"
          type="email"
          placeholder="Email address"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
        />
        <input
          className="deck-field col-span-2"
          type="tel"
          placeholder="Phone number (with country code)"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
        />
      </div>
    </WizardShell>
  );
}
```

- [ ] **Step 5: Create OrganisationStep**

Create `src/components/register/steps/OrganisationStep.tsx`:

```typescript
import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

const COUNTRIES = [
  'Norway', 'Sweden', 'Denmark', 'Finland', 'United Kingdom', 'Germany',
  'France', 'Switzerland', 'Luxembourg', 'Netherlands', 'United States',
  'Canada', 'United Arab Emirates', 'Saudi Arabia', 'Pakistan', 'India',
  'Singapore', 'Hong Kong', 'Japan', 'Australia', 'Other',
];

export default function OrganisationStep({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <WizardShell
      step={2}
      totalSteps={6}
      stepLabel="Organisation"
      question={<>Where are you <em className="deck-italic-gold">based?</em></>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!data.country}
    >
      <div className="grid grid-cols-2 gap-4" style={{ maxWidth: '520px' }}>
        <input
          className="deck-field"
          placeholder="Company / Organisation (optional)"
          value={data.company}
          onChange={(e) => onUpdate({ company: e.target.value })}
        />
        <select
          className="deck-field"
          value={data.country}
          onChange={(e) => onUpdate({ country: e.target.value })}
          style={{ color: data.country ? 'var(--deck-ink)' : 'var(--deck-ink-faint)' }}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </WizardShell>
  );
}
```

- [ ] **Step 6: Create InterestStep**

Create `src/components/register/steps/InterestStep.tsx`:

```typescript
import type { StepProps, Vertical } from '../types';
import WizardShell from '../WizardShell';

const OPTIONS: { value: Vertical; label: string }[] = [
  { value: 'digital_assets', label: 'Digital Assets' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'ai_studio', label: 'AI & Studio' },
  { value: 'all', label: 'All Verticals' },
];

export default function InterestStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const toggle = (v: Vertical) => {
    if (v === 'all') {
      onUpdate({ interests: ['all'] });
      return;
    }
    const without = data.interests.filter((i) => i !== 'all' && i !== v);
    if (data.interests.includes(v)) {
      onUpdate({ interests: without });
    } else {
      onUpdate({ interests: [...without, v] });
    }
  };

  return (
    <WizardShell
      step={3}
      totalSteps={6}
      stepLabel="Interest"
      question={<>Which verticals <em className="deck-italic-gold">interest</em> you?</>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={data.interests.length === 0}
    >
      <div className="grid grid-cols-4 gap-3" style={{ maxWidth: '520px' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="deck-chip"
            data-selected={data.interests.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          >
            <span className="deck-chip-title">{opt.label}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
```

- [ ] **Step 7: Create CommitmentStep**

Create `src/components/register/steps/CommitmentStep.tsx`:

```typescript
import type { StepProps, Commitment } from '../types';
import WizardShell from '../WizardShell';

const OPTIONS: { value: Commitment; label: string }[] = [
  { value: '100k-250k', label: '€100K–250K' },
  { value: '250k-1m', label: '€250K–1M' },
  { value: '1m_plus', label: '€1M+' },
  { value: 'undisclosed', label: 'Undisclosed' },
];

export default function CommitmentStep({ data, onUpdate, onNext, onBack }: StepProps) {
  return (
    <WizardShell
      step={4}
      totalSteps={6}
      stepLabel="Investment"
      question={<>Anticipated <em className="deck-italic-gold">commitment?</em></>}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!data.commitment}
    >
      <div className="grid grid-cols-4 gap-3" style={{ maxWidth: '520px' }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className="deck-chip"
            data-selected={data.commitment === opt.value}
            onClick={() => onUpdate({ commitment: opt.value })}
          >
            <span className="deck-chip-title">{opt.label}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
```

- [ ] **Step 8: Create ReviewStep**

Create `src/components/register/steps/ReviewStep.tsx`:

```typescript
import type { StepProps } from '../types';
import WizardShell from '../WizardShell';

const TYPE_LABELS: Record<string, string> = {
  private: 'Private Investor',
  institutional: 'Institutional',
  family_office: 'Family Office',
  fund: 'Fund / LP',
};

const COMMITMENT_LABELS: Record<string, string> = {
  '100k-250k': '€100K–250K',
  '250k-1m': '€250K–1M',
  '1m_plus': '€1M+',
  undisclosed: 'Undisclosed',
};

const INTEREST_LABELS: Record<string, string> = {
  digital_assets: 'Digital Assets',
  healthcare: 'Healthcare',
  ai_studio: 'AI & Studio',
  all: 'All Verticals',
};

export default function ReviewStep({ data, onNext, onBack }: StepProps) {
  const rows = [
    { label: 'Type', value: TYPE_LABELS[data.investorType ?? ''] },
    { label: 'Name', value: data.fullName },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Company', value: data.company || '—' },
    { label: 'Country', value: data.country },
    { label: 'Interest', value: data.interests.map((i) => INTEREST_LABELS[i]).join(' · '), gold: true },
    { label: 'Commitment', value: COMMITMENT_LABELS[data.commitment ?? ''], gold: true },
  ];

  return (
    <WizardShell
      step={5}
      totalSteps={6}
      stepLabel="Review"
      question={<>Everything <em className="deck-italic-gold">correct?</em></>}
      onNext={onNext}
      onBack={onBack}
      nextLabel="Submit Registration →"
    >
      <table className="deck-facts" style={{ maxWidth: '520px' }}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td style={r.gold ? { color: 'var(--deck-gold-light)' } : undefined}>
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </WizardShell>
  );
}
```

- [ ] **Step 9: Create MagicLinkSent**

Create `src/components/register/MagicLinkSent.tsx`:

```typescript
import { useState, useEffect } from 'react';

interface MagicLinkSentProps {
  email: string;
  onResend: () => Promise<void>;
}

export default function MagicLinkSent({ email, onResend }: MagicLinkSentProps) {
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    await onResend();
    setResending(false);
    setCooldown(60);
  };

  return (
    <div className="deck-page">
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center"
        style={{ background: 'var(--deck-bg-2)', padding: '64px' }}
      >
        <div style={{ fontSize: '40px', color: 'var(--deck-gold)', marginBottom: '24px' }}>
          ✉
        </div>
        <h2 className="deck-display" style={{ fontSize: '28px', marginBottom: '12px' }}>
          Check your inbox
        </h2>
        <p className="deck-lede" style={{ maxWidth: '420px' }}>
          We've sent a secure sign-in link to
          <br />
          <strong style={{ color: 'var(--deck-gold-light)', fontWeight: 500 }}>
            {email}
          </strong>
        </p>
        <p
          className="mt-4"
          style={{ fontSize: '12px', color: 'var(--deck-ink-faint)' }}
        >
          Click the link in your email to access the investor deck. The link expires in 24 hours.
        </p>
        <button
          className="deck-btn-ghost mt-6"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          style={{ opacity: cooldown > 0 ? 0.4 : 1 }}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend link'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Create RegisterWizard (parent orchestrator)**

Create `src/components/register/RegisterWizard.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { INITIAL_WIZARD_DATA, type WizardData } from './types';
import InvestorTypeStep from './steps/InvestorTypeStep';
import IdentityStep from './steps/IdentityStep';
import OrganisationStep from './steps/OrganisationStep';
import InterestStep from './steps/InterestStep';
import CommitmentStep from './steps/CommitmentStep';
import ReviewStep from './steps/ReviewStep';
import MagicLinkSent from './MagicLinkSent';

export default function RegisterWizard() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => {
    if (step === 0) {
      navigate('/register');
    } else {
      setStep((s) => s - 1);
    }
  };

  const submit = async () => {
    setError(null);

    // Check for existing registration
    const { data: existing } = await supabase
      .from('investors')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (existing) {
      // Already registered — just send magic link
      const { error: signInError } = await signIn(data.email);
      if (signInError) {
        setError('Could not send sign-in link. Please try again.');
        return;
      }
      setSubmitted(true);
      return;
    }

    // Insert registration
    const { error: insertError } = await supabase.from('investors').insert({
      investor_type: data.investorType,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      country: data.country,
      interests: data.interests,
      commitment: data.commitment,
    });

    if (insertError) {
      setError('Registration failed. Please try again.');
      return;
    }

    // Send magic link
    const { error: signInError } = await signIn(data.email);
    if (signInError) {
      setError('Registered, but could not send sign-in link. Please use "Sign in" on the landing page.');
      return;
    }

    setSubmitted(true);
  };

  const handleResend = async () => {
    await signIn(data.email);
  };

  if (submitted) {
    return <MagicLinkSent email={data.email} onResend={handleResend} />;
  }

  const stepProps = { data, onUpdate: update, onNext: step === 5 ? submit : next, onBack: back };

  const steps = [
    <InvestorTypeStep key={0} {...stepProps} />,
    <IdentityStep key={1} {...stepProps} />,
    <OrganisationStep key={2} {...stepProps} />,
    <InterestStep key={3} {...stepProps} />,
    <CommitmentStep key={4} {...stepProps} />,
    <ReviewStep key={5} {...stepProps} />,
  ];

  return (
    <>
      {error && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#c94a4a',
            color: '#fff',
            padding: '12px 24px',
            fontSize: '13px',
            zIndex: 1000,
            borderRadius: '4px',
          }}
        >
          {error}
          <button
            style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}
      {steps[step]}
    </>
  );
}
```

- [ ] **Step 11: Commit**

```bash
git add src/components/register/
git commit -m "feat: add 6-step registration wizard with magic link submit

Full-screen wizard: investor type → identity → organisation →
interest → commitment → review → submit to Supabase + magic link.
Handles duplicate emails gracefully."
```

---

## Task 5: Deck Welcome + Deck Viewer (HTML Embed)

**Files:**
- Create: `src/components/deck/DeckWelcome.tsx`
- Create: `src/components/deck/DeckViewer.tsx`
- Copy: pitch deck HTML + assets to `public/deck/`

The pitch deck is a 2051-line HTML file with embedded CSS and a `deck-stage.js` runtime. Rather than converting 16 slides to individual React components (which would take days and introduce visual regressions), we embed the HTML in an iframe. This preserves pixel-perfect fidelity and lets you update the deck independently.

- [ ] **Step 1: Copy pitch deck to public/deck/**

```bash
mkdir -p public/deck
cp "/tmp/aprikos-venture-pitch-deck/project/Aprikos Venture Pitch Deck.html" public/deck/index.html
cp "/tmp/aprikos-venture-pitch-deck/project/deck-stage.js" public/deck/
cp -r "/tmp/aprikos-venture-pitch-deck/project/assets" public/deck/
cp -r "/tmp/aprikos-venture-pitch-deck/project/uploads" public/deck/
```

- [ ] **Step 2: Create DeckWelcome**

Create `src/components/deck/DeckWelcome.tsx`:

```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DeckWelcome() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    supabase
      .from('investors')
      .select('full_name')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setName(data.full_name.split(' ')[0]);
      });
  }, [user]);

  return (
    <div className="deck-page">
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center"
        style={{
          padding: '64px',
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,147,94,0.06) 0%, transparent 70%), var(--deck-bg-2)',
        }}
      >
        {/* Check icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '2px solid var(--deck-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            color: 'var(--deck-gold)',
            fontSize: '28px',
          }}
        >
          ✓
        </div>

        <h2
          className="deck-display"
          style={{ fontSize: '36px', marginBottom: '16px' }}
        >
          Welcome, <em className="deck-italic-gold">{name || 'Investor'}</em>
        </h2>

        <p className="deck-lede" style={{ maxWidth: '480px', marginBottom: '36px' }}>
          Your registration is confirmed. You now have exclusive access to the
          Aprikos Venture investor deck.
        </p>

        <button
          className="deck-btn-primary"
          onClick={() => navigate('/deck/view')}
        >
          View Investor Deck →
        </button>

        <p
          style={{
            marginTop: '24px',
            maxWidth: '400px',
            lineHeight: 1.6,
            fontSize: '12px',
            color: 'var(--deck-ink-faint)',
          }}
        >
          The deck is interactive and always up-to-date.
          <br />
          <span style={{ color: 'var(--deck-gold)' }}>
            Investment access via Anchor S.F.
          </span>{' '}
          will be available soon.
        </p>

        <button
          className="deck-btn-ghost mt-8"
          onClick={signOut}
          style={{ fontSize: '10px', padding: '10px 20px' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create DeckViewer (iframe embed)**

Create `src/components/deck/DeckViewer.tsx`:

```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function DeckViewer() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Minimal top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--deck-bg)',
          borderBottom: '1px solid var(--deck-rule)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate('/deck')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--deck-ink-faint)',
            fontFamily: 'var(--deck-f-body)',
            fontSize: '12px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
          }}
        >
          ← Back
        </button>
        <span
          style={{
            fontFamily: 'var(--deck-f-display)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--deck-ink)',
          }}
        >
          Aprikos<span style={{ color: 'var(--deck-gold)' }}>.</span>{' '}
          <span style={{ color: 'var(--deck-ink-faint)', fontWeight: 300, fontSize: '12px' }}>
            Investor Deck
          </span>
        </span>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '1px solid var(--deck-rule)',
            color: 'var(--deck-ink-faint)',
            fontFamily: 'var(--deck-f-body)',
            fontSize: '10px',
            padding: '6px 12px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Deck iframe */}
      <iframe
        src="/deck/index.html"
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          background: '#000',
        }}
        title="Aprikos Venture Investor Deck"
        allow="fullscreen"
      />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add public/deck/ src/components/deck/
git commit -m "feat: add DeckWelcome and DeckViewer with pitch deck embed

Welcome page shows investor name, confirmation, and deck CTA.
DeckViewer embeds the pitch deck HTML in a full-screen iframe
with minimal top bar (back + logo + sign out)."
```

---

## Task 6: Wire Routes in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update App.tsx with all routes**

Replace `src/App.tsx` with:

```typescript
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterLanding from './components/register/RegisterLanding';
import RegisterWizard from './components/register/RegisterWizard';
import AuthCallback from './components/auth/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DeckWelcome from './components/deck/DeckWelcome';
import DeckViewer from './components/deck/DeckViewer';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterLanding />} />
      <Route path="/register/wizard" element={<RegisterWizard />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/deck"
        element={
          <ProtectedRoute>
            <DeckWelcome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deck/view"
        element={
          <ProtectedRoute>
            <DeckViewer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire registration, auth, and deck routes

Routes: /register, /register/wizard, /auth/callback,
/deck (protected), /deck/view (protected).
Homepage unchanged."
```

---

## Task 7: Supabase Database Setup

**Files:**
- Create: `supabase/migrations/001_investors_table.sql`

- [ ] **Step 1: Create migration file**

Create `supabase/migrations/001_investors_table.sql`:

```sql
-- Investor pre-registration table
CREATE TABLE IF NOT EXISTS investors (
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
  last_login TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own row
CREATE POLICY "Users can read own data"
  ON investors FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert during registration (before auth)
CREATE POLICY "Anon can insert during registration"
  ON investors FOR INSERT
  WITH CHECK (true);

-- Authenticated users can update their own row (for last_login, user_id binding)
CREATE POLICY "Users can update own data"
  ON investors FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
```

- [ ] **Step 2: Run migration on Supabase**

Go to Supabase dashboard → SQL Editor → paste and run the migration. Or use Supabase CLI:

```bash
# If supabase CLI is configured:
supabase db push
```

Verify: Check that `investors` table exists with all columns and RLS policies in the Supabase dashboard.

- [ ] **Step 3: Configure Supabase Auth redirect URL**

In Supabase dashboard → Authentication → URL Configuration:
- Add `http://localhost:5173/auth/callback` to Redirect URLs
- Add your production domain's `/auth/callback` when deployed

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add investors table migration with RLS policies"
```

---

## Task 8: Smoke Test + Mobile Responsiveness

- [ ] **Step 1: Start dev server and test full flow**

```bash
npm run dev
```

Test manually:
1. Navigate to `http://localhost:5173/register` — verify landing page renders with stats, CTA, sign-in link
2. Click "Pre-Register Now" — verify wizard step 1 loads
3. Click through all 6 steps — verify chips select, fields validate, progress bar advances
4. On step 6 (Review) — verify all data shows correctly
5. Submit — verify magic link confirmation screen
6. Try `/deck` without auth — verify redirect to `/register`
7. Try sign-in flow on landing page — verify email input appears

- [ ] **Step 2: Fix any mobile responsiveness issues**

Check on mobile viewport (375px wide):
- Landing page stats should stack or wrap
- Wizard chips should stack to 2x1 on narrow screens
- Fields should be full-width on mobile
- DeckViewer iframe should fill screen

If issues found, add responsive breakpoints to `deck.css`:

```css
@media (max-width: 640px) {
  .deck-chip { padding: 16px 20px; }
}
```

- [ ] **Step 3: Final build check**

```bash
npm run build
```

Expected: Clean build, no warnings.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: mobile responsiveness and smoke test fixes"
```
