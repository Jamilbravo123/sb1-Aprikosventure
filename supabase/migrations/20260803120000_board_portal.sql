-- Styreportal: skjema, RLS, RPC og storage.
-- Seed av board_members skjer manuelt i Supabase (ingen persondata i git).

create extension if not exists pgcrypto;

-- ── Tabeller ──────────────────────────────────────────────

create table board_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null unique check (email = lower(email)),
  full_name text not null,
  role text not null default 'medlem' check (role in ('medlem', 'admin')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index board_members_user_id_key on board_members (user_id)
  where user_id is not null;

create table board_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  ownership_pct numeric(5,2) check (ownership_pct >= 0 and ownership_pct <= 100),
  ownership_note text,
  partners text,
  company_name text,
  company_orgnr text,
  sort_order int not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table board_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references board_projects(id) on delete cascade,
  title text not null,
  target_date date not null,
  status text not null default 'planlagt'
    check (status in ('planlagt', 'pågår', 'fullført', 'forsinket')),
  position int not null check (position between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, position)
);

create table board_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references board_projects(id) on delete set null,
  title text not null,
  doc_type text not null check (doc_type in ('protokoll', 'referat', 'annet')),
  meeting_date date,
  file_path text not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ── updated_at-trigger ────────────────────────────────────

create or replace function board_touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger board_projects_touch before update on board_projects
  for each row execute function board_touch_updated_at();
create trigger board_milestones_touch before update on board_milestones
  for each row execute function board_touch_updated_at();

-- ── Hjelpefunksjoner (én kilde for alle policies) ─────────

create or replace function is_board_member() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from board_members m
    where m.user_id = auth.uid()
       or lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function is_board_admin() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from board_members m
    where m.role = 'admin'
      and (m.user_id = auth.uid()
           or lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  );
$$;

-- Returnerer KUN ja/nei — lekker aldri listen. Kalles før OTP sendes.
create or replace function check_board_email(p_email text) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from board_members where email = lower(trim(p_email))
  );
$$;

grant execute on function check_board_email(text) to anon, authenticated;
grant execute on function is_board_member() to authenticated;
grant execute on function is_board_admin() to authenticated;

-- ── RLS ───────────────────────────────────────────────────

alter table board_members enable row level security;
alter table board_projects enable row level security;
alter table board_milestones enable row level security;
alter table board_documents enable row level security;

create policy "medlemmer leser medlemmer" on board_members
  for select using (is_board_member());
create policy "admin skriver medlemmer" on board_members
  for all using (is_board_admin()) with check (is_board_admin());
-- Medlem kan kun binde egen user_id og oppdatere eget last_seen_at.
-- RLS kan ikke begrense kolonner — kolonnevakten håndheves i trigger under.
create policy "medlem oppdaterer egen rad" on board_members
  for update using (
    user_id = auth.uid()
    or (user_id is null
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  ) with check (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create or replace function board_members_guard_self_update() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if is_board_admin() then
    return new;
  end if;
  if new.email is distinct from old.email
     or new.full_name is distinct from old.full_name
     or new.role is distinct from old.role
     or new.id is distinct from old.id
     or new.created_at is distinct from old.created_at then
    raise exception 'Kun user_id og last_seen_at kan endres av medlemmet selv';
  end if;
  if new.user_id is distinct from old.user_id
     and (old.user_id is not null or new.user_id is distinct from auth.uid()) then
    raise exception 'user_id kan kun bindes til egen bruker';
  end if;
  return new;
end;
$$;

create trigger board_members_guard_self_update
  before update on board_members
  for each row execute function board_members_guard_self_update();

-- Siste admin kan aldri fjernes eller nedgraderes — ellers låses alle ute.
create or replace function board_members_guard_last_admin() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if old.role = 'admin' and (tg_op = 'DELETE' or new.role is distinct from old.role) then
    perform pg_advisory_xact_lock(hashtext('board_members_last_admin'));
    if (select count(*) from board_members where role = 'admin') <= 1 then
      raise exception 'Kan ikke fjerne eller nedgradere siste admin';
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger board_members_guard_last_admin
  before update or delete on board_members
  for each row execute function board_members_guard_last_admin();

create policy "medlemmer leser prosjekter" on board_projects
  for select using (is_board_member());
create policy "admin skriver prosjekter" on board_projects
  for all using (is_board_admin()) with check (is_board_admin());

create policy "medlemmer leser milepæler" on board_milestones
  for select using (is_board_member());
create policy "admin skriver milepæler" on board_milestones
  for all using (is_board_admin()) with check (is_board_admin());

create policy "medlemmer leser dokumenter" on board_documents
  for select using (is_board_member());
create policy "admin skriver dokumenter" on board_documents
  for all using (is_board_admin()) with check (is_board_admin());

-- ── Storage: privat bøtte ─────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('board-docs', 'board-docs', false, 26214400, array['application/pdf'])
on conflict (id) do nothing;

create policy "styret leser board-docs" on storage.objects
  for select using (bucket_id = 'board-docs' and is_board_member());
create policy "admin laster opp board-docs" on storage.objects
  for insert with check (bucket_id = 'board-docs' and is_board_admin());
create policy "admin sletter board-docs" on storage.objects
  for delete using (bucket_id = 'board-docs' and is_board_admin());
