-- v1.4: fri milepælsmodell — ubegrenset antall per prosjekt, arkivering for historikk.
-- Fjerner maks-3/posisjonsmodellen (unique + check forsvinner med kolonnen).

alter table board_milestones drop column position;
alter table board_milestones add column is_archived boolean not null default false;
