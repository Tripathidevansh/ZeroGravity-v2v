# SafeCircle AI — Phase 2: Complete Frontend Experience

> "Google Maps tells you the fastest route. SafeCircle AI tells you the safest route."

Built for **Vibe2Vision (IEEE SHE Aspire 3.0)** — Track 1: SafeSphere.

Phase 1 delivered the architecture. **Phase 2 delivers the full, navigable
frontend experience on mock data** — every screen, every flow, no backend.

## Tech stack

- React 19 + Vite + TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/vite`, CSS-first `@theme` tokens)
- React Router v7 (data router)
- TanStack React Query (client configured, no queries yet)
- Framer Motion (installed, minimal — visual polish is a later phase)
- Supabase-ready service layer (`src/services/supabaseClient.ts`, unwired)
- lucide-react icons, clsx + tailwind-merge for class composition

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build (type-checks first)
```

Deploys as a static Vite app — works out of the box on Vercel.

## Folder structure

```
src/
  components/
    ui/        # atomic, style-only primitives (Button, Card, Input, Badge, Modal, Toast, ...)
    shared/     # composed, app-aware pieces (Navbar, Sidebar, Footer, SearchBar, ...)
  features/     # empty in Phase 1 — see features/README.md for the convention
  pages/        # route-level screens, grouped by page (landing/, auth/, dashboard/, ...)
  hooks/        # reusable, feature-agnostic hooks (useMediaQuery, useLocalStorage)
  services/     # external service clients (Supabase placeholder lives here)
  contexts/     # cross-cutting React context providers (ToastContext)
  layouts/      # PublicLayout, AuthenticatedLayout — compose Navbar/Sidebar/Footer + <Outlet />
  lib/          # small framework glue (cn(), queryClient)
  types/        # shared, cross-feature TypeScript types
  routes/       # route path constants + the router definition
  utils/        # constants and pure helpers
  styles/       # reserved for future global style modules
```

## Routing

| Route              | Layout              | Page                  |
|---------------------|----------------------|-----------------------|
| `/`                  | Public               | Landing               |
| `/login`             | Public               | Login                 |
| `/signup`            | Public               | Signup                |
| `/forgot-password`   | Public               | Forgot Password       |
| `/dashboard`         | Authenticated        | Dashboard shell        |
| `/reports`           | Authenticated        | Reports shell          |
| `/journey`           | Authenticated        | Journey shell          |
| `/profile`           | Authenticated        | Profile shell          |
| `*`                  | —                    | 404                    |

Route strings are never hardcoded — always import `ROUTES` from `src/routes/paths.ts`.

There are no auth guards yet; that lands with real Supabase auth in a later phase.

## Design tokens

Defined in `src/index.css` under `@theme`: primary (purple), secondary (blue),
safe/caution/risk semantic colors, neutral (slate), dark-theme surface colors,
radius scale, and shadow tokens. Typography pairs **Space Grotesk** (display)
with **Inter** (body).

## What's intentionally NOT here yet

Maps, the Women Safety Index, community reporting logic, AI route
recommendation/explanation, Journey Mode logic, Supabase auth/data, and any
backend — all deferred to later phases per the Phase 1 scope.

---

## Phase 2 — feature map

All data is mock, deterministic per destination (same search always returns
the same routes), and lives under `src/features/*/mockData.ts`.

| Feature | Where |
|---|---|
| Destination search (recent/suggested/saved) | `features/destination-search`, used in Dashboard & Journey |
| Safe route recommendation (WSI-scored cards) | `features/route-recommendation`, `/routes` |
| Women Safety Index | `components/shared/WSIScore.tsx` + `utils/safety.ts` (single source of truth for 90/70 thresholds) |
| Route details (map, timeline, nearby places, reports) | `features/route-details`, `/routes/:routeId` |
| Community safety reports (feed + filters) | `features/community-reports`, `/reports` |
| Report an incident (form, UI only) | `features/report-incident`, modal on `/reports` |
| Journey Mode (live-ticking mock simulation) | `features/journey-mode`, `/journey` |
| Dashboard widgets | `features/dashboard`, `/dashboard` |
| Profile (contacts, history, settings) | `features/profile`, `/profile` |
| Notifications | `features/notifications`, `/notifications` |

**New routes added on top of Phase 1:** `/routes` (results), `/routes/:routeId`
(details), `/notifications` — all under `AuthenticatedLayout`, registered in
`routes/router.tsx` and `routes/paths.ts`.

**Cross-page state:** `contexts/RouteSearchContext.tsx` holds the searched
destination, generated routes, and selected route for the current session, so
Dashboard → Route Results → Route Details → Journey share state without a
backend. It resets on a hard refresh, which is expected until Supabase/data
persistence lands.

**Map:** `components/shared/MapView.tsx` renders a real Mapbox GL map when
`VITE_MAPBOX_TOKEN` is set, and otherwise falls back to a stylized mock map
with the same routes/markers — so the app never shows a broken map during a
demo. Add a token later with zero component changes.

**Animation:** kept intentionally minimal per the brief — hover states,
button interactions, and a short fade/slide page transition in both layouts
via Framer Motion. No scroll-triggered or decorative animation.


---

## Phase 3 — Backend integration (Supabase + Gemini + Mapbox)

The UI is unchanged from Phase 2. Every page now reads and writes real data
instead of mock arrays. To bring it live:

### 1. Create a Supabase project

At https://supabase.com, create a project, then in the SQL editor run:

```
supabase/migrations/0001_init.sql
```

This creates all tables (`profiles`, `saved_places`, `community_reports`,
`infrastructure_points`, `journeys`, `notifications`, `trusted_contacts`),
enables RLS with per-user policies everywhere, creates the `report-images`
storage bucket, a `get_community_stats()` aggregate function (SECURITY
DEFINER, so cross-user dashboard stats work without weakening RLS on the
underlying tables), and seeds a handful of real police/hospital/safe-place
points around Noida/Delhi NCR so the map and WSI engine have real data on a
fresh project.

A `profiles` row is created automatically for every new signup via a trigger
— no manual step needed there.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your project's
API settings. `VITE_MAPBOX_TOKEN` is optional — without it, `MapView` falls
back to the stylized mock map rather than showing anything broken.

### 3. Deploy the Gemini edge function

The AI Route Explanation calls Gemini through a Supabase Edge Function so the
API key never reaches the browser bundle:

```bash
supabase functions deploy route-explanation
supabase secrets set GEMINI_API_KEY=your-key-here
```

Get a Gemini key at https://aistudio.google.com/app/apikey.

### 4. Run it

```bash
npm install
npm run dev
```

Sign up for a real account (Supabase Auth) — you'll land on a live dashboard
with a WSI score of 100 and no reports, since it's a fresh database. File a
report or two from `/reports` to see the score and map respond.

### What's real now vs. Phase 2

| Area | Phase 2 | Phase 3 |
|---|---|---|
| Auth | Fake redirect on submit | Real Supabase Auth (signup/login/reset/session), protected routes |
| Community reports | Static array | Full CRUD, image upload to Storage, real lat/lng |
| Women Safety Index | Hash-based fake number | Deterministic engine (`services/wsiEngine.ts`) scoring real reports by severity + time-decay + proximity to real infrastructure |
| Map | Mock markers only | Real infrastructure + report markers; live Mapbox when a token is set |
| Journeys | In-memory only | Persisted to `journeys`, real history, real active-journey state |
| Notifications | Static array | Real per-user rows, created on journey start/complete |
| Profile | Hardcoded person | Real profile, real contribution count, real trusted contacts, real journey history, real saved places |
| AI Route Explanation | — | New: one-shot Gemini call via edge function, not a chatbot |
| Community statistics | Static numbers | Real cross-user aggregates via a SECURITY DEFINER Postgres function |
| Offline handling | — | Toast on connection loss/restore |

### Known gaps / honest limitations

- **Not tested against a live project** — I don't have a Supabase/Gemini/Mapbox
  account in this environment, so this is thoroughly type-checked and
  built clean, but you should click through it once yourself after setup.
- **Report moderation UI doesn't exist.** The schema supports a report
  `status` of pending/approved/rejected and the notification type list
  includes "Report Approved," but no admin screen was in scope to actually
  approve one — that's a natural next step, not implemented here.
- **"Suggested" destinations** in search remain a small static list — there's
  no places-search API wired up for that slice specifically (saved places and
  recent destinations are fully real).
- **Settings toggles on Profile** are local UI state only — there's no
  `user_settings` table in this migration since it wasn't specified.
