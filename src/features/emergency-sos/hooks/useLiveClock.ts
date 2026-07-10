import { useEffect, useState } from "react";

/** Ticks every second, returning the current Date — used for a live wall clock. */
export function useLiveClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

/** Formats seconds elapsed since a given ISO timestamp as mm:ss or hh:mm:ss. */
export function useElapsedTime(sinceIso: string): string {
  const now = useLiveClock();
  const elapsedSeconds = Math.max(0, Math.floor((now.getTime() - new Date(sinceIso).getTime()) / 1000));

  const hrs = Math.floor(elapsedSeconds / 3600);
  const mins = Math.floor((elapsedSeconds % 3600) / 60);
  const secs = elapsedSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
}
