---
name: Supabase CLI and API access
description: How to access Supabase project database via CLI, service_role key, and Management API for the Aprikos Venture Club project
type: reference
---

## Supabase CLI
- Installed at `/usr/local/bin/supabase` (v2.54.11)
- Project is linked: Aprikos Venture Club (`uvmthunaitnojimjkhmc`), region: West EU (Ireland)
- `supabase projects list` works without extra auth
- `supabase projects api-keys --project-ref uvmthunaitnojimjkhmc` to get keys
- CLI version lacks `db execute` — use Management API for SQL

## Service Role Key
- Can be used for Auth Admin API calls (list/create/delete users)
- Endpoint: `https://uvmthunaitnojimjkhmc.supabase.co/auth/v1/admin/users`
- Get key via: `supabase projects api-keys --project-ref uvmthunaitnojimjkhmc`

## Management API (for running SQL)
- Endpoint: `POST https://api.supabase.com/v1/projects/uvmthunaitnojimjkhmc/database/query`
- Auth: `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>`
- Body: `{"query": "SELECT ..."}`
- Access token generated at: https://supabase.com/dashboard/account/tokens
- User's token: ask user to provide (stored in their dashboard, not persisted here)
