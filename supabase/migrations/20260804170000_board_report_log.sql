-- Logg over sendte ukesrapporter — gir «siden forrige utsending» og hindrer dubletter.
create table board_report_log (
  id uuid primary key default gen_random_uuid(),
  sent_at timestamptz not null default now(),
  endringer int not null,
  mottakere int not null
);

alter table board_report_log enable row level security;

-- Kun admin kan lese loggen; skriving skjer med service_role fra Edge Function (omgår RLS).
create policy "admin leser rapportlogg" on board_report_log
  for select using (is_board_admin());
