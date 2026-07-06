-- ─────────────────────────────────────────────────────────
-- Talkadoo waitlist table (run once in your Supabase EU project's SQL editor)
-- GDPR-minimal: we store only an email, the language they're interested in,
-- and when they signed up. Row-Level Security lets anonymous visitors INSERT
-- their own signup but never read the list back.
-- ─────────────────────────────────────────────────────────

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  locale      text,                       -- 'de' | 'es' | 'sv' | 'en' | null
  source      text default 'website',
  created_at  timestamptz not null default now(),
  constraint waitlist_email_valid check (position('@' in email) > 1)
);

-- One signup per email address.
create unique index if not exists waitlist_email_unique
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Anonymous visitors may add themselves to the waitlist…
create policy "anon can join waitlist"
  on public.waitlist for insert
  to anon
  with check (true);

-- …but nobody reads the list except via the service role (server-side).
-- (No SELECT policy = no public reads.)
