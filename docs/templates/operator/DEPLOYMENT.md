# Deployment: [Project Name]

**Author:** [Operator name]
**Date:** [YYYY-MM-DD]
**Reviewed by:** [Tech Lead name] — Gate B

---

## Environments

| Environment | URL | Branch | Auto-deploy |
|------------|-----|--------|-------------|
| Development | http://localhost:3000 | any | N/A |
| Staging | [staging-url] | `staging` | [Yes/No] |
| Production | [production-url] | `main` | [Yes/No] |

## CI/CD Pipeline

```
Push to branch → Lint + Type check → Tests → Build
                                              │
                   PR to main → Code review → Merge → Auto-deploy to staging
                                                           │
                                     Tech Lead approves → Deploy to production
```

### Pipeline Configuration
- **CI tool:** [e.g., GitHub Actions / Vercel / Cloud Build]
- **Config file:** [e.g., `.github/workflows/ci.yml`]
- **Build command:** `npm run build`
- **Test command:** `npm run test`

## Deploy Commands

### Staging
```bash
# If auto-deploy: merge PR to staging branch
git push origin staging

# If manual:
[deployment command]
```

### Production
```bash
# If auto-deploy: merge PR to main
# Tag release:
git tag v[X.Y.Z]
git push origin v[X.Y.Z]

# If manual:
[deployment command]
```

## Database Migrations

```bash
# Generate migration after schema change
npx prisma migrate dev --name [description]

# Apply to staging (verify first!)
npx prisma migrate deploy

# Apply to production (Tech Lead runs this)
npx prisma migrate deploy --preview-feature
```

**Rules:**
- Never edit existing migrations
- Always test migrations on staging before production
- Back up production database before running migrations
- Destructive migrations (drop column/table) require Tech Lead approval

## Pre-Deploy Checklist

> Complete before every production deployment.

### Code Quality
- [ ] All CI checks passing (lint, types, tests)
- [ ] PR approved by Tech Lead
- [ ] No `console.log` or debug code in production paths
- [ ] Bundle size checked (no unexpected increase)
- [ ] PROGRESS.md updated
- [ ] Performance targets met (see ARCHITECTURE.md §Performance Targets)

### Configuration
- [ ] All env vars set in production environment
- [ ] No new env vars missing (compare .env.example with production)
- [ ] Feature flags configured correctly
- [ ] API rate limits configured

### Database
- [ ] Migrations tested on staging
- [ ] No breaking schema changes without data migration plan
- [ ] Database backup confirmed (automated or manual)

### Security (see SECURITY.md for full checklist)
- [ ] Pre-commit hooks passing (see SECURITY.md §4)
- [ ] Dependencies audited (`npm audit`)
- [ ] Auth flows tested on staging (see SECURITY.md §2)
- [ ] RLS policies verified for new tables

### Deploy
- [ ] Deploy to staging first
- [ ] Smoke test on staging (critical user flows)
- [ ] Deploy to production
- [ ] Verify production serves correct version
- [ ] Check error monitoring (Sentry / logs)

### Post-Deploy (first 24 hours)
- [ ] Smoke test critical flows in production
- [ ] Monitor error rates and performance
- [ ] Check for unexpected 4xx/5xx spikes
- [ ] Team notified of release
- [ ] CHANGELOG.md auto-generated via release-please

## Rollback Procedure

```bash
# Option 1: Revert to previous deploy (Vercel/Cloud Run)
[platform-specific rollback command]

# Option 2: Revert git commit and redeploy
git revert [commit-hash]
git push origin main

# Option 3: Database rollback (DANGEROUS — Tech Lead only)
# Restore from backup taken before deploy
```

**Rollback decision criteria:**
- Error rate > 5% → immediate rollback
- Critical user flow broken → immediate rollback
- Minor visual bug → hotfix forward, don't rollback

## Auto-Changelog Setup

> CHANGELOG.md is auto-generated. Never edit manually.

```bash
# Install release-please (GitHub Action)
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
```

**Requires Conventional Commits:**
- `feat: add user dashboard` → minor version bump
- `fix: resolve login redirect` → patch version bump
- `feat!: redesign API` → major version bump

## Monitoring & Alerting

| What | Tool | Alert Channel |
|------|------|--------------|
| Errors | [Sentry / Vercel] | [Slack #alerts] |
| Uptime | [UptimeRobot / Vercel] | [Slack + email] |
| Performance | [Vercel Analytics / Lighthouse CI] | [Weekly report] |
| Cost | [Cloud provider dashboard] | [80% budget alert] |
