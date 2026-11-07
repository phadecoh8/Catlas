create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school text not null,
  faculty text not null,
  department text not null,
  level text not null,
  email text not null,
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_unique
  on public.waitlist_signups (lower(email));

alter table public.waitlist_signups enable row level security;

revoke all on table public.waitlist_signups from public;
revoke all on table public.waitlist_signups from anon;
revoke all on table public.waitlist_signups from authenticated;

grant select, insert on table public.waitlist_signups to service_role;
