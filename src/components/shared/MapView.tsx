import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { getSafetyLevelConfig } from "@/utils/safety";

export type MapMarkerType = "police" | "hospital" | "pharmacy" | "metro" | "fuel" | "safe-place" | "report";

export interface MapMarker {
  id: string;
  type: MapMarkerType;
  name: string;
  lat: number;
  lng: number;
}

export interface MapRoutePoint {
  lat: number;
  lng: number;
}

export interface LiveMapPosition extends MapRoutePoint {
  heading?: number | null;
}

export interface MapViewProps {
  center: MapRoutePoint;
  routePath?: MapRoutePoint[];
  wsi?: number;
  markers?: MapMarker[];
  /** A continuously-updating "you are here" position — when provided, the
   * map recenters to follow it (Journey Mode live tracking, emergency
   * tracking) instead of staying fixed on `center`. */
  livePosition?: LiveMapPosition | null;
  className?: string;
  heightClassName?: string;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

/**
 * Renders a real Mapbox GL map when VITE_MAPBOX_TOKEN is configured.
 * Without a token (Phase 2 default — no external API keys yet), falls back
 * to a stylized mock map so the UI never shows a broken/error map during a
 * demo. Swapping in a real token later requires no component changes.
 */
export function MapView({
  center,
  routePath = [],
  wsi,
  markers = [],
  livePosition = null,
  className,
  heightClassName = "h-72",
}: MapViewProps) {
  if (MAPBOX_TOKEN) {
    return (
      <MapboxMap
        center={center}
        routePath={routePath}
        markers={markers}
        livePosition={livePosition}
        className={cn("rounded-xl overflow-hidden", heightClassName, className)}
      />
    );
  }

  return (
    <MockMap
      center={livePosition ?? center}
      routePath={routePath}
      wsi={wsi}
      markers={markers}
      livePosition={livePosition}
      className={cn("rounded-xl overflow-hidden", heightClassName, className)}
    />
  );
}

/* ---------------------------- Real Mapbox map ---------------------------- */

function MapboxMap({
  center,
  routePath,
  markers,
  livePosition,
  className,
}: {
  center: MapRoutePoint;
  routePath: MapRoutePoint[];
  markers: MapMarker[];
  livePosition?: LiveMapPosition | null;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const mapboxglRef = useRef<typeof import("mapbox-gl").default | null>(null);
  const liveMarkerRef = useRef<import("mapbox-gl").Marker | null>(null);

  // Mount-only: create the map once, add the static route + POI markers.
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (!isMounted || !containerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN!;
      mapboxglRef.current = mapboxgl;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center.lng, center.lat],
        zoom: 13,
      });
      mapRef.current = map;

      map.on("load", () => {
        if (routePath.length > 1) {
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routePath.map((p) => [p.lng, p.lat]),
              },
            },
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#b10e6b", "line-width": 4 },
          });

          // Fit viewport to show the entire route path
          const bounds = new mapboxgl.LngLatBounds();
          routePath.forEach((p) => bounds.extend([p.lng, p.lat]));
          map.fitBounds(bounds, { padding: 40, animate: false });
        }

        markers.forEach((marker) => {
          const el = document.createElement("div");
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.borderRadius = "9999px";
          el.style.border = "2px solid white";
          el.style.background = MARKER_COLOR[marker.type];
          new mapboxgl.Marker(el).setLngLat([marker.lng, marker.lat]).addTo(map);
        });
      });
    })();

    return () => {
      isMounted = false;
      liveMarkerRef.current?.remove();
      liveMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reacts to live position changes independently of the mount-only effect
  // above — creates the "you are here" marker once, then just moves it and
  // eases the camera to follow, without recreating the map.
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxglRef.current;
    if (!map || !mapboxgl || !livePosition) return;

    if (!liveMarkerRef.current) {
      const el = document.createElement("div");
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.borderRadius = "9999px";
      el.style.border = "3px solid white";
      el.style.background = "#b10e6b";
      el.style.boxShadow = "0 0 0 6px rgba(177,14,107,0.3)";
      liveMarkerRef.current = new mapboxgl.Marker(el).setLngLat([livePosition.lng, livePosition.lat]).addTo(map);
    } else {
      liveMarkerRef.current.setLngLat([livePosition.lng, livePosition.lat]);
    }

    map.easeTo({ center: [livePosition.lng, livePosition.lat], duration: 800 });
  }, [livePosition]);

  return <div ref={containerRef} className={className} />;
}

const MARKER_COLOR: Record<MapMarkerType, string> = {
  police: "#3e7bfa",
  hospital: "#ef4444",
  pharmacy: "#06b6d4",
  metro: "#a855f7",
  fuel: "#f59e0b",
  "safe-place": "#22c55e",
  report: "#f5a524",
};

/* ------------------------------- Mock map -------------------------------- */

function MockMap({
  center,
  routePath,
  wsi,
  markers,
  livePosition,
  className,
}: {
  center: MapRoutePoint;
  routePath: MapRoutePoint[];
  wsi?: number;
  markers: MapMarker[];
  livePosition?: LiveMapPosition | null;
  className?: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ringClass = wsi !== undefined ? getSafetyLevelConfig(wsi).ringClass : "stroke-primary-500";

  // Project lat/lng deltas onto a stable 0–100 viewbox around the given center.
  // Passing a live position as `center` (done by MapView above) makes this
  // naturally "follow" on every re-render — no separate follow logic needed.
  const project = (p: MapRoutePoint) => ({
    x: 50 + (p.lng - center.lng) * 900,
    y: 50 - (p.lat - center.lat) * 900,
  });

  const pathPoints = routePath.length > 1 ? routePath.map(project) : undefined;
  const pathD = pathPoints
    ? `M ${pathPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`
    : undefined;

  const livePoint = livePosition ? project(livePosition) : null;

  return (
    <div
      className={cn(
        "relative bg-[var(--color-bg-surface-raised)] border border-[var(--color-border-subtle)]",
        className
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* stylized static "streets" for visual context */}
        <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="0" y1="65" x2="100" y2="65" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="70" y1="0" x2="70" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

        {pathD && (
          <path
            d={pathD}
            className={cn("fill-none", ringClass)}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {markers.map((marker) => {
          const p = project(marker);
          return (
            <circle
              key={marker.id}
              cx={p.x}
              cy={p.y}
              r={hoveredId === marker.id ? 2.6 : 1.8}
              fill={MARKER_COLOR[marker.type]}
              stroke="white"
              strokeWidth="0.4"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredId(marker.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <title>{marker.name}</title>
            </circle>
          );
        })}

        {livePoint && (
          <g>
            <circle cx={livePoint.x} cy={livePoint.y} r="4" fill="#7c3aed" opacity="0.35">
              <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={livePoint.x} cy={livePoint.y} r="2.4" fill="#7c3aed" stroke="white" strokeWidth="0.6">
              <title>Your live location</title>
            </circle>
          </g>
        )}
      </svg>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-black/40 px-2 py-1 text-[10px] text-neutral-400 backdrop-blur">
        Mock map preview — connect a Mapbox token for live tiles
      </div>
    </div>
  );
}
