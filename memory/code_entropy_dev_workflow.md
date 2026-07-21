# Code Entropy — AI-Native Development Workflow (May 2026)

## Overview
Standard 7-step workflow for all Code Entropy projects. Template files at `docs/templates/`.
Master doc: `docs/templates/WORKFLOW.md`

## The 7 Steps
1. **Founder: Spec** → 5 .md files → Gate A (Tech Lead feasibility, 15 min)
2. **Operator: Build POC** → 6 .md files + pre-commit hooks → Marketing starts parallel → Gate B (Tech Lead architecture review) → Gate C (Founder scope approval)
3. **UX/UI Refinement** → Designers polish → Operator implements
4. **QA + Operator Testing**
5. **Tech Lead: Review + Deploy** → auto-CHANGELOG via release-please
6. **Marketing Launch** (ready from steg 2)
7. **Observe & Iterate** (Sentry, analytics, hotfixes)

## 11 Files (always, every project)

### Founder creates (5):
1. `README.md` — what + setup + run locally
2. `PRD.md` — problem, scope, user stories, security block, acceptance criteria (Gate C)
3. `UX-BRIEF.md` — user flow, edge cases, copy, UX acceptance criteria (before steg 4)
4. `CLAUDE.md` — AI agent rules, <150 lines
5. `MARKETING-BRIEF.md` — positioning, channels, launch plan, marketing budget

### Operator creates (6):
6. `ARCHITECTURE.md` — system design, data model, ADR table, cost budget, performance targets
7. `.env.example` — all vars with descriptions, SCREAMING_SNAKE_CASE, never values
8. `SECURITY.md` — **single source of truth for auth**, OWASP checklist, pre-commit hooks setup, secrets, incident response
9. `DEPLOYMENT.md` — CI/CD, deploy commands, pre-deploy checklist, rollback, auto-changelog setup
10. `TODO.md` — AI agent context (not project management), priorities, known bugs
11. `PROGRESS.md` — milestones, gates, overall timeline, combined budget tracker, decisions log

### Auto-generated:
- `CHANGELOG.md` — via release-please + Conventional Commits
- `.github/pull_request_template.md` — enforces PROGRESS.md update, conventional commits, security impact check

## "One Topic, One Home" Principle
- Auth → SECURITY.md §2
- Tech stack → ARCHITECTURE.md §Tech Stack
- Pre-commit hooks → SECURITY.md §4
- Cost (infra) → ARCHITECTURE.md §Cost Budget
- Cost (marketing) → MARKETING-BRIEF.md §Budget
- Cost (combined) → PROGRESS.md §Budget Tracker
- Performance targets → ARCHITECTURE.md §Performance Targets
- Acceptance criteria (product) → PRD.md (Gate C)
- Acceptance criteria (UX) → UX-BRIEF.md (before steg 4)
- Timeline → PRD.md sets constraint, PROGRESS.md breaks into milestones

## 3 Gates
- **Gate A:** Tech Lead feasibility check (15 min, after steg 1)
- **Gate B:** Tech Lead reviews ARCHITECTURE.md + SECURITY.md (during steg 2)
- **Gate C:** Founder approves functional scope (end of steg 2)

## Key Rules
- Small projects = shorter files, not fewer files
- CLAUDE.md < 150 lines
- Conventional Commits: feat:, fix:, chore:, docs:, refactor:
- Pre-commit hooks day 1 (gitleaks + lint-staged)
- Marketing starts in steg 2, not steg 4
- PROGRESS.md updated with every PR (enforced via PR template)
- Discovery (user interviews) optional — recommended for external B2B/B2C
