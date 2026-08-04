-- Herding etter Supabase security advisor (2026-08-04):
-- interne funksjoner skal ikke være kallbare via PostgREST RPC.

alter function board_touch_updated_at() set search_path = public, pg_temp;

revoke execute on function board_touch_updated_at() from public, anon, authenticated;
revoke execute on function board_members_guard_self_update() from public, anon, authenticated;
revoke execute on function board_members_guard_last_admin() from public, anon, authenticated;

-- is_board_member/is_board_admin: kun innloggede (eksplisitt grant fra før består).
revoke execute on function is_board_member() from public, anon;
revoke execute on function is_board_admin() from public, anon;

-- check_board_email: fjern implisitt PUBLIC; eksplisitt anon+authenticated består (pre-login-sjekk).
revoke execute on function check_board_email(text) from public;
