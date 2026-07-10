# Nirbhaya AI

**The Idea:** Every navigation app in the world optimizes for one thing — speed. They tell you the fastest route. But for millions of women travelling alone — on late-night commutes, through unfamiliar streets, in poorly-lit areas — the question that actually matters is never answered: *is this route safe?* Nirbhaya AI answers that question. It is a full-stack, community-driven women's safety platform that scores every route by a real, deterministic **Women Safety Index (WSI)** — computed from live community incident reports and verified nearby infrastructure — and wraps it in a complete real-time emergency response system that activates with one tap, one spoken word, or automatically when the user cannot reach their phone.

---

## Important Links

- **Live Deployment Link:** https://nirbhayaai.vercel.app/
- **Demo Video Link:** https://nirbhayaai.vercel.app/

---

## Features

- **Feature 1: Deterministic Women Safety Index (WSI) Engine** — A pure, explainable 0–100 safety score computed for any location from live community incident reports (weighted by severity × exponential time-decay) and proximity to verified police stations, hospitals, and safe public places. No machine learning. No randomness. Fully auditable — the same function powers every score across every screen.

- **Feature 2: AI-Powered Safe Route Recommendation** — Users search any real destination via live Mapbox autocomplete. The system generates multiple candidate routes via the Mapbox Directions API, scores each by WSI, and ranks them safest-first — not fastest-first. The safest route is always at the top.

- **Feature 3: AI Route Explanation (Google Gemini)** — A Supabase Edge Function calls the Gemini API with the route's WSI score, incident categories, and nearby infrastructure count. It returns a 2–3 sentence, human-readable explanation of *why* a route scored the way it did — delivered directly in the Route Details view, in plain language the user can act on.

- **Feature 4: Live Journey Mode with Real-Time GPS Tracking** — Users can start a tracked journey to any destination. The app continuously tracks GPS position, recomputes the WSI live at their current location, updates ETA and remaining distance in real time, and broadcasts live coordinates to Supabase Realtime so trusted contacts can follow along on a live map — all while the full SOS system remains one tap away.

- **Feature 5: Emergency SOS System (One-Tap Activation)** — A single tap captures GPS coordinates, reverse-geocoded address, device battery level, current route context, and destination — creates a permanent, timestamped emergency record in the database, emails every trusted contact instantly with a live tracking link, and silently photographs the surroundings. The user is taken to a live Emergency Dashboard showing everything captured in real time.

- **Feature 6: Voice-Activated SOS (Hands-Free, On-Device)** — A passive microphone listener powered by the browser's native Web Speech API runs continuously during use. Saying *"help", "help me", "emergency", "SOS",* or *"save me"* triggers a 10-second visual countdown before full SOS activation — giving the user a clear window to cancel a false alarm without disabling hands-free protection in a genuine emergency. No cloud speech API. No subscription. Fully on-device.

- **Feature 7: SOS Camera Capture (Silent Evidence Photography)** — When SOS activates, the app silently opens the camera, captures a JPEG frame of the surroundings, closes the camera, and uploads the photo to a private Supabase Storage bucket. A metadata record (timestamp, GPS, trigger type, signed URL) is saved in the database. Photos appear in a full gallery with zoom and download on the Emergency Dashboard — automatic evidence capture that requires zero user action.

- **Feature 8: Real Emergency Email Notifications (Resend)** — Not a simulation. Every trusted contact with an email on file receives a real transactional email containing the user's name, activation timestamp, reverse-geocoded address, Google Maps link, current destination, Women Safety Index, device battery level, and a one-click live tracking link — all via the Resend API through a Supabase Edge Function. Per-contact delivery status is recorded and shown on the Emergency Dashboard.

- **Feature 9: Public Live Tracking Page (No Login Required)** — Trusted contacts who click the email link land on a live tracking page at `/track/<token>`. No Supabase account required. The page loads initial emergency context via a token-gated Edge Function and receives live location updates via Supabase Realtime Broadcast — watching the user move on a real Mapbox map in real time, until she's safe.

- **Feature 10: Community Safety Reports** — Full incident reporting with category (harassment, poor lighting, unsafe area, suspicious activity, broken streetlight), severity (low/medium/high), photo upload, precise GPS coordinates, and description. Reports feed directly into the WSI engine — every new report immediately changes route scores for every user near that location. 80+ realistic seed reports across Delhi, Gurgaon, and Noida for realistic demo coverage.

- **Feature 11: Trusted Contacts & Profile Management** — Users manage their profile and a personal list of trusted emergency contacts (name, relation, phone, email). Contacts with email addresses receive real SOS notifications. Contacts can be marked as primary emergency contacts.

- **Feature 12: Fully Responsive, Production-Quality UI** — The entire application is responsive across desktops, laptops, tablets, Android phones, iPhones (including Dynamic Island models), and small phones down to 320px. Mobile users get a thumb-reachable bottom navigation bar with safe-area inset support for notch and home-indicator devices.

---

## Tech Stack & Tools

**Frontend**
- React 19, TypeScript 5, Vite 8 — modern, type-safe component architecture
- Tailwind CSS v4 with a custom Stitch design system (Poppins + Quicksand typography, warm cream/pink Nirbhaya palette)
- React Router v7 — client-side routing with protected routes
- TanStack Query v5 — server state management, caching, and mutations
- Framer Motion — page transitions and micro-animations

**Backend & Infrastructure**
- Supabase Postgres — primary database with 9 tables, all protected by Row-Level Security (`auth.uid()` scoped)
- Supabase Auth — email/password authentication with persistent sessions
- Supabase Storage — two buckets: `community-reports` (public) and `sos-captures` (private, per-user RLS)
- Supabase Realtime — Broadcast channels for anonymous live tracking + Postgres Changes for authenticated dashboard
- Supabase Edge Functions (Deno runtime) — Gemini AI integration, Resend email delivery, public tracking API

**Maps & Location**
- Mapbox GL JS — interactive route maps with custom animated markers
- Mapbox Directions API — multi-route generation
- Mapbox Search Box API — live destination autocomplete + nearby place search (police, hospitals, pharmacies, metro, safe places)
- Mapbox Geocoding API — reverse geocoding (GPS → human-readable address)
- Browser Geolocation API — live GPS tracking (`watchPosition`)

**AI Tools**
- **Google Gemini** — integrated in-product via a Supabase Edge Function to generate real-time, natural-language safety explanations for recommended routes. One stateless call per route. Deployed as `explain-route` Edge Function with the API key stored securely as a Supabase secret — never exposed to the client.
- **Claude (Anthropic) / Antigravity AI** — used as an AI pair-programmer throughout the entire build: architecture design, database schema, RLS policy design, feature implementation, security auditing, and responsive layout work. Each feature was planned, implemented, and verified against a TypeScript build before moving to the next.

**Communications**
- Resend — real transactional email delivery for emergency SOS alerts (not simulated)

**Browser APIs**
- Web Speech API — voice keyword detection (on-device, no cloud)
- Battery Status API — device battery capture at SOS activation
- MediaDevices API — silent SOS camera capture

---

## Documentation

### The Core Problem — and Why Existing Solutions Fall Short

Navigation apps have solved speed. But speed and safety are not the same problem. A route that takes 3 minutes longer but avoids a poorly-lit street with a history of harassment incidents is categorically better for a woman travelling alone — and no mainstream navigation product surfaces that information. Community reports exist on platforms like Google Maps, but they are reviews, not structured safety signals. They cannot be aggregated into a live, per-route score. Nirbhaya AI is built entirely around the premise that **safety is a routing parameter**, not an afterthought.

---

### Women Safety Index (WSI) Engine

The WSI is computed by a pure, deterministic TypeScript function (`src/services/wsiEngine.ts`) — no machine learning, no external API, no randomness. For any GPS coordinate, it:

1. **Finds community reports within a set radius** and weights each by:
   - Severity: `low = 1`, `medium = 2`, `high = 3`
   - Exponential time-decay: `weight × e^(-λ × days_since_report)` — so a harassment report from last week matters far more than one from six months ago
   - Proximity: reports closer to the point are penalised more heavily

2. **Finds verified nearby infrastructure** (police stations, hospitals, safe public places) and applies a proportional safety bonus — more nearby infrastructure = lower effective risk

3. **Normalises** both into a 0–100 score with a consistent colour system: 🟢 70+ (safe) · 🟡 40–69 (moderate) · 🔴 0–39 (high risk)

This same function — fed different coordinates — powers the dashboard's "today's score," each generated route's WSI, the live score during an active journey, and the live score on the Emergency Dashboard. One deterministic engine. Zero inconsistency.

---

### Emergency SOS and the Public Tracking Page — The Security Model

This is the most architecturally deliberate part of the system. Every table in the application is protected by Row-Level Security scoped to `auth.uid()`. But a trusted contact who clicks an emergency email link has no Supabase account. The naive solution — a `FOR ALL USING (true)` policy — would expose every user's emergency data to any anonymous visitor.

Nirbhaya AI solves this without weakening RLS:

- **A Supabase Edge Function** (`get-emergency-tracking`) is deployed without JWT verification and uses the service-role key internally, but returns data for **exactly one** emergency event — matched strictly by a `tracking_token` (a dedicated UUID separate from the event's primary key). An invalid or guessed token returns a generic 404. A valid token returns only that event's safe-to-share fields.

- **Supabase Realtime Broadcast** (not `postgres_changes`, which *is* RLS-gated) is used for the live-moving-location feed. Broadcast channels are plain pub/sub — not tied to row-level permissions. The user's device publishes live coordinates on a channel named `emergency-location:<tracking_token>`. The anonymous tracking page subscribes to that exact channel — without either side ever being granted table-read access.

The result: trusted contacts get a genuinely live, no-login tracking experience while the underlying security model remains exactly as strict as every other part of the application.

---

### Voice-Activated SOS — Design Decisions

Building voice SOS with the browser's native Web Speech API introduced two significant engineering challenges:

**Challenge 1 — False positives.** Triggering an SOS from ambient conversation ("can you help me find my keys?") would be worse than no voice SOS at all. The solution is a mandatory **10-second cancellation countdown** — a full-screen overlay with a large countdown timer, the exact phrase that was recognized, a Cancel button, and continued listening for cancel keywords ("stop", "cancel", "false alarm"). The countdown is long enough to cancel comfortably; the voice cancel option means the user doesn't even need to reach the phone.

**Challenge 2 — Browser timeout.** Chrome's `SpeechRecognition` engine stops after ~60 seconds of silence. The `onend` handler auto-restarts recognition whenever Voice SOS is enabled and a countdown is not in progress — creating continuous, uninterrupted coverage with no user action.

**Challenge 3 — Multiple activation paths share one camera service.** The SOS button and the voice countdown are in different parts of the component tree. A React hook-per-instance approach (what was built first) resulted in disconnected `MediaStream` references — the camera never captured anything. The solution was a **module-level singleton** (`src/services/sosCameraService.ts`) that holds one permission state and one stream lifecycle for the entire application — shared correctly across both activation paths.

---

### How AI Tools Were Coordinated

**Google Gemini** is used purely as an in-product feature — a single, stateless call per route that turns a route's WSI score, incident categories, and infrastructure context into a short, human-readable explanation for the user. It is not used for app logic, routing, or data processing.

**Claude (Anthropic) / Antigravity AI** was used as a structured AI pair-programmer across five development phases:

1. **Architecture phase** — folder structure, routing conventions, design system tokens, and component contracts were locked before any business logic, so every subsequent feature had a consistent foundation to extend rather than redesign.

2. **Frontend phase** — the complete UI was built against realistic mock data to validate the full user flow (search → route recommendation → journey → reports → notifications → profile → emergency) before any backend existed. This caught UX problems early, before they were entangled with database logic.

3. **Backend integration phase** — mock data was systematically replaced with real Supabase tables, RLS policies, and the WSI engine. TypeScript compilation and production builds (`tsc -b && vite build`) were run after every integration step — not at the end — so regressions were caught immediately.

4. **Feature extension phase** — Emergency SOS, voice SOS, live GPS tracking, SOS camera capture, Resend email delivery, and the public tracking page were each planned and verified against the existing codebase before implementation began. Each feature was verified with a clean build before moving to the next.

5. **QA and security audit phase** — dedicated review passes for dead code, unused mock data, broken permission models (the public tracking page RLS tension), accessibility gaps, and responsive layout regressions on mobile devices.

The combination of Gemini (in-product intelligence) and Claude (development intelligence) reflects a deliberate choice: use AI for what it is actually good at, in the layer where it adds the most value.