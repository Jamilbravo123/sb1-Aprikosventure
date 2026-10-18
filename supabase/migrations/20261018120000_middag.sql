-- Investormiddag (/middag): personlige invitasjoner og svar.
--
-- Tilgang:
--   * Gjester er ikke innlogget. De når dataene KUN via to SECURITY DEFINER-funksjoner som krever
--     gjestens hemmelige lenkekode (128 bit tilfeldig). Tabellene er stengt for anon.
--   * Styreadmin (is_board_admin) leser og administrerer alt via RLS.

create table if not exists dinner_guests (
  id          uuid primary key default gen_random_uuid(),
  event_slug  text not null default 'mashwara-2026-11-05',
  full_name   text not null check (length(trim(full_name)) between 1 and 120 and full_name !~ '[\r\n]'),
  email       text check (email is null or length(email) <= 200),
  token       text not null unique default encode(extensions.gen_random_bytes(16), 'hex'),
  note        text check (note is null or length(note) <= 500),
  opened_at   timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists dinner_rsvps (
  guest_id     uuid primary key references dinner_guests(id) on delete cascade,
  attending    boolean not null,
  full_name    text not null check (length(trim(full_name)) between 1 and 120 and full_name !~ '[\r\n]'),
  email        text not null check (length(email) between 3 and 200),
  party_size   int not null default 1 check (party_size between 1 and 2),
  dietary      text check (dietary is null or length(dietary) <= 300),
  responded_at timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  notified_at  timestamptz
);

alter table dinner_guests enable row level security;
alter table dinner_rsvps  enable row level security;

drop policy if exists dinner_guests_admin on dinner_guests;
create policy dinner_guests_admin on dinner_guests
  for all to authenticated using (is_board_admin()) with check (is_board_admin());

drop policy if exists dinner_rsvps_admin on dinner_rsvps;
create policy dinner_rsvps_admin on dinner_rsvps
  for all to authenticated using (is_board_admin()) with check (is_board_admin());

revoke all on dinner_guests, dinner_rsvps from anon;
-- Supabase gir authenticated ALL som standard; behold bare det RLS-policyene trenger.
revoke all on dinner_guests, dinner_rsvps from authenticated;
grant select, insert, update, delete on dinner_guests, dinner_rsvps to authenticated;

-- Hent invitasjonen for en lenkekode. Første kall markerer invitasjonen som åpnet.
-- Returnerer ingen rader ved ukjent kode (ingen forskjell på «finnes ikke» og «feil»).
create or replace function dinner_get_invite(p_token text)
returns table (
  full_name  text,
  email      text,
  attending  boolean,
  party_size int,
  dietary    text
)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  g dinner_guests%rowtype;
begin
  if p_token is null or p_token !~ '^[0-9a-f]{32}$' then
    return;
  end if;

  select * into g from dinner_guests where token = p_token;
  if not found then
    return;
  end if;

  update dinner_guests set opened_at = now() where id = g.id and opened_at is null;

  return query
    select coalesce(r.full_name, g.full_name), coalesce(r.email, g.email),
           r.attending, r.party_size, r.dietary
    from (select 1) one
    left join dinner_rsvps r on r.guest_id = g.id;
end;
$$;

-- Lagre eller endre svaret. Gjesten kan ombestemme seg til fristen; vi beholder første svartid.
create or replace function dinner_submit_rsvp(
  p_token      text,
  p_attending  boolean,
  p_full_name  text,
  p_email      text,
  p_party_size int,
  p_dietary    text
) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_guest uuid;
begin
  if p_token is null or p_token !~ '^[0-9a-f]{32}$' or p_attending is null then
    return false;
  end if;

  select id into v_guest from dinner_guests where token = p_token;
  if v_guest is null then
    return false;
  end if;

  if length(trim(coalesce(p_full_name, ''))) not between 1 and 120
     or coalesce(p_email, '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     or length(p_email) > 200
     or length(coalesce(p_dietary, '')) > 300 then
    raise exception 'Ugyldig svar' using errcode = '22023';
  end if;

  insert into dinner_rsvps (guest_id, attending, full_name, email, party_size, dietary)
  values (
    v_guest, p_attending, trim(p_full_name), lower(trim(p_email)),
    case when p_attending then greatest(1, least(2, coalesce(p_party_size, 1))) else 1 end,
    case when p_attending then nullif(trim(coalesce(p_dietary, '')), '') else null end
  )
  on conflict (guest_id) do update set
    attending  = excluded.attending,
    full_name  = excluded.full_name,
    email      = excluded.email,
    party_size = excluded.party_size,
    dietary    = excluded.dietary,
    updated_at = now()
  -- Uendret svar gir ingen ny versjon, og dermed heller ikke noe nytt varsel.
  where dinner_rsvps.attending  is distinct from excluded.attending
     or dinner_rsvps.full_name  is distinct from excluded.full_name
     or dinner_rsvps.email      is distinct from excluded.email
     or dinner_rsvps.party_size is distinct from excluded.party_size
     or dinner_rsvps.dietary    is distinct from excluded.dietary;

  return true;
end;
$$;

revoke all on function dinner_get_invite(text) from public;
revoke all on function dinner_submit_rsvp(text, boolean, text, text, int, text) from public;
grant execute on function dinner_get_invite(text) to anon, authenticated;
grant execute on function dinner_submit_rsvp(text, boolean, text, text, int, text) to anon, authenticated;
