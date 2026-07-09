/**
 * Shared, cross-feature types.
 * Feature-specific types belong inside src/features/<feature>/types.ts.
 */

export type SafetyLevel = "safe" | "caution" | "risk";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
