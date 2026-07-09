import { useState } from "react";

/**
 * Generic localStorage-backed state. Falls back to initialValue on SSR
 * or when parsing fails.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (next: T) => {
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  };

  return [value, setStoredValue] as const;
}
