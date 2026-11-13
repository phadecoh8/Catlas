-- Run once in the Catlas Supabase project. Audit rows are append-only for app users;
-- only the server-side service role can read or insert them.
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'system'
    check (category in ('auth', 'ai', 'enrollment', 'admin_action', 'system', 'console')),
  severity text not null default 'info'
    check (severity in ('info', 'warn', 'critical')),
  result text not null default 'ok'
    check (result in ('ok', 'failed')),
  request_id text,
  actor_role text not null,
  actor_ref text not null,
  action text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx
  on public.audit_log (created_at desc);
create index if not exists audit_log_category_created_at_idx
  on public.audit_log (category, created_at desc);

alter table public.audit_log enable row level security;
revoke all on public.audit_log from public, anon, authenticated;
grant select, insert on public.audit_log to service_role;
