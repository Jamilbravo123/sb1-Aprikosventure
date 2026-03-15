-- News table for public editorial feed
create table if not exists public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text not null,
  category text not null check (category in ('deal', 'launch', 'partnership', 'milestone', 'press')),
  url text,
  image_url text,
  published_at timestamptz not null default now(),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS: public read for published items
alter table public.news enable row level security;

create policy "Public can read published news"
  on public.news for select
  using (is_published = true);

-- Index for sorting
create index idx_news_published_at on public.news (published_at desc);

-- Seed data
insert into public.news (title, summary, category, url, published_at, is_published) values
  ('Mashwara AI Launches Live Beta', 'Our AI-driven healthcare platform is now live in Pakistan, connecting patients with intelligent medical guidance.', 'launch', 'https://mashwara.ai', now() - interval '2 days', true),
  ('Venturetoken Achieves MiCA Registration', 'Venturetoken becomes Norway''s first MiCA-registered utility token, setting a new standard for European Web3 compliance.', 'milestone', 'https://venturetoken.io', now() - interval '7 days', true),
  ('BalderX Partners with Nordic Financial Institutions', 'Strategic partnership to bring tokenized alternative assets to institutional investors across the Nordics.', 'partnership', 'https://balderx.com', now() - interval '14 days', true),
  ('Aprikos Medical Expands EU Distribution', 'MDR-certified medical devices now available across 12 new European markets through expanded distribution network.', 'deal', 'https://aprikosmedical.com', now() - interval '21 days', true),
  ('ShippingX Announces Q1 2026 Launch', 'Tokenized maritime assets platform prepares for public launch with pilot partners in Norwegian shipping sector.', 'launch', null, now() - interval '30 days', true);
