export interface BenchmarkMeta {
  lastUpdated: string;
  sources: string[];
}

export interface RedundancyContext {
  totalRedundancies: number;
  totalRedundanciesLabel: string;
  yoyChangePercent: number;
  quarter: string;
  sectorHighlights: Array<{ sector: string; yoyChangePercent: number }>;
}

export interface SavingsBenchmark {
  medianHouseholdSavings: number;
  upperQuartileThreshold: number;
  year: string;
  source: string;
}

export interface HousingBurdenBenchmark {
  typicalBurdenPercent: number;
  stressReferenceThresholdPercent: number;
  year: string;
  source: string;
}

export interface AgeBandReemployment {
  ageBand: string;
  medianWeeks: number;
  p25Weeks: number;
  p75Weeks: number;
}

export interface UKBenchmarks {
  meta: BenchmarkMeta;
  redundancyContext: RedundancyContext;
  savingsBenchmarks: SavingsBenchmark;
  housingBurden: HousingBurdenBenchmark;
  reemploymentByAge: AgeBandReemployment[];
  ukAverageReemployment: { medianWeeks: number; p25Weeks: number; p75Weeks: number };
}

export const ukBenchmarks: UKBenchmarks = {
  meta: {
    lastUpdated: "Q4 2025",
    sources: [
      "Office for National Statistics (Labour Market Statistics)",
      "ONS Wealth and Assets Survey",
      "ONS Household Expenditure Data",
    ],
  },

  redundancyContext: {
    totalRedundancies: 98000,
    totalRedundanciesLabel: "98,000",
    yoyChangePercent: 14,
    quarter: "Q4 2025",
    sectorHighlights: [
      { sector: "Technology", yoyChangePercent: 22 },
      { sector: "Finance & Banking", yoyChangePercent: 18 },
      { sector: "Retail & Hospitality", yoyChangePercent: 11 },
    ],
  },

  savingsBenchmarks: {
    medianHouseholdSavings: 8500,
    upperQuartileThreshold: 35000,
    year: "2025",
    source: "ONS Wealth and Assets Survey",
  },

  housingBurden: {
    typicalBurdenPercent: 32,
    stressReferenceThresholdPercent: 45,
    year: "2025",
    source: "ONS Household Expenditure Data",
  },

  reemploymentByAge: [
    { ageBand: "Under 25", medianWeeks: 8, p25Weeks: 4, p75Weeks: 14 },
    { ageBand: "25–34", medianWeeks: 10, p25Weeks: 5, p75Weeks: 20 },
    { ageBand: "35–44", medianWeeks: 12, p25Weeks: 6, p75Weeks: 24 },
    { ageBand: "45–54", medianWeeks: 16, p25Weeks: 8, p75Weeks: 30 },
    { ageBand: "55+", medianWeeks: 22, p25Weeks: 10, p75Weeks: 38 },
  ],

  ukAverageReemployment: {
    medianWeeks: 12,
    p25Weeks: 6,
    p75Weeks: 24,
  },
};

export function getAgeBandData(age: number): AgeBandReemployment {
  if (age < 25) return ukBenchmarks.reemploymentByAge[0];
  if (age < 35) return ukBenchmarks.reemploymentByAge[1];
  if (age < 45) return ukBenchmarks.reemploymentByAge[2];
  if (age < 55) return ukBenchmarks.reemploymentByAge[3];
  return ukBenchmarks.reemploymentByAge[4];
}

export function getSavingsPosition(startingCapital: number): "below_median" | "above_median" | "upper_quartile" {
  if (startingCapital >= ukBenchmarks.savingsBenchmarks.upperQuartileThreshold) return "upper_quartile";
  if (startingCapital >= ukBenchmarks.savingsBenchmarks.medianHouseholdSavings) return "above_median";
  return "below_median";
}

export function getSavingsPositionLabel(position: ReturnType<typeof getSavingsPosition>): string {
  switch (position) {
    case "upper_quartile":
      return "Your starting capital falls within the upper quartile of UK household savings.";
    case "above_median":
      return "Your starting capital is above the current UK median household savings benchmark.";
    case "below_median":
      return "Your starting capital is below the current UK median household savings benchmark.";
  }
}

export function weeksToMonths(weeks: number): number {
  return Math.round((weeks / 4.33) * 10) / 10;
}

export function formatWeeksAndMonths(weeks: number): string {
  return `${weeks} weeks (~${weeksToMonths(weeks)} months)`;
}
