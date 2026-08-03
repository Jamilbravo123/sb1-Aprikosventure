# Styreportal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Beskyttet styreområde `/styret` på aprikosventure.com: prosjekter med eierandel, tre milepæler per prosjekt, protokoller/referater, «siden sist»-panel og samlet milepælstidslinje — med magisk lenke-innlogging mot lukket allowlist.

**Architecture:** Nytt beskyttet område i eksisterende Vite + React SPA. Fire nye Supabase-tabeller med RLS (`is_board_member()`/`is_board_admin()`-hjelpere), privat Storage-bøtte `board-docs`, egen auth-callback `/styret/callback` som aldri rører `investors`-tabellen eller `/deck`. Alt UI gjenbruker «Editorial Lounge»-designsystemet i `src/styles/deck.css`.

**Tech Stack:** React 18 + TypeScript, React Router 7, Supabase JS v2 (auth/otp, postgrest, storage), Tailwind + `deck-*`-klasser, Netlify.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-03-styreportal-design.md` — les den først.
- All UI-tekst på **norsk bokmål**. Portalen heter «Styreportal»; gruppen omtales som «det kommende styret» (ALDRI «styret i Aprikos Venture AS»).
- `/deck`, `/register`, `AuthCallback.tsx`, `ProtectedRoute.tsx`, `investors`-tabellen og `src/data/ventures.mock.ts` skal IKKE endres.
- Ingen service-rolle-nøkkel i frontend. Kun `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (finnes allerede).
- Ingen e-postadresser eller andre persondata committes til git — seed skjer manuelt i Supabase (Task 12).
- Repoet har ikke testrammeverk. Verifisering per task = `npm run build` + `npm run lint` grønne + angitt manuell sjekk.
- **Hvert commit-steg krever eksplisitt OK fra Jamil før det kjøres** (global regel). Spør én gang per task.
- 2-space innrykk, enkle anførselstegn, `const` foran `let`.

## Filstruktur (opprettes/endres)

| Fil | Ansvar |
|---|---|
| `supabase/migrations/20260803120000_board_portal.sql` | Skjema, RLS, RPC, storage-bøtte + policies |
| `src/types/board.ts` | Delte typer for hele styreområdet |
| `src/lib/boardApi.ts` | Alt datalag mot Supabase (lesing, admin-skriving, signerte lenker) |
| `src/hooks/useBoardMember.ts` | Hent innlogget brukers `BoardMember`-rad (eller null) |
| `src/components/styret/BoardProtectedRoute.tsx` | Gate for undersider |
| `src/pages/styret/BoardLanding.tsx` | `/styret`: login-skjema ELLER dashboard, avhengig av sesjon+medlemskap |
| `src/pages/styret/BoardCallback.tsx` | `/styret/callback`: sesjon, bind `user_id`, → `/styret` |
| `src/pages/styret/BoardDashboard.tsx` | Forside: siden sist + tidslinje + prosjektgrid |
| `src/components/styret/SinceLastPanel.tsx` | «Siden sist»-panelet |
| `src/components/styret/UpcomingMilestones.tsx` | Samlet milepælstidslinje |
| `src/components/styret/ProjectCard.tsx` | Prosjektkort i grid |
| `src/components/styret/MilestoneStepper.tsx` | Horisontal 3-stegs milepælsvisning |
| `src/pages/styret/BoardProject.tsx` | `/styret/prosjekt/:slug` |
| `src/pages/styret/BoardDocuments.tsx` | `/styret/dokumenter` |
| `src/pages/styret/BoardAdmin.tsx` | `/styret/admin` med tre faner |
| `src/components/styret/AdminProjects.tsx` | CRUD prosjekter + milepæler |
| `src/components/styret/AdminDocuments.tsx` | Opplasting/sletting av PDF-er |
| `src/components/styret/AdminMembers.tsx` | Medlemsliste |
| Modify: `src/App.tsx` | Nye ruter |
| Modify: `public/_redirects` | Eksplisitt `/styret/*`-fallback |

---

### Task 1: Supabase-migrasjon

**Files:**
- Create: `supabase/migrations/20260803120000_board_portal.sql`

**Interfaces:**
- Produces: tabellene `board_members`, `board_projects`, `board_milestones`, `board_documents`; funksjonene `is_board_member()`, `is_board_admin()`, `check_board_email(p_email text)`; privat bøtte `board-docs`. Kolonnenavn brukes ordrett av `src/types/board.ts` (Task 2).

- [ ] **Step 1: Skriv migrasjonsfilen**

```sql
-- Styreportal: skjema, RLS, RPC og storage.
-- Seed av board_members skjer manuelt i Supabase (ingen persondata i git).

create extension if not exists pgcrypto;

-- ── Tabeller ──────────────────────────────────────────────

create table board_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null unique check (email = lower(email)),
  full_name text not null,
  role text not null default 'medlem' check (role in ('medlem', 'admin')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table board_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  ownership_pct numeric(5,2) check (ownership_pct >= 0 and ownership_pct <= 100),
  ownership_note text,
  company_name text,
  company_orgnr text,
  sort_order int not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table board_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references board_projects(id) on delete cascade,
  title text not null,
  target_date date not null,
  status text not null default 'planlagt'
    check (status in ('planlagt', 'pågår', 'fullført', 'forsinket')),
  position int not null check (position between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, position)
);

create table board_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references board_projects(id) on delete set null,
  title text not null,
  doc_type text not null check (doc_type in ('protokoll', 'referat', 'annet')),
  meeting_date date,
  file_path text not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ── updated_at-trigger ────────────────────────────────────

create or replace function board_touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger board_projects_touch before update on board_projects
  for each row execute function board_touch_updated_at();
create trigger board_milestones_touch before update on board_milestones
  for each row execute function board_touch_updated_at();

-- ── Hjelpefunksjoner (én kilde for alle policies) ─────────

create or replace function is_board_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from board_members m
    where m.user_id = auth.uid()
       or lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function is_board_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from board_members m
    where m.role = 'admin'
      and (m.user_id = auth.uid()
           or lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  );
$$;

-- Returnerer KUN ja/nei — lekker aldri listen. Kalles før OTP sendes.
create or replace function check_board_email(p_email text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from board_members where email = lower(trim(p_email))
  );
$$;

grant execute on function check_board_email(text) to anon, authenticated;
grant execute on function is_board_member() to authenticated;
grant execute on function is_board_admin() to authenticated;

-- ── RLS ───────────────────────────────────────────────────

alter table board_members enable row level security;
alter table board_projects enable row level security;
alter table board_milestones enable row level security;
alter table board_documents enable row level security;

create policy "medlemmer leser medlemmer" on board_members
  for select using (is_board_member());
create policy "admin skriver medlemmer" on board_members
  for all using (is_board_admin()) with check (is_board_admin());
-- Medlem kan binde egen rad (user_id) og oppdatere eget last_seen_at.
create policy "medlem oppdaterer egen rad" on board_members
  for update using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  ) with check (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "medlemmer leser prosjekter" on board_projects
  for select using (is_board_member());
create policy "admin skriver prosjekter" on board_projects
  for all using (is_board_admin()) with check (is_board_admin());

create policy "medlemmer leser milepæler" on board_milestones
  for select using (is_board_member());
create policy "admin skriver milepæler" on board_milestones
  for all using (is_board_admin()) with check (is_board_admin());

create policy "medlemmer leser dokumenter" on board_documents
  for select using (is_board_member());
create policy "admin skriver dokumenter" on board_documents
  for all using (is_board_admin()) with check (is_board_admin());

-- ── Storage: privat bøtte ─────────────────────────────────

insert into storage.buckets (id, name, public)
values ('board-docs', 'board-docs', false)
on conflict (id) do nothing;

create policy "styret leser board-docs" on storage.objects
  for select using (bucket_id = 'board-docs' and is_board_member());
create policy "admin laster opp board-docs" on storage.objects
  for insert with check (bucket_id = 'board-docs' and is_board_admin());
create policy "admin sletter board-docs" on storage.objects
  for delete using (bucket_id = 'board-docs' and is_board_admin());
```

- [ ] **Step 2: Verifiser bygg uendret**

Run: `npm run build && npm run lint`
Expected: grønt (migrasjonen berører ikke frontend).

- [ ] **Step 3: Commit (etter OK fra Jamil)**

```bash
git add supabase/migrations/20260803120000_board_portal.sql
git commit -m "feat(styret): supabase-skjema for styreportal med RLS og privat storage"
```

Merk: selve kjøringen i Supabase-prosjektet `uvmthunaitnojimjkhmc` skjer i Task 12.

---

### Task 2: Typer og datalag

**Files:**
- Create: `src/types/board.ts`
- Create: `src/lib/boardApi.ts`

**Interfaces:**
- Consumes: tabell-/kolonnenavn fra Task 1, `supabase` fra `src/lib/supabase.ts`.
- Produces (brukes av alle senere tasks):
  - Typer: `BoardMember`, `BoardProject`, `BoardMilestone`, `MilestoneWithProject`, `BoardDocument`, `SinceLast`.
  - Funksjoner i `boardApi.ts`: `checkBoardEmail(email): Promise<boolean>`, `sendBoardOtp(email): Promise<{ error: Error | null }>`, `getCurrentMember(): Promise<BoardMember | null>`, `bindAndTouchMember(userId: string, email: string): Promise<void>`, `touchLastSeen(memberId: string): Promise<void>`, `listProjects(includeArchived?: boolean): Promise<BoardProject[]>`, `getProjectBySlug(slug: string): Promise<BoardProject | null>`, `listProjectMilestones(projectId: string): Promise<BoardMilestone[]>`, `listUpcomingMilestones(): Promise<MilestoneWithProject[]>`, `listDocuments(projectId?: string): Promise<BoardDocument[]>`, `getDocumentUrl(filePath: string): Promise<string>`, `getSinceLast(since: string | null): Promise<SinceLast>`, `saveProject(p: Partial<BoardProject> & { name: string; slug: string }): Promise<void>`, `deleteProject(id: string): Promise<void>`, `saveMilestone(m: { id?: string; project_id: string; title: string; target_date: string; status: BoardMilestone['status']; position: number }): Promise<void>`, `deleteMilestone(id: string): Promise<void>`, `uploadDocument(file: File, meta: { title: string; doc_type: BoardDocument['doc_type']; meeting_date: string | null; project_id: string | null }): Promise<void>`, `deleteDocument(doc: BoardDocument): Promise<void>`, `listMembers(): Promise<BoardMember[]>`, `addMember(email: string, fullName: string, role: BoardMember['role']): Promise<void>`, `removeMember(id: string): Promise<void>`.

- [ ] **Step 1: Skriv `src/types/board.ts`**

```typescript
export interface BoardMember {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: 'medlem' | 'admin';
  last_seen_at: string | null;
  created_at: string;
}

export interface BoardProject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownership_pct: number | null;
  ownership_note: string | null;
  company_name: string | null;
  company_orgnr: string | null;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type MilestoneStatus = 'planlagt' | 'pågår' | 'fullført' | 'forsinket';

export interface BoardMilestone {
  id: string;
  project_id: string;
  title: string;
  target_date: string;
  status: MilestoneStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface MilestoneWithProject extends BoardMilestone {
  board_projects: { name: string; slug: string };
}

export interface BoardDocument {
  id: string;
  project_id: string | null;
  title: string;
  doc_type: 'protokoll' | 'referat' | 'annet';
  meeting_date: string | null;
  file_path: string;
  created_at: string;
}

export interface SinceLast {
  newProjects: BoardProject[];
  changedMilestones: MilestoneWithProject[];
  newDocuments: BoardDocument[];
}
```

- [ ] **Step 2: Skriv `src/lib/boardApi.ts`**

```typescript
import { supabase } from './supabase';
import type {
  BoardDocument, BoardMember, BoardMilestone, BoardProject,
  MilestoneWithProject, SinceLast,
} from '../types/board';

function throwIf(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

// ── Auth / medlemskap ──────────────────────────────────────

export async function checkBoardEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_board_email', { p_email: email });
  throwIf(error);
  return data === true;
}

export async function sendBoardOtp(email: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/styret/callback` },
  });
  return { error: error as Error | null };
}

export async function getCurrentMember(): Promise<BoardMember | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const { data, error } = await supabase
    .from('board_members')
    .select('*')
    .or(`user_id.eq.${user.id},email.eq.${user.email.toLowerCase()}`)
    .maybeSingle();
  throwIf(error);
  return data;
}

export async function bindAndTouchMember(userId: string, email: string): Promise<void> {
  const { error } = await supabase
    .from('board_members')
    .update({ user_id: userId })
    .eq('email', email.toLowerCase())
    .is('user_id', null);
  throwIf(error);
}

export async function touchLastSeen(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('board_members')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', memberId);
  throwIf(error);
}

// ── Lesing ─────────────────────────────────────────────────

export async function listProjects(includeArchived = false): Promise<BoardProject[]> {
  let query = supabase.from('board_projects').select('*')
    .order('sort_order').order('name');
  if (!includeArchived) query = query.eq('is_archived', false);
  const { data, error } = await query;
  throwIf(error);
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<BoardProject | null> {
  const { data, error } = await supabase
    .from('board_projects').select('*').eq('slug', slug).maybeSingle();
  throwIf(error);
  return data;
}

export async function listProjectMilestones(projectId: string): Promise<BoardMilestone[]> {
  const { data, error } = await supabase
    .from('board_milestones').select('*')
    .eq('project_id', projectId).order('position');
  throwIf(error);
  return data ?? [];
}

export async function listUpcomingMilestones(): Promise<MilestoneWithProject[]> {
  const { data, error } = await supabase
    .from('board_milestones')
    .select('*, board_projects!inner(name, slug)')
    .neq('status', 'fullført')
    .eq('board_projects.is_archived', false)
    .order('target_date');
  throwIf(error);
  return (data ?? []) as MilestoneWithProject[];
}

export async function listDocuments(projectId?: string): Promise<BoardDocument[]> {
  let query = supabase.from('board_documents').select('*')
    .order('meeting_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  throwIf(error);
  return data ?? [];
}

export async function getDocumentUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('board-docs').createSignedUrl(filePath, 300);
  throwIf(error);
  return data!.signedUrl;
}

// «Siden sist» — kalles med last_seen_at LEST FØR touchLastSeen (spec, justering B).
export async function getSinceLast(since: string | null): Promise<SinceLast> {
  if (!since) return { newProjects: [], changedMilestones: [], newDocuments: [] };
  const [projects, milestones, documents] = await Promise.all([
    supabase.from('board_projects').select('*')
      .gt('created_at', since).eq('is_archived', false),
    supabase.from('board_milestones')
      .select('*, board_projects!inner(name, slug)')
      .gt('updated_at', since).eq('board_projects.is_archived', false),
    supabase.from('board_documents').select('*').gt('created_at', since),
  ]);
  throwIf(projects.error);
  throwIf(milestones.error);
  throwIf(documents.error);
  return {
    newProjects: projects.data ?? [],
    changedMilestones: (milestones.data ?? []) as MilestoneWithProject[],
    newDocuments: documents.data ?? [],
  };
}

// ── Admin-skriving (RLS håndhever is_board_admin) ──────────

export async function saveProject(
  p: Partial<BoardProject> & { name: string; slug: string },
): Promise<void> {
  const { error } = await supabase.from('board_projects')
    .upsert(p, { onConflict: 'id' });
  throwIf(error);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('board_projects').delete().eq('id', id);
  throwIf(error);
}

export async function saveMilestone(m: {
  id?: string; project_id: string; title: string;
  target_date: string; status: BoardMilestone['status']; position: number;
}): Promise<void> {
  const { error } = await supabase.from('board_milestones')
    .upsert(m, { onConflict: 'id' });
  throwIf(error);
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await supabase.from('board_milestones').delete().eq('id', id);
  throwIf(error);
}

export async function uploadDocument(file: File, meta: {
  title: string; doc_type: BoardDocument['doc_type'];
  meeting_date: string | null; project_id: string | null;
}): Promise<void> {
  if (file.type !== 'application/pdf') {
    throw new Error('Kun PDF-filer kan lastes opp.');
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${crypto.randomUUID()}/${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from('board-docs')
    .upload(filePath, file, { contentType: 'application/pdf' });
  throwIf(uploadError);
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('board_documents').insert({
    ...meta, file_path: filePath, uploaded_by: user?.id ?? null,
  });
  if (error) {
    await supabase.storage.from('board-docs').remove([filePath]);
    throw new Error(error.message);
  }
}

export async function deleteDocument(doc: BoardDocument): Promise<void> {
  const { error } = await supabase.from('board_documents').delete().eq('id', doc.id);
  throwIf(error);
  await supabase.storage.from('board-docs').remove([doc.file_path]);
}

export async function listMembers(): Promise<BoardMember[]> {
  const { data, error } = await supabase.from('board_members')
    .select('*').order('full_name');
  throwIf(error);
  return data ?? [];
}

export async function addMember(
  email: string, fullName: string, role: BoardMember['role'],
): Promise<void> {
  const { error } = await supabase.from('board_members')
    .insert({ email: email.trim().toLowerCase(), full_name: fullName, role });
  throwIf(error);
}

export async function removeMember(id: string): Promise<void> {
  const { error } = await supabase.from('board_members').delete().eq('id', id);
  throwIf(error);
}
```

- [ ] **Step 3: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt. (Ubrukte eksporter er OK på dette stadiet.)

- [ ] **Step 4: Commit (etter OK fra Jamil)**

```bash
git add src/types/board.ts src/lib/boardApi.ts
git commit -m "feat(styret): typer og datalag for styreportalen"
```

---

### Task 3: Medlemshook og beskyttet rute

**Files:**
- Create: `src/hooks/useBoardMember.ts`
- Create: `src/components/styret/BoardProtectedRoute.tsx`

**Interfaces:**
- Consumes: `useAuth()` fra `src/contexts/AuthContext.tsx`, `getCurrentMember` fra Task 2.
- Produces: `useBoardMember(): { member: BoardMember | null; loading: boolean }`; `<BoardProtectedRoute>{children}</BoardProtectedRoute>` som sender ikke-medlemmer til `/styret`.

- [ ] **Step 1: Skriv `src/hooks/useBoardMember.ts`**

```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentMember } from '../lib/boardApi';
import type { BoardMember } from '../types/board';

export function useBoardMember(): { member: BoardMember | null; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<BoardMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setMember(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getCurrentMember()
      .then((m) => { if (!cancelled) setMember(m); })
      .catch(() => { if (!cancelled) setMember(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return { member, loading };
}
```

- [ ] **Step 2: Skriv `src/components/styret/BoardProtectedRoute.tsx`**

```typescript
import { Navigate } from 'react-router-dom';
import { useBoardMember } from '../../hooks/useBoardMember';

export default function BoardProtectedRoute({ children }: { children: React.ReactNode }) {
  const { member, loading } = useBoardMember();

  if (loading) {
    return (
      <div className="deck-page flex items-center justify-center min-h-screen">
        <div className="deck-kicker">Laster …</div>
      </div>
    );
  }

  // Ikke-medlemmer (også innloggede investorer) sendes til /styret — ikke /register.
  if (!member) return <Navigate to="/styret" replace />;

  return <>{children}</>;
}
```

- [ ] **Step 3: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt.

- [ ] **Step 4: Commit (etter OK fra Jamil)**

```bash
git add src/hooks/useBoardMember.ts src/components/styret/BoardProtectedRoute.tsx
git commit -m "feat(styret): medlemshook og beskyttet rute"
```

---

### Task 4: Innlogging og egen callback

**Files:**
- Create: `src/pages/styret/BoardLanding.tsx`
- Create: `src/pages/styret/BoardCallback.tsx`

**Interfaces:**
- Consumes: `checkBoardEmail`, `sendBoardOtp`, `bindAndTouchMember` fra Task 2; `useBoardMember` fra Task 3.
- Produces: `BoardLanding` (viser login-skjema, eller `<BoardDashboard />` når medlem — Task 5 leverer den; frem til Task 5 rendres en placeholder-tekst «Styreportal»), `BoardCallback`.

- [ ] **Step 1: Skriv `src/pages/styret/BoardLanding.tsx`**

```typescript
import { useState, type FormEvent } from 'react';
import { useBoardMember } from '../../hooks/useBoardMember';
import { checkBoardEmail, sendBoardOtp } from '../../lib/boardApi';
import BoardDashboard from './BoardDashboard';

type Phase = 'idle' | 'sending' | 'sent';

export default function BoardLanding() {
  const { member, loading } = useBoardMember();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="deck-page flex items-center justify-center min-h-screen">
        <div className="deck-kicker">Laster …</div>
      </div>
    );
  }

  if (member) return <BoardDashboard member={member} />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhase('sending');
    try {
      const allowed = await checkBoardEmail(email);
      if (!allowed) {
        setError('Denne e-posten har ikke tilgang.');
        setPhase('idle');
        return;
      }
      const { error: otpError } = await sendBoardOtp(email);
      if (otpError) {
        setError('Kunne ikke sende innloggingslenke. Prøv igjen.');
        setPhase('idle');
        return;
      }
      setPhase('sent');
    } catch {
      setError('Noe gikk galt. Prøv igjen.');
      setPhase('idle');
    }
  };

  return (
    <div className="deck-page flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md text-center">
        <p className="deck-eyebrow justify-center">Aprikos Venture</p>
        <h1 className="deck-display text-4xl mt-4">
          Styre<span className="deck-italic-gold">portal</span>
        </h1>
        <p className="deck-lede mt-4">For det kommende styret i Aprikos Venture.</p>
        {phase === 'sent' ? (
          <p className="deck-lede mt-8">
            Innloggingslenke sendt til <span className="deck-italic-gold">{email}</span>.
            Sjekk innboksen din.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="deck-field"
              autoComplete="email"
            />
            <button type="submit" className="deck-btn-primary justify-center" disabled={phase === 'sending'}>
              {phase === 'sending' ? 'Sender …' : 'Send innloggingslenke'}
            </button>
            {error && <p className="deck-kicker" style={{ color: '#c94a4a' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
```

Merk: sjekk hvordan `.deck-field` brukes i `src/components/register/`-komponentene og kopier samme input-oppsett (klassen kan ligge på en wrapper). Placeholder for Task 5: opprett `src/pages/styret/BoardDashboard.tsx` midlertidig med:

```typescript
import type { BoardMember } from '../../types/board';

export default function BoardDashboard({ member }: { member: BoardMember }) {
  return (
    <div className="deck-page min-h-screen flex items-center justify-center">
      <p className="deck-lede">Velkommen, {member.full_name}. Innhold kommer.</p>
    </div>
  );
}
```

- [ ] **Step 2: Skriv `src/pages/styret/BoardCallback.tsx`**

Samme sesjonsmønstre som `src/components/auth/AuthCallback.tsx` (code exchange → hash-tokens → retry), men: binder `board_members.user_id`, navigerer alltid til `/styret`, og rører ALDRI `investors`.

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { bindAndTouchMember } from '../../lib/boardApi';

export default function BoardCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finish = async (userId: string, email: string) => {
      try {
        await bindAndTouchMember(userId, email);
      } catch {
        // Binding er best-effort; medlemssjekken i BoardLanding matcher også på e-post.
      }
      navigate('/styret', { replace: true });
    };

    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await finish(session.user.id, session.user.email);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeError) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            await finish(user.id, user.email);
            return;
          }
        }
      }

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!sessionError) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            await finish(user.id, user.email);
            return;
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { data: { session: retrySession } } = await supabase.auth.getSession();
      if (retrySession?.user?.email) {
        await finish(retrySession.user.id, retrySession.user.email);
        return;
      }

      setError('Innloggingslenken er utløpt. Be om en ny.');
      setTimeout(() => navigate('/styret'), 3000);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="deck-page flex items-center justify-center min-h-screen">
      {error ? (
        <p className="deck-lede" style={{ color: '#c94a4a' }}>{error}</p>
      ) : (
        <p className="deck-kicker">Verifiserer innloggingslenken …</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Legg til ruter i `src/App.tsx`**

Modify `src/App.tsx` — legg til imports og ruter (behold alt eksisterende uendret):

```typescript
import BoardLanding from './pages/styret/BoardLanding';
import BoardCallback from './pages/styret/BoardCallback';
```

```tsx
<Route path="/styret" element={<BoardLanding />} />
<Route path="/styret/callback" element={<BoardCallback />} />
```

- [ ] **Step 4: Legg til eksplisitt redirect i `public/_redirects`**

Øverst i filen (før `/*`-catch-all), på linje med `/deck/*`:

```
/styret/*  /index.html  200
```

- [ ] **Step 5: Verifiser manuelt**

Run: `npm run build && npm run lint`, deretter `npm run dev`.
Manuelt: åpne `http://localhost:5173/styret` → login-skjema vises. Skriv en e-post som IKKE er i allowlisten → «Denne e-posten har ikke tilgang.» (Krever at Task 12-migrasjonen er kjørt i Supabase; hvis ikke, utsett den manuelle delen til Task 12.) Verifiser at `/register` og `/deck` oppfører seg som før.

- [ ] **Step 6: Commit (etter OK fra Jamil)**

```bash
git add src/pages/styret/BoardLanding.tsx src/pages/styret/BoardCallback.tsx src/pages/styret/BoardDashboard.tsx src/App.tsx public/_redirects
git commit -m "feat(styret): innlogging med allowlist-sjekk og egen callback"
```

---

### Task 5: Forside — siden sist, tidslinje, prosjektgrid

**Files:**
- Modify: `src/pages/styret/BoardDashboard.tsx` (erstatt placeholderen fra Task 4)
- Create: `src/components/styret/SinceLastPanel.tsx`
- Create: `src/components/styret/UpcomingMilestones.tsx`
- Create: `src/components/styret/ProjectCard.tsx`

**Interfaces:**
- Consumes: `getSinceLast`, `touchLastSeen`, `listProjects`, `listUpcomingMilestones`, `listProjectMilestones` fra Task 2.
- Produces: `<BoardDashboard member={BoardMember} />` — brukes av `BoardLanding` (Task 4). `<SinceLastPanel data={SinceLast} firstVisit={boolean} />`, `<UpcomingMilestones items={MilestoneWithProject[]} />`, `<ProjectCard project={BoardProject} nextMilestone={BoardMilestone | null} />`.

- [ ] **Step 1: Skriv `src/components/styret/SinceLastPanel.tsx`**

```typescript
import { Link } from 'react-router-dom';
import type { SinceLast } from '../../types/board';

export default function SinceLastPanel({ data, firstVisit }: { data: SinceLast; firstVisit: boolean }) {
  const empty = data.newProjects.length === 0
    && data.changedMilestones.length === 0
    && data.newDocuments.length === 0;

  return (
    <section className="border border-[var(--deck-rule)] p-6">
      <p className="deck-eyebrow">Siden sist</p>
      {firstVisit ? (
        <p className="deck-lede mt-3">Velkommen til Styreportalen. Dette er ditt første besøk.</p>
      ) : empty ? (
        <p className="deck-lede mt-3">Ingenting nytt siden sist.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {data.newProjects.map((p) => (
            <li key={p.id} className="deck-lede">
              Nytt prosjekt: <Link to={`/styret/prosjekt/${p.slug}`} className="deck-italic-gold">{p.name}</Link>
            </li>
          ))}
          {data.changedMilestones.map((m) => (
            <li key={m.id} className="deck-lede">
              Milepæl oppdatert i <Link to={`/styret/prosjekt/${m.board_projects.slug}`} className="deck-italic-gold">{m.board_projects.name}</Link>: {m.title}
            </li>
          ))}
          {data.newDocuments.map((d) => (
            <li key={d.id} className="deck-lede">
              Nytt dokument: <Link to="/styret/dokumenter" className="deck-italic-gold">{d.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Skriv `src/components/styret/UpcomingMilestones.tsx`**

Viser maks 8, «Se alle»-knapp utvider. Datoformat: `new Date(x).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })` — bruk samme format i hele portalen.

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneWithProject } from '../../types/board';

const STATUS_COLOR: Record<string, string> = {
  planlagt: 'var(--deck-ink-dim)',
  'pågår': 'var(--deck-gold)',
  forsinket: '#c94a4a',
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function UpcomingMilestones({ items }: { items: MilestoneWithProject[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 8);

  return (
    <section className="border border-[var(--deck-rule)] p-6">
      <p className="deck-eyebrow">Kommende milepæler</p>
      {items.length === 0 ? (
        <p className="deck-lede mt-3">Ingen kommende milepæler.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {visible.map((m) => (
            <li key={m.id} className="flex items-baseline gap-4">
              <span className="deck-kicker w-36 shrink-0">{formatDate(m.target_date)}</span>
              <span className="deck-lede">
                <Link to={`/styret/prosjekt/${m.board_projects.slug}`} className="deck-italic-gold">
                  {m.board_projects.name}
                </Link>
                {' — '}{m.title}
              </span>
              <span className="deck-kicker ml-auto shrink-0" style={{ color: STATUS_COLOR[m.status] }}>
                {m.status}
              </span>
            </li>
          ))}
        </ol>
      )}
      {items.length > 8 && !showAll && (
        <button className="deck-kicker mt-4 underline" onClick={() => setShowAll(true)}>
          Se alle ({items.length})
        </button>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Skriv `src/components/styret/ProjectCard.tsx`**

```typescript
import { Link } from 'react-router-dom';
import type { BoardMilestone, BoardProject } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

function ownershipLabel(p: BoardProject): string {
  if (p.ownership_pct !== null) return `${p.ownership_pct} % eierandel`;
  return p.ownership_note ?? 'Eierandel ikke avklart';
}

export default function ProjectCard({ project, nextMilestone }: {
  project: BoardProject;
  nextMilestone: BoardMilestone | null;
}) {
  return (
    <Link
      to={`/styret/prosjekt/${project.slug}`}
      className="block border border-[var(--deck-rule)] p-6 hover:border-[var(--deck-rule-strong)] transition-colors"
    >
      <h3 className="deck-display text-2xl">{project.name}</h3>
      <p className="deck-kicker mt-2" style={{ color: 'var(--deck-gold)' }}>
        {ownershipLabel(project)}
      </p>
      {project.is_archived && <p className="deck-kicker mt-1">Arkivert</p>}
      {nextMilestone && (
        <p className="deck-lede mt-4 text-sm">
          Neste: {nextMilestone.title} · {formatDate(nextMilestone.target_date)}
        </p>
      )}
    </Link>
  );
}
```

- [ ] **Step 4: Erstatt `src/pages/styret/BoardDashboard.tsx`**

Kritisk rekkefølge (spec, justering B): les `member.last_seen_at` og hent «siden sist»-data FØR `touchLastSeen` kalles. `useRef`-guard mot StrictMode-dobbelkjøring.

```typescript
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getSinceLast, listProjects, listProjectMilestones,
  listUpcomingMilestones, touchLastSeen,
} from '../../lib/boardApi';
import type {
  BoardMember, BoardMilestone, BoardProject, MilestoneWithProject, SinceLast,
} from '../../types/board';
import SinceLastPanel from '../../components/styret/SinceLastPanel';
import UpcomingMilestones from '../../components/styret/UpcomingMilestones';
import ProjectCard from '../../components/styret/ProjectCard';

export default function BoardDashboard({ member }: { member: BoardMember }) {
  const { signOut } = useAuth();
  const [sinceLast, setSinceLast] = useState<SinceLast | null>(null);
  const [upcoming, setUpcoming] = useState<MilestoneWithProject[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [nextByProject, setNextByProject] = useState<Record<string, BoardMilestone | null>>({});
  const [showArchived, setShowArchived] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Les «siden sist» fra verdien slik den var ved innlogging …
        const since = await getSinceLast(member.last_seen_at);
        setSinceLast(since);
        // 2) … og oppdater tidsstempelet ETTERPÅ (én gang per økt).
        if (!touched.current) {
          touched.current = true;
          touchLastSeen(member.id).catch(() => {});
        }
        const [upcomingData, projectData] = await Promise.all([
          listUpcomingMilestones(),
          listProjects(true),
        ]);
        setUpcoming(upcomingData);
        setProjects(projectData);
        const next: Record<string, BoardMilestone | null> = {};
        await Promise.all(projectData.map(async (p) => {
          const ms = await listProjectMilestones(p.id);
          const open = ms.filter((m) => m.status !== 'fullført')
            .sort((a, b) => a.target_date.localeCompare(b.target_date));
          next[p.id] = open[0] ?? null;
        }));
        setNextByProject(next);
      } catch {
        setError('Kunne ikke laste innholdet. Last siden på nytt.');
      }
    };
    load();
  }, [member.id, member.last_seen_at]);

  const visibleProjects = projects.filter((p) => showArchived || !p.is_archived);

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="deck-eyebrow">Aprikos Venture</p>
            <h1 className="deck-display text-4xl mt-2">
              Styre<span className="deck-italic-gold">portal</span>
            </h1>
            <p className="deck-kicker mt-2">Det kommende styret</p>
          </div>
          <nav className="flex gap-6 items-baseline">
            <Link to="/styret/dokumenter" className="deck-kicker underline">Dokumenter</Link>
            {member.role === 'admin' && (
              <Link to="/styret/admin" className="deck-kicker underline">Admin</Link>
            )}
            <button className="deck-kicker underline" onClick={() => signOut()}>Logg ut</button>
          </nav>
        </header>

        {error && <p className="deck-lede" style={{ color: '#c94a4a' }}>{error}</p>}
        {!error && sinceLast === null && <p className="deck-kicker">Laster …</p>}

        {sinceLast !== null && (
          <>
            <SinceLastPanel data={sinceLast} firstVisit={member.last_seen_at === null} />
            <UpcomingMilestones items={upcoming} />
            <section>
              <div className="flex items-baseline justify-between">
                <p className="deck-eyebrow">Prosjekter</p>
                <button className="deck-kicker underline" onClick={() => setShowArchived((v) => !v)}>
                  {showArchived ? 'Skjul arkiverte' : 'Vis arkiverte'}
                </button>
              </div>
              {visibleProjects.length === 0 ? (
                <p className="deck-lede mt-3">Ingen prosjekter ennå.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {visibleProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} nextMilestone={nextByProject[p.id] ?? null} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt. Manuell sjekk utsettes til Task 12 (krever data i Supabase).

- [ ] **Step 6: Commit (etter OK fra Jamil)**

```bash
git add src/pages/styret/BoardDashboard.tsx src/components/styret/SinceLastPanel.tsx src/components/styret/UpcomingMilestones.tsx src/components/styret/ProjectCard.tsx
git commit -m "feat(styret): forside med siden sist, milepælstidslinje og prosjektgrid"
```

---

### Task 6: Prosjektside med milepælsstegviser

**Files:**
- Create: `src/components/styret/MilestoneStepper.tsx`
- Create: `src/pages/styret/BoardProject.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug`, `listProjectMilestones`, `listDocuments`, `getDocumentUrl` fra Task 2; `BoardProtectedRoute` fra Task 3; `formatDate` fra Task 5.
- Produces: rute `/styret/prosjekt/:slug`; `<MilestoneStepper milestones={BoardMilestone[]} />` (gjenbrukes ikke av andre, men holdes egen fil for lesbarhet).

- [ ] **Step 1: Skriv `src/components/styret/MilestoneStepper.tsx`**

Tre faste plasser (posisjon 1–3). Fylte/gylne noder etter status; datoer merket «anslått» når status ≠ `fullført`.

```typescript
import type { BoardMilestone } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

const NODE_STYLE: Record<string, { background: string; border: string }> = {
  'fullført': { background: 'var(--deck-gold)', border: 'var(--deck-gold)' },
  'pågår': { background: 'var(--deck-bg)', border: 'var(--deck-gold)' },
  forsinket: { background: 'var(--deck-bg)', border: '#c94a4a' },
  planlagt: { background: 'var(--deck-bg)', border: 'var(--deck-rule-strong)' },
};

export default function MilestoneStepper({ milestones }: { milestones: BoardMilestone[] }) {
  const slots = [1, 2, 3].map(
    (pos) => milestones.find((m) => m.position === pos) ?? null,
  );

  return (
    <div className="grid md:grid-cols-3 gap-0 mt-6">
      {slots.map((m, i) => (
        <div key={i} className="relative px-4 pb-2 pt-6 border-t border-[var(--deck-rule-strong)]">
          <span
            className="absolute -top-[7px] left-4 inline-block w-3.5 h-3.5 rounded-full border-2"
            style={m ? NODE_STYLE[m.status] : NODE_STYLE.planlagt}
          />
          {m ? (
            <>
              <p className="deck-kicker" style={{ color: 'var(--deck-gold)' }}>
                Milepæl {m.position} · {m.status}
              </p>
              <p className="deck-lede mt-1">{m.title}</p>
              <p className="deck-kicker mt-2">
                {formatDate(m.target_date)}
                {m.status !== 'fullført' && ' (anslått)'}
              </p>
            </>
          ) : (
            <p className="deck-kicker">Ikke definert</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Skriv `src/pages/styret/BoardProject.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getDocumentUrl, getProjectBySlug, listDocuments, listProjectMilestones,
} from '../../lib/boardApi';
import type { BoardDocument, BoardMilestone, BoardProject as Project } from '../../types/board';
import MilestoneStepper from '../../components/styret/MilestoneStepper';
import { formatDate } from '../../components/styret/UpcomingMilestones';

export default function BoardProject() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<BoardMilestone[]>([]);
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'notfound' | 'error'>('loading');

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug)
      .then(async (p) => {
        if (!p) { setState('notfound'); return; }
        setProject(p);
        const [ms, docs] = await Promise.all([
          listProjectMilestones(p.id),
          listDocuments(p.id),
        ]);
        setMilestones(ms);
        setDocuments(docs);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, [slug]);

  const openDocument = async (doc: BoardDocument) => {
    // Signert lenke hentes ferskt ved hvert klikk — utløp er dermed uproblematisk.
    const url = await getDocumentUrl(doc.file_path);
    window.open(url, '_blank', 'noopener');
  };

  if (state === 'loading') {
    return <div className="deck-page min-h-screen flex items-center justify-center"><p className="deck-kicker">Laster …</p></div>;
  }
  if (state === 'notfound' || state === 'error' || !project) {
    return (
      <div className="deck-page min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="deck-lede">{state === 'notfound' ? 'Fant ikke prosjektet.' : 'Kunne ikke laste prosjektet.'}</p>
        <Link to="/styret" className="deck-kicker underline">Til forsiden</Link>
      </div>
    );
  }

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <Link to="/styret" className="deck-kicker underline">← Styreportal</Link>
        <header>
          <h1 className="deck-display text-5xl">{project.name}</h1>
          <p className="deck-kicker mt-3" style={{ color: 'var(--deck-gold)' }}>
            {project.ownership_pct !== null ? `${project.ownership_pct} % eierandel` : 'Eierandel ikke avklart'}
            {project.ownership_note && ` · ${project.ownership_note}`}
          </p>
          {project.company_name && (
            <p className="deck-kicker mt-1">
              {project.company_name}{project.company_orgnr && ` · org.nr ${project.company_orgnr}`}
            </p>
          )}
          {!project.company_name && (
            <p className="deck-kicker mt-1">Prosjekt — ikke etablert som eget selskap</p>
          )}
        </header>

        {project.description && <p className="deck-lede">{project.description}</p>}

        <section>
          <p className="deck-eyebrow">De tre viktigste milepælene</p>
          <MilestoneStepper milestones={milestones} />
        </section>

        <section>
          <p className="deck-eyebrow">Dokumenter</p>
          {documents.length === 0 ? (
            <p className="deck-lede mt-3">Ingen dokumenter ennå.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {documents.map((d) => (
                <li key={d.id}>
                  <button className="deck-lede underline text-left" onClick={() => openDocument(d)}>
                    {d.title}
                  </button>
                  <span className="deck-kicker ml-3">
                    {d.doc_type}{d.meeting_date && ` · ${formatDate(d.meeting_date)}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Legg til rute i `src/App.tsx`**

```typescript
import BoardProject from './pages/styret/BoardProject';
import BoardProtectedRoute from './components/styret/BoardProtectedRoute';
```

```tsx
<Route
  path="/styret/prosjekt/:slug"
  element={
    <BoardProtectedRoute>
      <BoardProject />
    </BoardProtectedRoute>
  }
/>
```

- [ ] **Step 4: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt.

- [ ] **Step 5: Commit (etter OK fra Jamil)**

```bash
git add src/components/styret/MilestoneStepper.tsx src/pages/styret/BoardProject.tsx src/App.tsx
git commit -m "feat(styret): prosjektside med milepælsstegviser og dokumenter"
```

---

### Task 7: Dokumentside

**Files:**
- Create: `src/pages/styret/BoardDocuments.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `listDocuments`, `listProjects`, `getDocumentUrl` fra Task 2; `BoardProtectedRoute`; `formatDate`.
- Produces: rute `/styret/dokumenter` med filter på type og prosjekt.

- [ ] **Step 1: Skriv `src/pages/styret/BoardDocuments.tsx`**

```typescript
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocumentUrl, listDocuments, listProjects } from '../../lib/boardApi';
import type { BoardDocument, BoardProject } from '../../types/board';
import { formatDate } from '../../components/styret/UpcomingMilestones';

const TYPES = ['alle', 'protokoll', 'referat', 'annet'] as const;

export default function BoardDocuments() {
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [typeFilter, setTypeFilter] = useState<(typeof TYPES)[number]>('alle');
  const [projectFilter, setProjectFilter] = useState<string>('alle');
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    Promise.all([listDocuments(), listProjects(true)])
      .then(([docs, projs]) => {
        setDocuments(docs);
        setProjects(projs);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const filtered = useMemo(() => documents.filter((d) => {
    if (typeFilter !== 'alle' && d.doc_type !== typeFilter) return false;
    if (projectFilter === 'alle') return true;
    if (projectFilter === 'selskap') return d.project_id === null;
    return d.project_id === projectFilter;
  }), [documents, typeFilter, projectFilter]);

  const projectName = (id: string | null) =>
    id === null ? 'Selskapsnivå' : projects.find((p) => p.id === id)?.name ?? '';

  const openDocument = async (doc: BoardDocument) => {
    const url = await getDocumentUrl(doc.file_path);
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/styret" className="deck-kicker underline">← Styreportal</Link>
        <h1 className="deck-display text-4xl">Protokoller og <span className="deck-italic-gold">referater</span></h1>

        <div className="flex flex-wrap gap-6">
          <label className="deck-kicker flex items-center gap-2">
            Type
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as (typeof TYPES)[number])}
              className="bg-transparent border border-[var(--deck-rule)] p-2">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="deck-kicker flex items-center gap-2">
            Prosjekt
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-transparent border border-[var(--deck-rule)] p-2">
              <option value="alle">alle</option>
              <option value="selskap">selskapsnivå</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>

        {state === 'loading' && <p className="deck-kicker">Laster …</p>}
        {state === 'error' && <p className="deck-lede" style={{ color: '#c94a4a' }}>Kunne ikke laste dokumentene.</p>}
        {state === 'ready' && (filtered.length === 0 ? (
          <p className="deck-lede">Ingen dokumenter ennå.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((d) => (
              <li key={d.id} className="border-b border-[var(--deck-rule)] pb-3">
                <button className="deck-lede underline text-left" onClick={() => openDocument(d)}>
                  {d.title}
                </button>
                <p className="deck-kicker mt-1">
                  {d.doc_type} · {projectName(d.project_id)}
                  {d.meeting_date && ` · ${formatDate(d.meeting_date)}`}
                </p>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Legg til rute i `src/App.tsx`**

```typescript
import BoardDocuments from './pages/styret/BoardDocuments';
```

```tsx
<Route
  path="/styret/dokumenter"
  element={
    <BoardProtectedRoute>
      <BoardDocuments />
    </BoardProtectedRoute>
  }
/>
```

- [ ] **Step 3: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt.

- [ ] **Step 4: Commit (etter OK fra Jamil)**

```bash
git add src/pages/styret/BoardDocuments.tsx src/App.tsx
git commit -m "feat(styret): dokumentside med filter"
```

---

### Task 8: Admin — prosjekter og milepæler

**Files:**
- Create: `src/pages/styret/BoardAdmin.tsx`
- Create: `src/components/styret/AdminProjects.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useBoardMember`; `listProjects`, `saveProject`, `deleteProject`, `listProjectMilestones`, `saveMilestone`, `deleteMilestone` fra Task 2.
- Produces: rute `/styret/admin` (admin-gate i komponenten: `member.role !== 'admin'` → `Navigate to='/styret'`); `<BoardAdmin />` med faner som Task 9/10 utvider (fanestruktur: `const [tab, setTab] = useState<'prosjekter' | 'dokumenter' | 'medlemmer'>('prosjekter')`).

- [ ] **Step 1: Skriv `src/pages/styret/BoardAdmin.tsx`**

```typescript
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBoardMember } from '../../hooks/useBoardMember';
import AdminProjects from '../../components/styret/AdminProjects';

const TABS = ['prosjekter', 'dokumenter', 'medlemmer'] as const;
type Tab = (typeof TABS)[number];

export default function BoardAdmin() {
  const { member, loading } = useBoardMember();
  const [tab, setTab] = useState<Tab>('prosjekter');

  if (loading) {
    return <div className="deck-page min-h-screen flex items-center justify-center"><p className="deck-kicker">Laster …</p></div>;
  }
  if (!member || member.role !== 'admin') return <Navigate to="/styret" replace />;

  return (
    <div className="deck-page min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/styret" className="deck-kicker underline">← Styreportal</Link>
        <h1 className="deck-display text-4xl">Admin</h1>
        <nav className="flex gap-6">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="deck-kicker"
              style={tab === t ? { color: 'var(--deck-gold)' } : undefined}>
              {t}
            </button>
          ))}
        </nav>
        {tab === 'prosjekter' && <AdminProjects />}
        {tab === 'dokumenter' && <p className="deck-lede">Kommer i neste task.</p>}
        {tab === 'medlemmer' && <p className="deck-lede">Kommer i neste task.</p>}
      </div>
    </div>
  );
}
```

(Placeholder-tekstene erstattes i Task 9 og 10.)

- [ ] **Step 2: Skriv `src/components/styret/AdminProjects.tsx`**

Ett skjema per prosjekt (utvid/kollaps), tre faste milepælsplasser per prosjekt, «Nytt prosjekt»-knapp. Slug genereres fra navn ved nyopprettelse.

```typescript
import { useEffect, useState } from 'react';
import {
  deleteMilestone, deleteProject, listProjectMilestones, listProjects,
  saveMilestone, saveProject,
} from '../../lib/boardApi';
import type { BoardMilestone, BoardProject, MilestoneStatus } from '../../types/board';

const STATUSES: MilestoneStatus[] = ['planlagt', 'pågår', 'fullført', 'forsinket'];

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[æå]/g, 'a').replace(/ø/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface MilestoneDraft {
  id?: string;
  title: string;
  target_date: string;
  status: MilestoneStatus;
}

function ProjectEditor({ project, onSaved }: { project: BoardProject | null; onSaved: () => void }) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [ownershipPct, setOwnershipPct] = useState(project?.ownership_pct?.toString() ?? '');
  const [ownershipNote, setOwnershipNote] = useState(project?.ownership_note ?? '');
  const [companyName, setCompanyName] = useState(project?.company_name ?? '');
  const [companyOrgnr, setCompanyOrgnr] = useState(project?.company_orgnr ?? '');
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);
  const [isArchived, setIsArchived] = useState(project?.is_archived ?? false);
  const [slots, setSlots] = useState<(MilestoneDraft | null)[]>([null, null, null]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    listProjectMilestones(project.id).then((ms) => {
      const next: (MilestoneDraft | null)[] = [null, null, null];
      ms.forEach((m: BoardMilestone) => {
        next[m.position - 1] = {
          id: m.id, title: m.title, target_date: m.target_date, status: m.status,
        };
      });
      setSlots(next);
    });
  }, [project]);

  const setSlot = (i: number, draft: MilestoneDraft | null) => {
    setSlots((prev) => prev.map((s, j) => (j === i ? draft : s)));
  };

  const handleSave = async () => {
    setStatus(null);
    try {
      const payload: Partial<BoardProject> & { name: string; slug: string } = {
        name,
        slug: project?.slug ?? slugify(name),
        description: description || null,
        ownership_pct: ownershipPct === '' ? null : Number(ownershipPct),
        ownership_note: ownershipNote || null,
        company_name: companyName || null,
        company_orgnr: companyOrgnr || null,
        sort_order: sortOrder,
        is_archived: isArchived,
      };
      if (project) payload.id = project.id;
      await saveProject(payload);
      setStatus('Lagret.');
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const handleSaveMilestone = async (i: number) => {
    if (!project) { setStatus('Lagre prosjektet først.'); return; }
    const draft = slots[i];
    if (!draft || !draft.title || !draft.target_date) return;
    try {
      await saveMilestone({
        id: draft.id, project_id: project.id, title: draft.title,
        target_date: draft.target_date, status: draft.status, position: i + 1,
      });
      setStatus(`Milepæl ${i + 1} lagret.`);
      onSaved();
    } catch (e) {
      setStatus(`Feil: ${(e as Error).message}`);
    }
  };

  const handleDeleteMilestone = async (i: number) => {
    const draft = slots[i];
    if (draft?.id) await deleteMilestone(draft.id);
    setSlot(i, null);
    onSaved();
  };

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="border border-[var(--deck-rule)] p-6 space-y-4">
      <input className={field} placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className={field} placeholder="Beskrivelse" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      <div className="grid md:grid-cols-2 gap-4">
        <input className={field} placeholder="Eierandel % (tom hvis uavklart)" type="number" min={0} max={100} step="0.01"
          value={ownershipPct} onChange={(e) => setOwnershipPct(e.target.value)} />
        <input className={field} placeholder="Eierandelsnotat (f.eks. 50/50 JV med NBX)"
          value={ownershipNote} onChange={(e) => setOwnershipNote(e.target.value)} />
        <input className={field} placeholder="Selskapsnavn (hvis stiftet)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <input className={field} placeholder="Org.nr" value={companyOrgnr} onChange={(e) => setCompanyOrgnr(e.target.value)} />
        <input className={field} placeholder="Sortering" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        <label className="deck-kicker flex items-center gap-2">
          <input type="checkbox" checked={isArchived} onChange={(e) => setIsArchived(e.target.checked)} />
          Arkivert
        </label>
      </div>
      <button className="deck-btn-primary" onClick={handleSave}>
        {project ? 'Lagre prosjekt' : 'Opprett prosjekt'}
      </button>

      {project && (
        <div className="space-y-4 pt-4 border-t border-[var(--deck-rule)]">
          <p className="deck-eyebrow">Milepæler (maks 3)</p>
          {[0, 1, 2].map((i) => {
            const draft = slots[i];
            return (
              <div key={i} className="grid md:grid-cols-4 gap-2 items-center">
                <input className={field} placeholder={`Milepæl ${i + 1}`}
                  value={draft?.title ?? ''}
                  onChange={(e) => setSlot(i, { ...(draft ?? { target_date: '', status: 'planlagt' }), title: e.target.value })} />
                <input className={field} type="date"
                  value={draft?.target_date ?? ''}
                  onChange={(e) => setSlot(i, { ...(draft ?? { title: '', status: 'planlagt' }), target_date: e.target.value })} />
                <select className={field} value={draft?.status ?? 'planlagt'}
                  onChange={(e) => setSlot(i, { ...(draft ?? { title: '', target_date: '' }), status: e.target.value as MilestoneStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-3">
                  <button className="deck-kicker underline" onClick={() => handleSaveMilestone(i)}>Lagre</button>
                  {draft?.id && (
                    <button className="deck-kicker underline" style={{ color: '#c94a4a' }}
                      onClick={() => handleDeleteMilestone(i)}>Slett</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {status && <p className="deck-kicker">{status}</p>}
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [openId, setOpenId] = useState<string | 'new' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    listProjects(true).then(setProjects).catch(() => setProjects([]));
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleDelete = async (p: BoardProject) => {
    if (!window.confirm(`Slette «${p.name}» og alle tilhørende milepæler?`)) return;
    await deleteProject(p.id);
    refresh();
  };

  return (
    <div className="space-y-4">
      <button className="deck-btn-primary" onClick={() => setOpenId('new')}>Nytt prosjekt</button>
      {openId === 'new' && <ProjectEditor project={null} onSaved={refresh} />}
      {projects.map((p) => (
        <div key={p.id}>
          <div className="flex items-baseline gap-4">
            <button className="deck-lede underline" onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              {p.name}{p.is_archived && ' (arkivert)'}
            </button>
            <button className="deck-kicker underline" style={{ color: '#c94a4a' }} onClick={() => handleDelete(p)}>
              Slett
            </button>
          </div>
          {openId === p.id && <ProjectEditor project={p} onSaved={refresh} />}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Legg til rute i `src/App.tsx`**

```typescript
import BoardAdmin from './pages/styret/BoardAdmin';
```

```tsx
<Route
  path="/styret/admin"
  element={
    <BoardProtectedRoute>
      <BoardAdmin />
    </BoardProtectedRoute>
  }
/>
```

- [ ] **Step 4: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt.

- [ ] **Step 5: Commit (etter OK fra Jamil)**

```bash
git add src/pages/styret/BoardAdmin.tsx src/components/styret/AdminProjects.tsx src/App.tsx
git commit -m "feat(styret): adminfane for prosjekter og milepæler"
```

---

### Task 9: Admin — dokumentopplasting

**Files:**
- Create: `src/components/styret/AdminDocuments.tsx`
- Modify: `src/pages/styret/BoardAdmin.tsx` (bytt placeholder mot komponenten)

**Interfaces:**
- Consumes: `listDocuments`, `listProjects`, `uploadDocument`, `deleteDocument` fra Task 2; `formatDate` fra Task 5.
- Produces: `<AdminDocuments />` under dokument-fanen.

- [ ] **Step 1: Skriv `src/components/styret/AdminDocuments.tsx`**

```typescript
import { useEffect, useState, type FormEvent } from 'react';
import { deleteDocument, listDocuments, listProjects, uploadDocument } from '../../lib/boardApi';
import type { BoardDocument, BoardProject } from '../../types/board';
import { formatDate } from './UpcomingMilestones';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<BoardDocument[]>([]);
  const [projects, setProjects] = useState<BoardProject[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<BoardDocument['doc_type']>('protokoll');
  const [meetingDate, setMeetingDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Promise.all([listDocuments(), listProjects(true)]).then(([docs, projs]) => {
      setDocuments(docs);
      setProjects(projs);
    });
  }, [refreshKey]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus('Laster opp …');
    try {
      await uploadDocument(file, {
        title,
        doc_type: docType,
        meeting_date: meetingDate || null,
        project_id: projectId || null,
      });
      setStatus('Lastet opp.');
      setTitle(''); setMeetingDate(''); setProjectId(''); setFile(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (doc: BoardDocument) => {
    if (!window.confirm(`Slette «${doc.title}»?`)) return;
    await deleteDocument(doc);
    setRefreshKey((k) => k + 1);
  };

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpload} className="border border-[var(--deck-rule)] p-6 space-y-4">
        <p className="deck-eyebrow">Last opp dokument (kun PDF)</p>
        <input className={field} placeholder="Tittel" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid md:grid-cols-3 gap-4">
          <select className={field} value={docType} onChange={(e) => setDocType(e.target.value as BoardDocument['doc_type'])}>
            <option value="protokoll">protokoll</option>
            <option value="referat">referat</option>
            <option value="annet">annet</option>
          </select>
          <input className={field} type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
          <select className={field} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Selskapsnivå</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <input type="file" accept="application/pdf" required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="deck-kicker" />
        <button type="submit" className="deck-btn-primary">Last opp</button>
        {status && <p className="deck-kicker">{status}</p>}
      </form>

      <ul className="space-y-2">
        {documents.map((d) => (
          <li key={d.id} className="flex items-baseline gap-4">
            <span className="deck-lede">{d.title}</span>
            <span className="deck-kicker">
              {d.doc_type}{d.meeting_date && ` · ${formatDate(d.meeting_date)}`}
            </span>
            <button className="deck-kicker underline ml-auto" style={{ color: '#c94a4a' }}
              onClick={() => handleDelete(d)}>Slett</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Koble inn i `BoardAdmin.tsx`**

Erstatt `{tab === 'dokumenter' && <p className="deck-lede">Kommer i neste task.</p>}` med `{tab === 'dokumenter' && <AdminDocuments />}` og legg til `import AdminDocuments from '../../components/styret/AdminDocuments';`.

- [ ] **Step 3: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt.

- [ ] **Step 4: Commit (etter OK fra Jamil)**

```bash
git add src/components/styret/AdminDocuments.tsx src/pages/styret/BoardAdmin.tsx
git commit -m "feat(styret): adminfane for dokumentopplasting"
```

---

### Task 10: Admin — medlemsliste

**Files:**
- Create: `src/components/styret/AdminMembers.tsx`
- Modify: `src/pages/styret/BoardAdmin.tsx`

**Interfaces:**
- Consumes: `listMembers`, `addMember`, `removeMember` fra Task 2.
- Produces: `<AdminMembers />` under medlem-fanen.

- [ ] **Step 1: Skriv `src/components/styret/AdminMembers.tsx`**

```typescript
import { useEffect, useState, type FormEvent } from 'react';
import { addMember, listMembers, removeMember } from '../../lib/boardApi';
import type { BoardMember } from '../../types/board';

export default function AdminMembers() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<BoardMember['role']>('medlem');
  const [status, setStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    listMembers().then(setMembers).catch(() => setMembers([]));
  }, [refreshKey]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await addMember(email, fullName, role);
      setEmail(''); setFullName(''); setRole('medlem');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus(`Feil: ${(err as Error).message}`);
    }
  };

  const handleRemove = async (m: BoardMember) => {
    if (!window.confirm(`Fjerne ${m.full_name} fra styret? De mister tilgang umiddelbart.`)) return;
    await removeMember(m.id);
    setRefreshKey((k) => k + 1);
  };

  const field = 'w-full bg-transparent border border-[var(--deck-rule)] p-2 deck-lede';

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="border border-[var(--deck-rule)] p-6 space-y-4">
        <p className="deck-eyebrow">Legg til medlem</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input className={field} type="email" placeholder="E-post" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={field} placeholder="Fullt navn" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <select className={field} value={role} onChange={(e) => setRole(e.target.value as BoardMember['role'])}>
            <option value="medlem">medlem</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button type="submit" className="deck-btn-primary">Legg til</button>
        {status && <p className="deck-kicker">{status}</p>}
      </form>

      <ul className="space-y-2">
        {members.map((m) => (
          <li key={m.id} className="flex items-baseline gap-4">
            <span className="deck-lede">{m.full_name}</span>
            <span className="deck-kicker">{m.email} · {m.role}</span>
            <button className="deck-kicker underline ml-auto" style={{ color: '#c94a4a' }}
              onClick={() => handleRemove(m)}>Fjern</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Koble inn i `BoardAdmin.tsx`**

Erstatt medlem-placeholderen med `{tab === 'medlemmer' && <AdminMembers />}` + import.

- [ ] **Step 3: Verifiser**

Run: `npm run build && npm run lint`
Expected: grønt.

- [ ] **Step 4: Commit (etter OK fra Jamil)**

```bash
git add src/components/styret/AdminMembers.tsx src/pages/styret/BoardAdmin.tsx
git commit -m "feat(styret): adminfane for medlemsliste"
```

---

### Task 11: Diskret inngang fra forsiden

**Files:**
- Modify: footer-komponenten på offentlig forside (finn den: `grep -rn "footer" src/components/sections/ --include='*.tsx' -il`)

**Interfaces:**
- Consumes: kun `react-router-dom` `Link`.
- Produces: én diskret lenke «Styreportal» → `/styret` i footeren, stilmessig lik eksisterende footer-lenker.

- [ ] **Step 1: Finn footeren og legg til lenken**

Lokaliser footer-komponenten i `src/components/sections/` (eller `src/components/layout/`). Legg til en lenke med samme klasser som nabolinkene:

```tsx
<Link to="/styret">Styreportal</Link>
```

Tilpass eksakt markup til det som står rundt — ikke innfør nye stiler.

- [ ] **Step 2: Verifiser**

Run: `npm run build && npm run lint`, `npm run dev` → forsiden viser lenken diskret i footer; klikk → `/styret`.

- [ ] **Step 3: Commit (etter OK fra Jamil)**

```bash
git add <footer-filen>
git commit -m "feat(styret): diskret inngang til styreportalen fra footer"
```

---

### Task 12: Migrasjon i prod, seed og ende-til-ende-verifisering

**Files:** ingen kodeendringer (kun Supabase + manuell test)

**Interfaces:**
- Consumes: alt over.
- Produces: kjørende portal, verifisert RLS.

- [ ] **Step 1: Kjør migrasjonen i Supabase**

Kjør innholdet i `supabase/migrations/20260803120000_board_portal.sql` i SQL-editoren for prosjekt `uvmthunaitnojimjkhmc` (eller `supabase db push` hvis CLI er koblet). Verifiser i dashboardet at de fire tabellene og bøtten finnes, og at RLS er PÅ for alle fire.

- [ ] **Step 2: Seed medlemmene (manuelt — ALDRI i git)**

Jamil kjører i SQL-editoren med de bekreftede adressene (Jamil som `admin`, de fire andre som `medlem`):

```sql
insert into board_members (email, full_name, role) values
  ('<jamils-epost>', 'Jamil Rehman', 'admin'),
  ('<farooqs-epost>', 'Farooq Maqsood', 'medlem'),
  ('<abids-epost>', 'Abid Ali Teepo', 'medlem'),
  ('<haroons-epost>', 'Haroon Malik', 'medlem'),
  ('<vishals-epost>', 'Vishal Sarna', 'medlem');
```

(Adressene er bekreftet i samtalen 2026-08-03 — hentes derfra, ikke fra dette dokumentet.)

- [ ] **Step 3: Manuell ende-til-ende-test lokalt**

`npm run dev`, deretter:
1. `/styret` med ukjent e-post → «Denne e-posten har ikke tilgang», ingen e-post sendt.
2. `/styret` med Jamils e-post → lenke mottas → lander på `/styret/callback` → forside vises.
3. Admin: opprett testprosjekt med 3 milepæler, last opp en test-PDF, se at alt vises på forside/prosjektside/dokumentside. Prøv å laste opp en ikke-PDF → avvises.
4. Logg ut, logg inn igjen → «Siden sist» viser endringene fra punkt 3, deretter tomt ved neste innlogging.
5. Arkiver testprosjektet → borte fra grid; «Vis arkiverte» viser det.

- [ ] **Step 4: RLS-verifisering (kritisk, fra spec)**

Logg inn som en investor-bruker fra `/deck`-flyten (eller opprett en test-investor):
1. Gå til `/styret` → skal avvises av `BoardProtectedRoute`-mønsteret (login-skjermen vises, dashboard aldri).
2. I nettleserkonsollen, kjør `await supabase.from('board_projects').select('*')` med investorens sesjon → forventet: tom array (0 rader).
3. Bekreft at `/deck` og `/register` fungerer som før (regresjon).

- [ ] **Step 5: Deploy og sluttsjekk**

Push til Netlify (etter OK fra Jamil), åpne `https://aprikosventure.com/styret` i produksjon, gjenta test 1–2. Deretter (og først da): foreslå én linje i `aprikos-hq/møter/beslutningslogg.md` om lanseringen.

---

## Self-review (utført ved skriving)

- **Spec-dekning:** navn/språkregel (Task 4/5-tekster), datamodell + constraints (Task 1), RPC-allowlist før OTP (Task 1+4), egen callback (Task 4), les-først-siden-sist (Task 5), tidslinje maks 8 (Task 5), stegviser med «anslått» (Task 6), dokumentfilter + signerte lenker (Task 6/7), admin-CRUD inkl. arkivering og kun-PDF (Task 8–10), medlemsadmin (Task 10), `_redirects` (Task 4), RLS-verifisering og regresjon (Task 12). Ingen gap funnet.
- **Diskret inngang (Task 11)** står ikke eksplisitt i spesifikasjonen, men uten noen lenke finner ikke styret portalen; holdt minimal.
- **Typekonsistens:** `formatDate` eksporteres fra `UpcomingMilestones.tsx` og importeres i Task 6/7/9; `MilestoneStatus` brukes gjennomgående; `BoardDashboard`-proppen `member` matcher Task 4s bruk.
