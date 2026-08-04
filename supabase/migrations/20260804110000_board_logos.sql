-- Styreportal v1.1: valgfri prosjektlogo.
-- logo_url kan peke på eksisterende offentlige nettside-assets (/social/…)
-- eller filer lastet opp til den offentlige bøtta board-logos.

alter table board_projects add column logo_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('board-logos', 'board-logos', true, 2097152,
        array['image/png','image/jpeg','image/svg+xml','image/webp'])
on conflict (id) do nothing;

create policy "alle leser board-logos" on storage.objects
  for select using (bucket_id = 'board-logos');
create policy "admin laster opp board-logos" on storage.objects
  for insert with check (bucket_id = 'board-logos' and is_board_admin());
create policy "admin oppdaterer board-logos" on storage.objects
  for update using (bucket_id = 'board-logos' and is_board_admin())
  with check (bucket_id = 'board-logos' and is_board_admin());
create policy "admin sletter board-logos" on storage.objects
  for delete using (bucket_id = 'board-logos' and is_board_admin());
