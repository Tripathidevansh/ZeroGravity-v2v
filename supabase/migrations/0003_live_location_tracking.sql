-- ============================================================================
-- SafeCircle AI — Live GPS tracking
-- Run after 0001_init.sql and 0002_emergency_sos.sql.
-- ============================================================================

alter table public.journeys
  add column if not exists current_lat double precision,
  add column if not exists current_lng double precision,
  add column if not exists current_heading double precision,
  add column if not exists current_speed double precision,
  add column if not exists current_accuracy double precision,
  add column if not exists location_updated_at timestamptz;

-- Enables Supabase Realtime change notifications on this table. RLS still
-- applies to Realtime the same as regular queries — this does not by itself
-- expose journeys to anyone who couldn't already read them. The public
-- emergency-tracking access model (Task 6) is handled separately and does
-- NOT rely on relaxing this table's RLS.
alter publication supabase_realtime add table public.journeys;
