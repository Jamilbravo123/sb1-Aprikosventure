# Security: [Project Name]

**Author:** [Operator name]
**Date:** [YYYY-MM-DD]
**Reviewed by:** [Tech Lead name] — Gate B

---

> This is the **single source of truth** for auth, access control, and security.
> Other files (PRD, ARCHITECTURE, UX-BRIEF, CLAUDE.md) reference this document.
> **"One topic, one home."** Auth details live here. Other files link here.

## 1. Security Overview

- **Data classification:** [e.g., PII, financial, healthcare, or none]
- **Compliance:** [e.g., GDPR, none — see COMPLIANCE.md if regulated]
- **Threat model:** [e.g., Public internet app, authenticated users, admin panel]

## 2. Authentication & Authorization

> **This section is the auth contract for the entire project.**
> PRD.md, ARCHITECTURE.md, UX-BRIEF.md, and CLAUDE.md all reference this section.

### Provider
- **Service:** [e.g., Supabase Auth / Keycloak / NextAuth]
- **Methods:** [e.g., Email/password, Google OAuth, Magic link]
- **MFA:** [e.g., TOTP required for admin role / not implemented]

### Session
- **Token type:** [e.g., JWT — 1 hour access, 7 days refresh]
- **Storage:** [e.g., httpOnly cookie (web), secure storage (mobile)]
- **Timeout:** [e.g., 30 min idle, 8 hour absolute]

### Roles & Permissions (RBAC)

| Role | Permissions | Notes |
|------|------------|-------|
| admin | All operations | [e.g., max 2-3 people] |
| user | Read/write own data | Default role on signup |
| guest | Public pages only | Unauthenticated |

### Row-Level Security (RLS)

- [ ] All tables have RLS enabled
- [ ] Policies documented in migrations: `supabase/migrations/*_rls.sql`
- [ ] No table accessible without auth (except public content)

### Auth Helpers (use these, never roll your own)

```typescript
getCurrentUser()    // Returns user or null
requireAuth()       // Throws 401 if not logged in
requireRole(role)   // Throws 403 if missing role
```

### Secret Rotation Schedule

| Secret | Rotation | Trigger |
|--------|----------|---------|
| JWT secret | Every 90 days | Calendar reminder |
| OAuth client secret | On offboarding | Team member leaves |
| API keys (3rd party) | On compromise | Incident response |

## 3. OWASP Top 10 Checklist

### Injection Prevention
- [ ] All database queries parameterized (Prisma/ORM handles this)
- [ ] User input sanitized before rendering (prevent XSS)
- [ ] Content Security Policy (CSP) header set
- [ ] No raw HTML injection — always use framework-safe rendering

### Authentication Failures
- [ ] Passwords hashed with bcrypt/argon2 (or delegated to auth provider)
- [ ] Failed login attempts rate-limited (max 5/minute)
- [ ] Magic link / reset tokens expire within 15 minutes
- [ ] Session invalidated on password change

### Data Protection
- [ ] All traffic over HTTPS (no mixed content)
- [ ] Sensitive data encrypted at rest
- [ ] PII never logged to console, error tracking, or analytics
- [ ] CORS configured to allow only known origins
- [ ] File uploads validated (type, size, content)

### Access Control
- [ ] RLS enabled on all Supabase tables
- [ ] API endpoints check auth + role before processing
- [ ] Admin endpoints not publicly discoverable
- [ ] No IDOR vulnerabilities (users cannot access others' data by changing IDs)

### Security Misconfiguration
- [ ] Error messages do not leak stack traces in production
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Security headers set (X-Frame-Options, X-Content-Type-Options, etc.)

## 4. Infrastructure Security

### Secrets Management
- [ ] .env files in .gitignore
- [ ] No secrets in client-side code or git history
- [ ] Secrets stored in [e.g., Supabase vault / 1Password / GCP Secret Manager]
- [ ] Env vars documented in `.env.example` (values never committed)

### Pre-commit Hooks (set up day 1)

```bash
# Install
npm install -D husky lint-staged

# Also install gitleaks: https://github.com/gitleaks/gitleaks#installing

# .husky/pre-commit
npx lint-staged
gitleaks protect --staged

# package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### Dependency Security
- [ ] `npm audit` runs in CI pipeline
- [ ] Dependabot / Renovate enabled for auto-updates
- [ ] No known critical vulnerabilities in production dependencies

## 5. Monitoring & Incident Response

### Monitoring
- [ ] Error tracking configured ([e.g., Sentry])
- [ ] Alerting on auth failures / unusual patterns
- [ ] Uptime monitoring ([e.g., Vercel analytics / UptimeRobot])

### Incident Response
- **Severity 1 (data breach):** Notify Founder + Tech Lead immediately, rotate all secrets
- **Severity 2 (service down):** Tech Lead deploys fix or rolls back within 1 hour
- **Severity 3 (bug/degraded):** Log in TODO.md, fix in next deploy cycle

## 6. Cross-Reference

> Other files reference this document for auth details:

| File | What it says | Points to |
|------|-------------|-----------|
| PRD.md | "Auth strategy: see SECURITY.md §2" | Section 2 |
| ARCHITECTURE.md | "Auth stack: see SECURITY.md §2" | Section 2 |
| UX-BRIEF.md | "Auth screens follow SECURITY.md §2" | Section 2 |
| .env.example | "AUTH_* vars: see SECURITY.md §2-3" | Sections 2-3 |
| CLAUDE.md | "Auth helpers: see SECURITY.md §2" | Section 2 |
