-- ============================================================================
-- SafeCircle AI — Live emergency location (Task 6/7)
-- Run after 0001–0004.
-- ============================================================================

-- Emergency events get their own live-location columns, separate from
-- journeys.current_*, because SOS can be triggered from the Dashboard's
-- floating button with no active journey at all — the tracking page must
-- work either way.
alter table public.emergency_events
  add column if not exists current_lat double precision,
  add column if not exists current_lng double precision,
  add column if not exists current_heading double precision,
  add column if not exists current_speed double precision,
  add column if not exists location_updated_at timestamptz;

-- No new RLS policy here on purpose. Public tracking access (Task 6) is
-- handled entirely by a service-role edge function plus a Realtime
-- Broadcast channel scoped by tracking_token — neither requires relaxing
-- row-level security on this table for anonymous users. See
-- supabase/functions/get-emergency-tracking for the access model.
