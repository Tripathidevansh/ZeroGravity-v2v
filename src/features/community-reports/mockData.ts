import type { CommunityReport } from "@/features/community-reports/types";

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: "report-1",
    category: "poor-lighting",
    title: "Dim stretch near the flyover underpass",
    description:
      "Streetlights have been out for over a week on the service road just before the Sector 62 flyover. Hard to spot the footpath after dark.",
    location: "Sector 62 flyover, Noida",
    severity: "medium",
    reportedAt: minutesAgo(42),
    verifiedCount: 6,
  },
  {
    id: "report-2",
    category: "harassment",
    title: "Verbal harassment reported near market entrance",
    description:
      "A group of men were reported making passing comments at women near the Sector 18 market main gate around evening hours.",
    location: "Sector 18 Market, Noida",
    severity: "high",
    reportedAt: minutesAgo(95),
    verifiedCount: 11,
  },
  {
    id: "report-3",
    category: "unsafe-area",
    title: "Isolated stretch with no shops after 9 PM",
    description:
      "The road connecting the metro station to the residential blocks empties out completely after 9 PM — no shops, no footfall.",
    location: "Botanical Garden Metro Rd, Noida",
    severity: "medium",
    reportedAt: minutesAgo(180),
    verifiedCount: 4,
  },
  {
    id: "report-4",
    category: "suspicious-activity",
    title: "Unmarked vehicle idling near college gate",
    description:
      "Same unmarked car reported idling near the JIIT back gate for three evenings in a row. Reported to campus security.",
    location: "JIIT Back Gate, Sector 62",
    severity: "high",
    reportedAt: minutesAgo(260),
    verifiedCount: 3,
  },
  {
    id: "report-5",
    category: "broken-streetlight",
    title: "Three consecutive streetlights not working",
    description:
      "Between house numbers 210–240, three streetlights in a row are non-functional, creating a long dark patch on the walkway.",
    location: "Sector 62, Block C, Noida",
    severity: "low",
    reportedAt: minutesAgo(400),
    verifiedCount: 8,
  },
  {
    id: "report-6",
    category: "poor-lighting",
    title: "Park pathway unlit after sunset",
    description: "The shortcut path through the community park has no functioning lights past 7 PM.",
    location: "Sector 78 Community Park, Noida",
    severity: "low",
    reportedAt: minutesAgo(540),
    verifiedCount: 2,
  },
  {
    id: "report-7",
    category: "unsafe-area",
    title: "Construction debris blocking footpath",
    description:
      "Ongoing construction has blocked the footpath, forcing pedestrians onto the road with fast-moving traffic and no lighting.",
    location: "Sector 61 Main Road, Noida",
    severity: "medium",
    reportedAt: minutesAgo(720),
    verifiedCount: 5,
  },
  {
    id: "report-8",
    category: "harassment",
    title: "Persistent following reported near bus stop",
    description: "A commuter reported being followed for several minutes after alighting at the bus stop.",
    location: "Sector 37 Bus Stop, Noida",
    severity: "high",
    reportedAt: minutesAgo(1020),
    verifiedCount: 9,
  },
];
