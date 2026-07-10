-- ============================================================================
-- SafeCircle AI — Richer emergency capture + trusted contact emails
-- Run after 0001, 0002, 0003.
-- ============================================================================

alter table public.emergency_events
  -- Separate from the row's primary key on purpose: the tracking link (Task
  -- 6) is public-facing, and a dedicated token means it can be scoped/rotated
  -- independently of the id used everywhere else internally.
  add column if not exists tracking_token uuid not null default gen_random_uuid(),
  add column if not exists destination_name text,
  add column if not exists destination_lat double precision,
  add column if not exists destination_lng double precision,
  add column if not exists route_label text,
  add column if not exists wsi_score int,
  add column if not exists journey_status text,
  add column if not exists battery_level int,
  add column if not exists address text;

create unique index if not exists emergency_events_tracking_token_idx
  on public.emergency_events (tracking_token);

-- Trusted contacts need a real email address to receive emergency alerts.
alter table public.trusted_contacts
  add column if not exists email text;
