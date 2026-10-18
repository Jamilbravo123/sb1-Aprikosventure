-- Investormiddag: husk når verten kopierte en gjests lenke, så portalen viser hvem som har fått den.
alter table dinner_guests add column if not exists link_copied_at timestamptz;
