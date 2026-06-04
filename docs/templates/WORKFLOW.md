# Code Entropy — AI-Native Development Workflow

## Overview

This document defines the standard workflow for all Code Entropy projects. Every project follows the same 7-step process with the same 11 documentation files. No exceptions — small projects get shorter files, not fewer files.

## Roles

| Role | Responsibility |
|------|---------------|
| **Founder** | Defines WHAT to build. Writes specs, sets milestones, approves scope. |
| **Tech Lead** | Guards HOW it's built. Two gates: feasibility check + full review. Deploys to production. |
| **Operator** | Builds the product with AI tools. Owns code, infra, testing, and operational docs. |
| **UX/UI Designer** | Refines visual design after Operator builds functional POC. |
| **QA** | Tests with Operator. Logs bugs, verifies fixes. |
| **Marketing Agent** | Starts in steg 2. Builds launch plan, content, and assets in parallel. |

## The 7-Step Flow

```
STEG 1 — Founder: Spec & Vision
  ├── Creates: README.md, PRD.md, UX-BRIEF.md, CLAUDE.md, MARKETING-BRIEF.md
  └── Gate A: Tech Lead feasibility check (15 min)
       "Is this buildable with this stack/timeline/budget?"

STEG 2 — Operator: Build POC + Marketing starts
  ├── Creates: ARCHITECTURE.md, .env.example, SECURITY.md,
  │            DEPLOYMENT.md, TODO.md, PROGRESS.md
  ├── Pre-commit hooks set up day 1 (gitleaks, lint, npm audit)
  ├── Marketing Agent starts landing page, SEO, waitlist
  └── Gate B: Tech Lead reviews ARCHITECTURE.md + SECURITY.md
       "Is the system design sound and secure?"

STEG 3 — UX/UI Refinement
  ├── Designers polish Operator's POC
  ├── Delivers updated code or Figma specs
  └── Operator implements design changes

STEG 4 — QA + Operator Testing
  ├── Functional testing (QA + AI-assisted)
  ├── Cross-browser/device (QA)
  ├── Security + performance (Operator)
  └── Bugs logged → Operator fixes → QA verifies

STEG 5 — Tech Lead: Final Review + Deploy
  ├── Code review (architecture, security, quality)
  ├── Database migrations verified
  ├── Staging → Production deploy
  ├── Auto-CHANGELOG generated via release-please
  └── Monitoring/alerting activated

STEG 6 — Marketing Launch (ready from steg 2)
  └── Coordinated release with steg 5

STEG 7 — Observe & Iterate
  ├── Error tracking (Sentry)
  ├── Analytics review
  ├── User feedback collection
  ├── Hotfix prioritization
  └── Next iteration → back to steg 1
```

## File Ownership

### Founder creates before handoff (5 files)

| File | Purpose |
|------|---------|
| `README.md` | What is this + how to run locally |
| `PRD.md` | What to build, why, for whom, scope, acceptance criteria |
| `UX-BRIEF.md` | User flows, edge cases, copy, design direction |
| `CLAUDE.md` | AI agent rules, conventions, commands (<150 lines) |
| `MARKETING-BRIEF.md` | Positioning, channels, launch plan, key messages |

### Operator creates during build (6 files)

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | System design, data model, ADRs, cost budget |
| `.env.example` | All env vars with descriptions (never values) |
| `SECURITY.md` | Auth model, OWASP checklist, secrets management |
| `DEPLOYMENT.md` | CI/CD, deploy commands, pre-deploy checklist, rollback |
| `TODO.md` | Current priorities, known bugs, next steps (AI agent context) |
| `PROGRESS.md` | Milestone tracking — Founder sets, Operator updates |

### Auto-generated (2 files)

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Release history — auto-generated via release-please |
| `.github/pull_request_template.md` | PR checklist enforcing quality gates |

## Gates

### Gate A — Tech Lead Feasibility (after steg 1, before steg 2)
- Duration: 15 minutes
- Input: PRD.md (especially security block + tech constraints)
- Output: "Go" / "Go with changes" / "No-go"
- Checks: Is the stack right? Is the timeline realistic? Are there security red flags?

### Gate B — Tech Lead Architecture Review (during steg 2)
- Duration: 30-60 minutes
- Input: ARCHITECTURE.md + SECURITY.md
- Output: Approved / Changes required
- Checks: Data model sound? Auth model secure? Cost budget realistic? ADRs documented?

### Gate C — Founder Scope Approval (end of steg 2)
- Duration: 30 minutes
- Input: Running demo
- Output: "Does it do what it should?"
- Checks: User stories met? Scope respected? Ready for UX polish?

## Rules

1. All 11 files exist in every project. Small projects = shorter files, not fewer files.
2. CLAUDE.md stays under 150 lines. Long context files slow AI agents.
3. Conventional Commits required. Format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
4. No PR merges without the PR template checklist completed.
5. Pre-commit hooks set up on day 1 of steg 2 (see SECURITY.md §4 for setup).
6. PROGRESS.md updated with every PR (enforced via PR template).
7. Marketing starts in steg 2, not steg 4.
8. Never commit .env files. Use .env.example.
9. Tech Lead has two touchpoints: feasibility (gate A) + review (gate B).
10. Discovery (user interviews) is optional — recommended for external B2B/B2C products.
11. **"One topic, one home."** Details live in one file. Other files only reference. Owners:
    - Auth & security: SECURITY.md
    - Tech stack & architecture: ARCHITECTURE.md
    - Pre-commit hooks & dev setup: SECURITY.md §4
    - Acceptance criteria (product): PRD.md — verified at Gate C
    - Acceptance criteria (UX): UX-BRIEF.md — verified before steg 4
    - Cost budget (infra): ARCHITECTURE.md §Cost Budget
    - Cost budget (marketing): MARKETING-BRIEF.md §Budget
    - Combined budget tracking: PROGRESS.md §Budget Tracker
    - Performance targets: ARCHITECTURE.md §Performance Targets
    - Timeline: PRD.md sets constraint, PROGRESS.md breaks into milestones
