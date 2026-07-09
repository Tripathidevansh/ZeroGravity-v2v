# SafeCircle AI — Phase 1: Project Foundation

> "Google Maps tells you the fastest route. SafeCircle AI tells you the safest route."

Built for **Vibe2Vision (IEEE SHE Aspire 3.0)** — Track 1: SafeSphere.

This is **Phase 1 only**: architecture, routing, layouts, design tokens, and
reusable components. No AI, maps, backend, or Supabase logic is implemented
yet — every screen is a real, styled shell ready for Phase 2 to fill in.

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
