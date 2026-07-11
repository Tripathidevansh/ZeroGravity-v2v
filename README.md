<div align="center">

# 🛡️ Nirbhaya AI

### *The safest route matters as much as the fastest one.*

**A community-driven women's safety navigation platform with real-time emergency response, voice-activated SOS, silent evidence capture, and live trusted-contact tracking.**

*Built for IEEE SHE Aspire — SafeSphere Track*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-000000?logo=mapbox&logoColor=white)](https://mapbox.com)
[![Gemini](https://img.shields.io/badge/Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![Resend](https://img.shields.io/badge/Resend-Email-000000?logo=resend&logoColor=white)](https://resend.com)

</div>

---

## The Idea

In India, and everywhere, women make a calculation that no navigation app has ever answered: not *"what's the fastest way there,"* but *"what's the safest way there."* A dark shortcut. An isolated stretch. A street with a history no map shows. That decision is made silently, on instinct, every single day — because the tools that exist optimize for speed, never for safety.

**Nirbhaya AI closes that gap.**

Named for the resolve that followed one of India's most painful reminders of why women's safety cannot be an afterthought, Nirbhaya AI is a community-driven safety navigation platform built on a simple conviction: **prevention, not reaction.** Instead of helping after something has already gone wrong, it helps a woman avoid the unsafe situation in the first place — and if the worst still happens, it responds for her, in real time, without requiring her to make a single extra decision under pressure.

Every route is scored by a real, deterministic **Women Safety Index (WSI)**, computed from live community incident reports and verified nearby infrastructure — not guesswork, not a black box. And when a real emergency happens, the platform doesn't just log it — it **captures her exact location and context, silently photographs her surroundings as evidence, emails every trusted contact instantly, and hands them a live, no-login map to watch over her until she's safe** — activated by a single tap, or, hands-free, by a single spoken word.

This is what women's safety technology should feel like: proactive, not reactive.

---

## Important Links

- **Live Deployment Link:** [Insert URL here]
- **Demo Video Link:** [Insert YouTube/Drive URL here]

---

## Features

### 🧮 Before the Journey — Know Before You Go
- **Women Safety Index (WSI) Engine** — a deterministic, fully explainable 0–100 safety score computed from real community reports (severity-weighted, time-decayed) and proximity to verified police, hospitals, and safe places. No black box, no randomness — the same score, color-coded green/amber/red, everywhere in the app.
- **Safe Route Recommendation** — search any real destination via live Mapbox autocomplete; every candidate route is ranked by safety, not speed, with the safest route surfaced first.
- **AI Route Explanation** — a Gemini-powered, plain-language explanation of *why* a route scored the way it did, so a safety score is something she can understand and trust, not just a number.
- **Community Safety Reports** — categorized, severity-rated incident reports with photos and precise GPS, feeding directly into the WSI engine in real time, seeded with real-world report density across Delhi, Gurgaon, and Noida for a realistic demo.

### 🚶‍♀️ During the Journey — Never Alone
- **Live Journey Mode** — real browser GPS tracking with a live-following map, live-recomputed safety score, live ETA, and remaining distance, updating continuously as she moves.
- **Always-Visible SOS** — a red emergency button present on the dashboard and inline during an active journey, never more than one tap away.

### 🚨 In an Emergency — Real Response, Not a Panic Button
- **One-Tap or Voice-Activated SOS** — activate by tapping the SOS button, or **hands-free by saying "help," "emergency," or "SOS"** — an always-on, on-device voice listener (no external API, fully private) detects the trigger and surfaces a **10-second cancellable countdown** before activating, guarding against false alarms while still enabling instant, hands-free activation in a real emergency.
- **Complete Emergency Capture** — the instant SOS fires, the platform captures exact GPS coordinates, reverse-geocodes a human-readable address, reads device battery level, pulls in the active journey's route and destination, and identifies the nearest police station and hospital — all in one atomic, timestamped emergency record.
- **Silent Evidence Capture** — without interrupting or alerting anyone nearby, the app silently captures a photo from the device camera at the moment of activation and securely uploads it to a private, per-user-locked evidence gallery.
- **Real Emergency Emails** — every trusted contact with an email on file is instantly emailed via Resend — not a simulated toast — with her live location, a Google Maps link, current route and destination, safety score, battery level, and a live tracking link.
- **Public Live Tracking Page** — trusted contacts open a secure, unique tracking link and watch her location move in real time, on any device, **with no account, no login, and no app install required.**
- **Live Emergency Dashboard** — elapsed time, live GPS map, live safety index at her current position, distance remaining, full timeline of every action taken, per-contact email delivery status, the evidence photo gallery, tap-to-call emergency helplines, and one-tap resolution.

### 👥 Trust & Community
- **Trusted Contacts** — add contacts with phone and email, mark a primary emergency contact, manage who gets notified.
- **Secure Authentication** — real Supabase Auth with persistent sessions and fully protected routes.
- **Notifications Center** — SOS confirmations, nearby safety alerts, and AI-generated route insights in one place.
- **Fully Responsive** — desktop, tablet, and mobile-first design, with thumb-reachable bottom navigation and safe-area support for notched devices.
- **Offline Awareness** — the app detects connectivity loss and recovery and communicates it clearly rather than failing silently.

---

## Tech Stack & Tools

**Frontend** — React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · TanStack Query · Framer Motion · Lucide Icons

**Backend & Infrastructure** — Supabase (Postgres, Auth, Storage, Realtime, Edge Functions, Row-Level Security on every table)

**Maps & Location** — Mapbox GL JS · Mapbox Directions API · Mapbox Search Box API · Mapbox Geocoding API · Browser Geolocation API · Battery Status API · MediaDevices (Camera) API

**AI Tools**
- **Google Gemini** — integrated in-product via a Supabase Edge Function, generating real-time natural-language safety explanations for recommended routes.
- **Web Speech API** — native, on-device voice keyword detection powering hands-free SOS — no external speech-recognition API, nothing leaves the device until a real emergency is confirmed.
- **Claude & Antigravity** — used as AI pair-programmers throughout the entire build, from initial architecture through backend integration, feature development, and dedicated QA/security audit passes (see Documentation below).

**Communications** — Resend (transactional emergency email delivery)

---

## Documentation

### How it works under the hood

Nirbhaya AI is a single-page React application backed entirely by Supabase — no custom backend server to maintain. Code is organized by feature (`src/features/<feature>/{components,api,hooks}`), each owning its own Supabase queries, React Query hooks, and UI, on top of a shared design-system layer (buttons, cards, modals, the map view).

**The Women Safety Index** (`src/services/wsiEngine.ts`) is a pure, deterministic function — the same one whether it's scoring the dashboard's "today's safety score," a candidate route, or a live position during an active journey. It finds nearby community reports, weights each by severity and applies exponential time-decay so recent incidents matter more than old ones, then offsets that against a proximity-weighted bonus from verified nearby police stations, hospitals, and safe places. No machine learning, no randomness — every score is explainable and reproducible from the same inputs.

**Live nearby places** (police, hospitals, safe spots) and **destination search** both run through Mapbox's Search Box API in real time, centered on the user's actual GPS position — never a fixed, hardcoded list.

**The security model for public tracking** is the most deliberate architectural decision in the project. Every table is protected by row-level security scoped to `auth.uid()` — but a trusted contact who clicks an emergency email link has no Supabase session at all. Rather than weakening RLS with a broad "anyone can read" policy (which would leak every user's emergency data to any anonymous visitor), the tracking page is served through two narrowly-scoped mechanisms instead:
- A **Supabase Edge Function** (`get-emergency-tracking`), deployed without JWT verification, using the service-role key internally but returning data for exactly one event — matched strictly by a dedicated, unguessable `tracking_token` kept separate from the event's primary key. A wrong or guessed token returns a generic "not found," never a partial match.
- **Supabase Realtime Broadcast** (not table-level `postgres_changes`, which *is* RLS-gated) for the live-moving-location feed — a pub/sub channel keyed by the tracking token, so the anonymous page receives live position updates without either side ever being granted table read access.

**Silent evidence capture** follows the same security discipline: photos live in a private storage bucket, gated by per-user RLS and a storage policy restricting uploads strictly to that user's own path prefix, served only via short-lived signed URLs — never a permanent public link.

**Voice-activated SOS** runs a continuous, on-device `SpeechRecognition` listener for trigger phrases ("help," "emergency," "SOS," "save me"). On a match, a visible 10-second countdown takes over — switching the listener to cancel phrases ("cancel," "stop," "false alarm") — before falling through to the exact same activation sequence the manual SOS button triggers, so there is only ever one emergency code path, not two to maintain and trust.

### How AI tools were coordinated

The application was built in structured phases with AI acting as an iterative pair-programmer, not a one-shot generator:

1. **Architecture first** — folder structure, routing, design system, and component conventions were locked in before any business logic, so every later feature had a consistent foundation to extend rather than a reason to redesign.
2. **Frontend against real user flow** — the complete UI was built and validated against realistic mock data (search → route recommendation → journey → reports → notifications → profile) before any backend existed, so the experience was right before it was wired up.
3. **Backend integration, verified at every step** — mock data was systematically replaced with real Supabase tables, RLS policies, and the live WSI engine, with TypeScript compilation and production builds checked after every change rather than assumed.
4. **Feature extension, incrementally** — Emergency SOS, voice activation, live GPS tracking, silent camera evidence capture, Resend email delivery, and the public tracking page were each added and verified against the existing architecture individually, rather than batched into one large, unreviewed change.
5. **Dedicated QA and security audit passes** — specifically hunting for dead code, unused mock data, accessibility gaps, and the RLS-versus-public-access tension solved above, with every fix verified by re-running static checks rather than taken on faith.

Gemini, by contrast, is used purely as an **in-product feature** — one stateless call per route, not a conversational assistant — turning a route's safety data into a short explanation for the person actually relying on it.

---

<div align="center">

**Built with ❤️ for women's safety.**

*Nirbhaya AI — because the safest route matters as much as the fastest one.*

</div>
