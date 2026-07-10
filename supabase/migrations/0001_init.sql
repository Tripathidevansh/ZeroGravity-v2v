-- ============================================================================
-- SafeCircle AI — Phase 3 schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- Idempotent-ish: safe to re-run on a fresh project.
-- ============================================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles
-- One row per auth.users row. Created automatically via trigger on signup.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  avatar_url text,
  member_since timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- saved_places
-- ----------------------------------------------------------------------------
create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text not null,
  category text not null default 'custom'
    check (category in ('home','office','college','transit','airport','custom')),
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);

alter table public.saved_places enable row level security;

create policy "Users manage their own saved places"
  on public.saved_places for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- community_reports
-- Publicly readable (any authenticated user can see all reports); writable
-- only by the report's author.
-- ----------------------------------------------------------------------------
create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null
    check (category in ('poor-lighting','harassment','unsafe-area','suspicious-activity','broken-streetlight')),
  title text not null,
  description text not null,
  location_text text not null,
  lat double precision not null,
  lng double precision not null,
  severity text not null check (severity in ('low','medium','high')),
  image_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  verified_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists community_reports_created_at_idx on public.community_reports (created_at desc);
create index if not exists community_reports_lat_lng_idx on public.community_reports (lat, lng);

alter table public.community_reports enable row level security;

create policy "Reports are viewable by all authenticated users"
  on public.community_reports for select
  to authenticated
  using (true);

create policy "Users insert their own reports"
  on public.community_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update their own reports"
  on public.community_reports for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users delete their own reports"
  on public.community_reports for delete
  to authenticated
  using (auth.uid() = user_id);

-- Notify nearby users + bump verified_count is handled at the application
-- layer for Phase 3 (see notifications section) to keep this migration
-- portable across Supabase plans (no pg_cron / pg_net dependency assumed).

-- ----------------------------------------------------------------------------
-- infrastructure_points
-- Reference data: police stations, hospitals, 24/7 safe places. Seeded once,
-- read-only for regular users. Used for map markers + WSI nearby-infra bonus.
-- ----------------------------------------------------------------------------
create table if not exists public.infrastructure_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('police','hospital','safe-place')),
  address text not null,
  lat double precision not null,
  lng double precision not null
);

alter table public.infrastructure_points enable row level security;

create policy "Infrastructure points are viewable by all authenticated users"
  on public.infrastructure_points for select
  to authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- journeys
-- ----------------------------------------------------------------------------
create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_name text not null,
  destination_lat double precision not null,
  destination_lng double precision not null,
  origin_lat double precision not null,
  origin_lng double precision not null,
  distance_km numeric not null,
  duration_min int not null,
  wsi_score int not null,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists journeys_user_id_idx on public.journeys (user_id, started_at desc);

alter table public.journeys enable row level security;

create policy "Users manage their own journeys"
  on public.journeys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('alert','success','safety','ai')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users manage their own notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- trusted_contacts
-- ----------------------------------------------------------------------------
create table if not exists public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relation text not null,
  phone text not null,
  is_emergency_contact boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.trusted_contacts enable row level security;

create policy "Users manage their own trusted contacts"
  on public.trusted_contacts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Storage bucket for report images (create via dashboard or here)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do nothing;

create policy "Report images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'report-images');

create policy "Authenticated users can upload report images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'report-images');

-- ----------------------------------------------------------------------------
-- Community-wide aggregate stats
-- RLS intentionally restricts most tables to each user's own rows (journeys,
-- notifications) or requires auth (reports). This function exposes only
-- COUNT() aggregates across all users — no individual rows — so the
-- dashboard's "Community statistics" widget can show real cross-user numbers
-- without weakening row-level security anywhere.
-- ----------------------------------------------------------------------------
create or replace function public.get_community_stats()
returns table (
  total_reports bigint,
  active_members bigint,
  safer_routes_chosen bigint,
  reports_this_week bigint
)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from public.community_reports) as total_reports,
    (select count(*) from public.profiles) as active_members,
    (select count(*) from public.journeys where status = 'completed') as safer_routes_chosen,
    (select count(*) from public.community_reports where created_at > now() - interval '7 days') as reports_this_week;
$$;

grant execute on function public.get_community_stats() to authenticated;

-- ----------------------------------------------------------------------------
-- Seed data — a handful of infrastructure points around Noida/Delhi NCR so
-- the map + WSI engine have something real to read on a fresh project.
-- ----------------------------------------------------------------------------
insert into public.infrastructure_points (name, type, address, lat, lng) values
  ('Sector 58 Police Post', 'police', 'Sector 58, Noida', 28.6162, 77.3701),
  ('Sector 39 Police Station', 'police', 'Sector 39, Noida', 28.5729, 77.3372),
  ('Fortis Hospital', 'hospital', 'Sector 62, Noida', 28.6210, 77.3620),
  ('Kailash Hospital', 'hospital', 'Sector 27, Noida', 28.5787, 77.3288),
  ('24/7 Fuel Station', 'safe-place', 'Sector 62 Main Road, Noida', 28.6105, 77.3660),
  ('DLF Mall of India', 'safe-place', 'Sector 18, Noida', 28.5678, 77.3262),
  ('Metro Station Help Desk', 'safe-place', 'Botanical Garden Metro, Noida', 28.5651, 77.3340)
on conflict do nothing;
