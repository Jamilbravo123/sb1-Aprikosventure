# PRD: [Project Name]

**Author:** [Founder name]
**Date:** [YYYY-MM-DD]
**Status:** Draft | In Review | Approved
**Version:** 1.0

---

## Problem

[What is the problem? Who has it? How do we know it's real? 2-3 sentences max.]

## Target User

[Who is this for? Be specific — "small clinic owners in Norway" not "healthcare professionals".]

## Solution

[What are we building? How does it solve the problem? Why this approach over alternatives?]

## User Stories

| # | As a... | I want to... | So that... | Priority |
|---|---------|-------------|-----------|----------|
| 1 | [user type] | [action] | [outcome] | Must |
| 2 | | | | Must |
| 3 | | | | Should |
| 4 | | | | Nice |

## Scope

### In Scope

- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

### Out of Scope

- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| [e.g., User signups] | [e.g., 50 in first month] | [e.g., Supabase auth count] |
| [e.g., Task completion rate] | [e.g., >80%] | [e.g., Analytics event] |

## Security Block

> Tech Lead reviews this section in Gate A.

- **Auth strategy:** [e.g., Supabase Auth with magic link / Keycloak OIDC]
- **Sensitive data types:** [e.g., patient records, payment info, PII]
- **Who sees what:** [e.g., admin sees all, user sees own data only]
- **Compliance requirements:** [e.g., GDPR, Pasientjournalloven, none]
- **Data residency:** [e.g., EU only, Norway only, no restriction]

## Technical Constraints

- **Stack:** [e.g., Must use Next.js + Supabase — existing team competence]
- **Integrations:** [e.g., Must integrate with X API, Stripe, etc.]
- **Performance:** [e.g., Page load < 2s, API response < 500ms]
- **Budget:** [e.g., Max $50/month cloud cost for MVP]
- **Timeline:** [e.g., MVP in 3 weeks]

## Dependencies

- [e.g., Waiting for API access from partner X]
- [e.g., Design system from project Y]

## Acceptance Criteria (Product — Gate C)

> Founder uses this checklist to approve the POC at end of steg 2.
> For UX-specific acceptance criteria (steg 3), see UX-BRIEF.md.

- [ ] User story 1 works end-to-end
- [ ] User story 2 works end-to-end
- [ ] Auth flow complete (signup, login, logout)
- [ ] Mobile responsive
- [ ] No console errors in production build
- [ ] [Project-specific criteria]

## Open Questions

- [Question 1 — who needs to answer?]
- [Question 2]
