# CLAUDE.md — [Project Name]

## Project

[One sentence: what this project is.]

## Stack

> Full tech stack with versions and rationale: see ARCHITECTURE.md §Tech Stack.
> Auth model: see SECURITY.md §2.

- Frontend: [e.g., Next.js 15 + React 19 + TypeScript 5 + Tailwind CSS 4]
- Backend: [e.g., NestJS + PostgreSQL + Prisma]
- Hosting: [e.g., Vercel]

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # Lint check
npm run db:migrate # Run database migrations
```

## Code Conventions

- TypeScript, strict mode
- 2-space indentation, single quotes
- Prefer `const` over `let`, never `var`
- Modern ES module syntax (`import`/`export`)
- File naming: `kebab-case.ts` for files, `PascalCase` for components
- Use absolute imports via `@/` alias

## Structure

```
src/
  components/   — Reusable UI components
  pages/        — Route pages
  lib/          — Utilities, clients, helpers
  hooks/        — Custom React hooks
  types/        — TypeScript type definitions
```

## Rules

- Never commit .env files
- Never use `any` type — use `unknown` if type is truly unknown
- Never skip TypeScript errors with @ts-ignore
- Always handle loading, error, and empty states
- Always validate user input at system boundaries
- Use parameterized queries — never concatenate SQL strings
- Env vars use SCREAMING_SNAKE_CASE, documented in .env.example

## Git

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- One feature per branch, one PR per feature
- Never force push to main
- Pre-commit hooks setup: see SECURITY.md §4

## Testing

- Test files next to source: `foo.test.ts` beside `foo.ts`
- Run `npm run test` before marking work complete
- Test happy path + one error case minimum per feature

## Context

- PRD: `docs/PRD.md`
- Architecture: `docs/ARCHITECTURE.md`
- Current priorities: `TODO.md`
