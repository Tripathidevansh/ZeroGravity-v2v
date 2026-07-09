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


Deploys as a static Vite app — works out of the box on Vercel.


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

