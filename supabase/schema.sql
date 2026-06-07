-- Run this in the Supabase SQL Editor:
--   Dashboard -> SQL Editor -> New query -> paste -> Run.

create table if not exists public.products (
  id          uuid          primary key default gen_random_uuid(),
  item_id     text          not null unique,
  title       text          not null,
  price       numeric(12,2) not null check (price >= 0),
  created_at  timestamptz   not null default now()
);

-- Row Level Security stays ON (Supabase default). The API authenticates with
-- the service_role key, which bypasses RLS, so no policy is needed for this
-- task. (If you instead use the anon/public key, you must add an INSERT/SELECT
-- policy here.)
alter table public.products enable row level security;
