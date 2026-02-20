import type { SectorData } from "@shared/schema";

export const sectorReemploymentData: SectorData[] = [
  { sector: "Technology", medianWeeks: 12, p25Weeks: 6, p75Weeks: 24, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Finance & Banking", medianWeeks: 14, p25Weeks: 8, p75Weeks: 28, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Healthcare & NHS", medianWeeks: 8, p25Weeks: 4, p75Weeks: 16, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Retail & Hospitality", medianWeeks: 6, p25Weeks: 3, p75Weeks: 14, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Manufacturing", medianWeeks: 16, p25Weeks: 8, p75Weeks: 30, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Construction", medianWeeks: 10, p25Weeks: 5, p75Weeks: 20, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Education", medianWeeks: 12, p25Weeks: 6, p75Weeks: 22, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Professional Services", medianWeeks: 14, p25Weeks: 7, p75Weeks: 26, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Public Sector", medianWeeks: 10, p25Weeks: 5, p75Weeks: 18, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Transport & Logistics", medianWeeks: 10, p25Weeks: 5, p75Weeks: 22, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Media & Creative", medianWeeks: 16, p25Weeks: 8, p75Weeks: 32, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
  { sector: "Energy & Utilities", medianWeeks: 14, p25Weeks: 7, p75Weeks: 26, source: "ONS Labour Market Statistics", lastUpdated: "2025-Q4" },
];

export const ukAverageReemployment: SectorData = {
  sector: "UK Average (All Sectors)",
  medianWeeks: 12,
  p25Weeks: 6,
  p75Weeks: 24,
  source: "ONS Labour Market Statistics",
  lastUpdated: "2025-Q4",
};

export function getSectorData(sector: string): SectorData {
  if (!sector || sector === "all") return ukAverageReemployment;
  const found = sectorReemploymentData.find(s => s.sector === sector);
  return found ?? ukAverageReemployment;
}

export function getAllSectors(): string[] {
  return sectorReemploymentData.map(s => s.sector);
}
