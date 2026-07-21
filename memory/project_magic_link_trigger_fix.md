---
name: Magic link trigger fix (2026-04-30)
description: Fixed broken auth trigger that prevented new users from receiving magic links — handle_new_user() on auth.users was inserting into investors with NULL NOT NULL fields
type: project
---

## Problem
New users (e.g. Robert Lyngmoe) could not receive magic links. `signInWithOtp()` returned "Database error saving new user". User data was saved in `investors` table but auth user was never created, so no email was sent via Resend.

## Root cause
A database trigger `on_auth_user_created` on `auth.users` called `handle_new_user()` which tried to `INSERT INTO investors (id, email, created_at)` — but `investor_type`, `full_name`, `phone`, `country`, `interests`, `commitment` are all NOT NULL, causing the entire transaction (including auth user creation) to roll back.

The trigger was redundant because the registration wizard already inserts into `investors` with all required fields before calling `signInWithOtp()`.

## Fix applied
1. Dropped trigger: `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`
2. Dropped function: `DROP FUNCTION IF EXISTS handle_new_user()`
3. Improved error handling in `RegisterWizard.tsx` and `RegisterLanding.tsx` to show actual Supabase error messages instead of silently proceeding to "check inbox" screen

**Why:** Never add triggers on `auth.users` that insert into tables with NOT NULL constraints unless all fields are populated from the auth context.

**How to apply:** If adding auth-related triggers in the future, ensure they handle the minimal data available from `auth.users` (only `id`, `email`, `phone`). Better to let the application code handle related table inserts.
