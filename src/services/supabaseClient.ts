/**
 * Supabase client placeholder.
 *
 * Phase 1 scope: architecture only — no real Supabase project is
 * connected yet. This file defines the shape future phases will fill in,
 * so features can already import `supabase` from a stable path.
 *
 * When ready to integrate:
 *   npm install @supabase/supabase-js
 *   import { createClient } from "@supabase/supabase-js";
 *   export const supabase = createClient(url, anonKey);
 */

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL ?? "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
} as const;

// Intentionally untyped/unimplemented in Phase 1.
export const supabase = null;
