# Architecture: [Project Name]

**Author:** [Operator name]
**Date:** [YYYY-MM-DD]
**Reviewed by:** [Tech Lead name] — Gate B
**Status:** Draft | Reviewed | Approved

---

## System Overview

[2-3 sentences: what the system does at a high level.]

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend    │────▶│  Database    │
│  [Next.js]   │     │  [NestJS]    │     │ [PostgreSQL] │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │ 3rd Party  │
                    │  [Stripe]  │
                    └───────────┘
```

## Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Frontend | [e.g., Next.js] | [15.x] | [e.g., SSR, team competence] |
| Backend | [e.g., NestJS] | [10.x] | [e.g., TypeScript, modular] |
| Database | [e.g., PostgreSQL] | [16] | [e.g., RLS, Supabase integration] |
| Auth | See SECURITY.md section 2 | | |
| Hosting | [e.g., Vercel + Supabase] | | |
| AI | [e.g., Claude API] | | |

## Data Model

> Core entities and relationships. Full schema in Prisma/migrations.

```
User (1) ──── (N) Project
  │                  │
  │                  ├── (N) Task
  │                  │
  └── (N) Role ──── (N) Permission
```

### Key Tables

| Table | Purpose | RLS | Soft Delete |
|-------|---------|-----|-------------|
| `users` | User accounts | Yes | No |
| `projects` | User projects | Yes — owner only | Yes |
| `tasks` | Project tasks | Yes — project members | Yes |

## API Overview

> Key endpoints. Full API docs auto-generated from code if applicable.

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/projects` | List user projects | Required |
| POST | `/api/projects` | Create project | Required |
| GET | `/api/projects/:id` | Project detail | Owner/member |

## Key Decisions (ADR)

| # | Decision | Why | Date | Alternatives Considered |
|---|----------|-----|------|------------------------|
| 1 | [e.g., Supabase over Firebase] | [e.g., Postgres, RLS, cheaper] | [date] | Firebase, PlanetScale |
| 2 | [e.g., Server components for data fetching] | [e.g., Reduce client JS] | [date] | Client-side SWR |
| 3 | | | | |

## Cost Budget

> Reviewed monthly. Alert at 80% threshold.

| Service | Monthly Budget | Current Cost | Notes |
|---------|---------------|-------------|-------|
| AI tokens (Claude/Cursor) | $[X] | $[X] | [usage pattern] |
| Cloud (Supabase/Vercel) | $[X] | $[X] | [tier/plan] |
| 3rd party APIs | $[X] | $[X] | [Stripe, SendGrid, etc.] |
| **Total** | **$[X]** | **$[X]** | |

## Module Map

```
src/
  auth/          — Login, signup, session (see SECURITY.md §2)
  projects/      — Project CRUD, member management
  tasks/         — Task CRUD, status transitions
  notifications/ — Email, push notifications
  shared/        — Utilities, types, constants
```

## External Integrations

| Service | Purpose | Docs | Env Vars |
|---------|---------|------|----------|
| [e.g., Stripe] | [Payments] | [link] | `STRIPE_*` |
| [e.g., SendGrid] | [Transactional email] | [link] | `SENDGRID_*` |

## Performance Targets

| Metric | Target | How Measured |
|--------|--------|-------------|
| Page load (LCP) | < 2.5s | Lighthouse |
| API response (p95) | < 500ms | APM / logging |
| Database query (p95) | < 100ms | Query logging |
