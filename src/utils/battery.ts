interface BatteryManager {
  level: number; // 0–1
}

/** Returns battery percentage (0–100) if the browser supports the Battery
 * Status API (Chrome/Edge/Android; not Firefox or Safari), or null
 * otherwise — callers should treat null as "unavailable," not an error. */
export async function getBatteryLevel(): Promise<number | null> {
  const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
  if (!nav.getBattery) return null;

  try {
    const battery = await nav.getBattery();
    return Math.round(battery.level * 100);
  } catch {
    return null;
  }
}
