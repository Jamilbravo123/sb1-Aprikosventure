-- Kreves for at pg_cron skal kunne kalle Edge Function (ukentlig styrerapport).
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
