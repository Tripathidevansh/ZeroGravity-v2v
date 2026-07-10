-- ============================================================================
-- SafeCircle AI — Emergency SOS
-- Run after 0001_init.sql in the Supabase SQL editor.
-- ============================================================================

create table if not exists public.emergency_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.journeys(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'resolved')),
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz,
  lat double precision not null,
  lng double precision not null,
  -- Append-only log of { at: ISO string, label: string } entries.
  timeline jsonb not null default '[]'::jsonb,
  -- Snapshot of { contactId, name, status, sentAt } per trusted contact
  -- notified during this event — see notifyTrustedContacts() for the
  -- simulated-vs-real integration point.
  notified_contacts jsonb not null default '[]'::jsonb
);

create index if not exists emergency_events_user_id_idx on public.emergency_events (user_id, triggered_at desc);

alter table public.emergency_events enable row level security;

create policy "Users manage their own emergency events"
  on public.emergency_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
