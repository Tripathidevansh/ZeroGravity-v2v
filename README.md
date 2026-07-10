# SafeCircle AI

## The Idea

Navigation apps optimize for the fastest route. For women travelling alone, the more important question is often the one no app answers: *is this route actually safe?* SafeCircle AI is a community-driven safety navigation platform that scores every route by a real, deterministic **Women Safety Index (WSI)** — computed from live community incident reports and verified nearby infrastructure (police stations, hospitals, safe public places) — instead of just distance and time. Beyond recommending safer routes, the app provides a full real-time emergency response system: one tap (or one spoken word) captures the user's exact location and context, emails every trusted contact instantly, and gives them a live, no-login-required map to track the user until she's safe.

## Important Links

- **Live Deployment Link:** [Insert URL here]
- **Demo Video Link:** [Insert YouTube/Drive URL here]

## Features

- **Feature 1: Deterministic Women Safety Index (WSI) Engine** — every route and area is scored 0–100 from real community reports (weighted by severity and time-decay) and proximity to verified police, hospitals, and safe places — no randomness, fully explainable.
- **Feature 2: AI-Powered Safe Route Recommendation** — searches any real destination via live Mapbox autocomplete, generates multiple candidate routes, and ranks them by WSI instead of speed alone.
- **Feature 3: AI Route Explanation** — a Gemini-powered, one-shot natural-language explanation of *why* a route scored the way it did.
- **Feature 4: Live Journey Mode** — real browser GPS tracking with a live-following map, live safety score, and live ETA while a journey is in progress.
- **Feature 5: Emergency SOS System** — one-tap activation captures GPS location, reverse-geocoded address, device battery level, current route/destination/WSI, and generates a permanent, timestamped emergency record.
- **Feature 6: Voice-Activated SOS** — passive microphone-based threat detection; saying "help" triggers a visible 10-second countdown before SOS auto-activates, giving the user a window to cancel a false alarm while still enabling hands-free activation in a real emergency.
- **Feature 7: Real Emergency Notifications** — every trusted contact with an email on file is automatically emailed via Resend with the user's live location, Google Maps link, route, destination, safety index, and a live tracking link — not a simulated alert.
- **Feature 8: Public Live Tracking Page** — trusted contacts open a secure, unique tracking link with no account or login required, and watch the user's location update in real time via Supabase Realtime.
- **Feature 9: Community Safety Reports** — full CRUD incident reporting with category, severity, photo upload, and precise geolocation, feeding directly into the WSI engine.
- **Feature 10: Secure Authentication & Protected Routes** — real Supabase Auth with session persistence, protected routing, and row-level security on every table.

## Tech Stack & Tools

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS v4
- React Router
- TanStack Query (React Query)
- Framer Motion

**Backend & Infrastructure**
- Supabase — Postgres database, Authentication, Storage, Realtime (Broadcast + Postgres Changes), Edge Functions, Row-Level Security
- Deno (Supabase Edge Functions runtime)

**Maps & Location**
- Mapbox GL JS (interactive maps)
- Mapbox Search Box API (live destination autocomplete & nearby-place search — hospitals, police, pharmacies, metro stations, fuel stations)
- Mapbox Geocoding API (reverse geocoding for emergency address capture)
- Browser Geolocation API (live GPS tracking)
- Web Speech API (voice-activated SOS keyword detection)
- Battery Status API (device battery capture during SOS)

**AI Tools**
- **Google Gemini** — integrated in-product via a Supabase Edge Function to generate real-time, natural-language safety explanations for recommended routes.
- **Claude (Anthropic)** — used as an AI pair-programmer throughout the entire build, from initial architecture through backend integration, feature development, and QA auditing (see Documentation below).

**Communications**
- Resend — transactional email delivery for emergency alerts

## Documentation

### Architecture overview

SafeCircle AI is a single-page React application backed entirely by Supabase, with no custom backend server. The codebase is organized by feature (`src/features/<feature>/{components,api,hooks}`), each feature owning its own Supabase queries, React Query hooks, and UI, with shared primitives (buttons, cards, modals, map view) in a common design-system layer.

### Women Safety Index engine

The WSI is computed by a pure, deterministic function (`services/wsiEngine.ts`) — no machine learning, no randomness. For any location, it:
1. Finds community reports within a set radius, weighting each by severity (low/medium/high) and applying exponential time-decay so recent reports matter more than old ones.
2. Finds verified nearby infrastructure (police, hospitals, safe places) within a smaller radius and applies a proportional safety bonus.
3. Combines both into a 0–100 score, which is then color-coded (green/amber/red) consistently across every screen — the dashboard's "today's score," each generated route, and the live score during an active journey are all the same function, just fed different coordinates.

### Live nearby places

Rather than a static list of hospitals/police stations, every "nearby help" panel in the app calls Mapbox's Search Box Category API live, centered on the user's real GPS position (or a route's midpoint), across six categories — police, hospital, pharmacy, metro, fuel, and safe public places. Destination search uses the same provider's suggest/retrieve autocomplete flow, so users can search for any real address or landmark, not a fixed list.

### Emergency SOS and the public tracking page — the security model

This is the most architecturally deliberate part of the system. Every table in the app is protected by row-level security scoped to `auth.uid()` — but a trusted contact who clicks an emergency email link has no account and no session at all. Rather than weakening RLS with a broad "anyone can read" policy (which would leak every user's emergency data to any anonymous visitor), the tracking page is served through two narrowly-scoped mechanisms:

- A **Supabase Edge Function** (`get-emergency-tracking`), deployed without JWT verification, that uses the service role key internally but returns data for exactly one emergency event — matched strictly by a dedicated, unguessable `tracking_token` (kept separate from the event's primary key). An invalid or guessed token returns a generic "not found," never a partial match.
- **Supabase Realtime Broadcast** (not table-level `postgres_changes`, which *is* RLS-gated) for the live-moving-location feed. Broadcast channels are plain pub/sub, not tied to row-level permissions, so the user's device can publish live coordinates on a channel named after the tracking token, and the anonymous tracking page can subscribe to that exact channel — without either side ever being granted table read access.

The result: trusted contacts get a genuinely live, no-login tracking experience, while the underlying security model stays exactly as strict as every other table in the app.

### Voice-activated SOS

Building on the existing Emergency SOS activation flow, a passive microphone listener (Web Speech API) runs during active use, listening for the trigger word "help." On detection, it surfaces a visible 10-second countdown UI rather than firing instantly — giving the user a clear, cancellable window before the same SOS activation sequence (GPS capture, trusted contact emails, emergency record) runs automatically. This preserves hands-free activation for a genuine emergency while guarding against false positives from ambient conversation.

### How AI tools were coordinated

The application was built in structured phases with Claude acting as an iterative AI pair-programmer rather than a one-shot code generator:

1. **Architecture phase** — folder structure, routing, design system, and component conventions were established first, before any business logic, so every later feature had a consistent foundation to extend rather than redesign.
2. **Frontend phase** — the complete UI was built against realistic mock data to validate the user flow (search → route recommendation → journey → reports → notifications → profile) before any backend existed.
3. **Backend integration phase** — mock data was systematically replaced with real Supabase tables, RLS policies, and the WSI engine, verified via TypeScript compilation and production builds after every change.
4. **Feature extension phase** — Emergency SOS, live GPS tracking, Resend email delivery, and the public tracking page were added incrementally, each verified against the existing architecture before moving to the next, rather than batched into one large unreviewed change.
5. **QA and audit passes** — dedicated review passes specifically hunting for dead code, unused mock data, accessibility gaps, and security issues (such as the RLS/public-access tension solved above), with fixes verified by re-running static checks rather than assumed.

Gemini, by contrast, is used purely as an in-product feature — a single, stateless call per route (not a conversational assistant) that turns a route's WSI and characteristics into a short, human-readable explanation for the end user.