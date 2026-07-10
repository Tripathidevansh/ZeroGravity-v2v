-- ============================================================================
-- Nirbhaya AI — SOS Camera Capture
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query).
--
-- What this script creates:
--   1. A Supabase Storage bucket  →  "sos-captures"
--   2. Storage RLS policies       →  authenticated users can upload/read
--                                    their own photos only
--   3. Table: public.sos_photo_captures
--              Records every photo taken during an SOS event, with a
--              reference to the storage object and the emergency event.
--   4. Table RLS policies         →  each user can only see their own rows
--
-- Prerequisites:
--   • 0001_init.sql, 0002_emergency_sos.sql must already be applied.
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1 — Create the Storage bucket
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sos-captures',
  'sos-captures',
  false,                                  -- private bucket; photos are sensitive
  5242880,                                -- 5 MB max per photo
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2 — Storage RLS policies
-- Each authenticated user may:
--   • Upload objects  whose path starts with  <their_user_id>/
--   • Read / download objects  they own
-- ─────────────────────────────────────────────────────────────────────────────

-- Upload policy
create policy "Authenticated users upload their own SOS captures"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sos-captures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Read policy
create policy "Users read their own SOS captures"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'sos-captures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete policy (user can remove their own captures)
create policy "Users delete their own SOS captures"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'sos-captures'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3 — sos_photo_captures table
-- One row per photo taken during an SOS event.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.sos_photo_captures (
  -- ── Identity ────────────────────────────────────────────────────────────
  id               uuid        primary key default gen_random_uuid(),

  -- ── Relationships ────────────────────────────────────────────────────────
  user_id          uuid        not null references auth.users(id) on delete cascade,
  -- Links to the active SOS event (nullable in case the row is created
  -- before the event row is committed, or for standalone camera tests).
  emergency_event_id uuid      references public.emergency_events(id) on delete set null,

  -- ── Storage reference ────────────────────────────────────────────────────
  -- e.g. "<user_id>/2024-06-15T10:30:00Z_abc123.jpg"
  storage_path     text        not null,
  -- The full HTTPS URL returned by Supabase Storage after upload.
  -- Kept denormalised for fast retrieval without an extra API call.
  public_url       text,

  -- ── Capture metadata ─────────────────────────────────────────────────────
  -- How the SOS was triggered when this photo was taken
  trigger_type     text        not null default 'button'
                               check (trigger_type in ('button', 'voice')),
  -- Device camera used
  camera_facing    text        not null default 'environment'
                               check (camera_facing in ('user', 'environment')),
  -- GPS coordinates at the moment of capture (may differ from the event
  -- coords if the device moved between trigger and capture completion).
  lat              double precision,
  lng              double precision,
  -- Human-readable reverse-geocoded address (populated client-side if available)
  address          text,
  -- MIME type of the saved image
  mime_type        text        not null default 'image/jpeg',
  -- File size in bytes (set after upload)
  file_size_bytes  integer,

  -- ── Timestamps ───────────────────────────────────────────────────────────
  captured_at      timestamptz not null default now()
);

-- Index for fast per-user and per-event lookups
create index if not exists sos_photo_captures_user_idx
  on public.sos_photo_captures (user_id, captured_at desc);

create index if not exists sos_photo_captures_event_idx
  on public.sos_photo_captures (emergency_event_id, captured_at desc);


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4 — Table RLS policies
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.sos_photo_captures enable row level security;

-- Users can insert their own capture records
create policy "Users insert their own SOS captures"
  on public.sos_photo_captures for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can read their own capture records
create policy "Users read their own SOS captures"
  on public.sos_photo_captures for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own capture records
create policy "Users delete their own SOS capture records"
  on public.sos_photo_captures for delete
  to authenticated
  using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 5 — Convenience view (optional)
-- Joins captures with their emergency event for easy querying.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace view public.sos_captures_with_event as
select
  c.id,
  c.user_id,
  c.emergency_event_id,
  c.storage_path,
  c.public_url,
  c.trigger_type,
  c.camera_facing,
  c.lat,
  c.lng,
  c.address,
  c.mime_type,
  c.file_size_bytes,
  c.captured_at,
  -- Emergency event fields
  e.status            as event_status,
  e.triggered_at      as event_triggered_at,
  e.tracking_token    as event_tracking_token
from public.sos_photo_captures c
left join public.emergency_events e on e.id = c.emergency_event_id;

-- RLS for the view is inherited from the underlying table because Supabase
-- evaluates policies on the base tables, not views.


-- ─────────────────────────────────────────────────────────────────────────────
-- Done!
-- After running this script, the feature hooks (useCameraCapture.ts) can
-- upload to the "sos-captures" bucket and insert rows into sos_photo_captures.
-- ─────────────────────────────────────────────────────────────────────────────
