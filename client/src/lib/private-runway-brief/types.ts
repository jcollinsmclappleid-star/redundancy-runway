export interface PrivateRunwayBriefNarrative {
  generatedAt: string;
  confidence: "High" | "Medium" | "Low";
  executiveSummary: {
    headline: string;
    narrativeSummary: string;
    qualitativeFindings: Array<{
      themeKey: string;
      observation: string;
    }>;
    methodologyInContext: string;
  };
  /** @deprecated use executiveSummary */
  overview?: {
    headline: string;
    summary: string;
  };
  runwayRangeCommentary: {
    summary: string;
    scenarioComments: Array<{
      scenarioKey: string;
      interpretation: string;
    }>;
  };
  packageCommentary?: {
    summary: string;
    componentComments: Array<{
      itemKey: string;
      explanation: string;
    }>;
  };
  capitalCompositionCommentary: {
    summary: string;
    itemComments: Array<{
      itemKey: string;
      explanation: string;
    }>;
  };
  pressureMapCommentary: {
    summary: string;
    pressurePointComments: Array<{
      pointKey: string;
      interpretation: string;
    }>;
  };
  sensitivityCommentary: {
    summary: string;
    driverComments: Array<{
      driverKey: string;
      explanation: string;
    }>;
  };
  assumptionsCommentary: {
    confidenceSummary: string;
    itemsToCheck: Array<{
      inputKey: string;
      whyItMatters: string;
    }>;
  };
  professionalQuestions: {
    financialAdviser: string[];
    mortgageBroker: string[];
    employerOrCareer: string[];
    benefitsSignposting: string[];
  };
  resetCta: {
    title: string;
    body: string;
  };
  disclaimer: string;
}

/** @deprecated Legacy full-brief shape — use PrivateRunwayBriefNarrative + BriefDashboardData */
export interface PrivateRunwayBrief {
  generatedAt: string;
  confidence: "High" | "Medium" | "Low";
  executiveSnapshot: {
    headline: string;
    summary: string;
    keyMetrics: Array<{
      label: string;
      value: string;
      context: string;
    }>;
  };
  runwayRange: {
    summary: string;
    scenarios: Array<{
      name: string;
      monthsUntilDepletion: number;
      interpretation: string;
      modelOnlyNote: string;
    }>;
  };
  runwayComposition: {
    summary: string;
    items: Array<{
      label: string;
      amount: number;
      explanation: string;
    }>;
  };
  pressureMap: {
    summary: string;
    pressurePoints: Array<{
      label: string;
      value: string;
      interpretation: string;
      severity: "low" | "moderate" | "elevated";
    }>;
  };
  sensitivity: {
    summary: string;
    rankedFactors: Array<{
      factor: string;
      effect: string;
      explanation: string;
    }>;
  };
  assumptionsToCheck: {
    confidenceSummary: string;
    missingOrWeakInputs: Array<{
      input: string;
      whyItMatters: string;
    }>;
  };
  professionalQuestions: {
    financialAdviser: string[];
    mortgageBroker: string[];
    employerOrCareer: string[];
    benefitsSignposting: string[];
  };
  nextStep: {
    resetCtaTitle: string;
    resetCtaBody: string;
    resetCtaLabel: string;
  };
  disclaimer: string;
}

export type PrivateRunwayBriefStatus = "idle" | "loading" | "done" | "error" | "stale";

export const PRIVATE_RUNWAY_BRIEF_DISCLAIMER =
  "This is an illustrative summary based on the figures entered. It is not financial, legal, tax, employment, debt, mortgage, benefits or career advice and does not predict job outcomes.";

export const RESET_CTA_DEFAULTS = {
  title: "Want help turning this into a practical next-step plan?",
  body: "The 7-Day Redundancy Reset is a separate human-written support product that helps you organise the next 7 days. It is practical written support only, not advice.",
  label: "Learn about the 7-Day Redundancy Reset",
} as const;

export interface PayloadScenario {
  id: string;
  name: string;
  description: string;
  monthsUntilDepletion: number;
  whatChanged: string;
  includeInBrief: boolean;
  jobGapMonths?: number;
}

export interface PayloadCompositionItem {
  label: string;
  amount: number;
  itemKey?: string;
}

export interface PayloadPressurePoint {
  label: string;
  value: string;
  housingPercentOfEssentials?: number;
  housingPercentOfIncome?: number | null;
}

export interface PayloadSensitivityItem {
  driverKey: string;
  factor: string;
  baseRunway: number;
  adjustedRunway: number;
  differenceMonths: number;
}

export interface PayloadWeakInput {
  input: string;
  whyItMatters: string;
}

export interface PrivateRunwayBriefPayload {
  confidence: "High" | "Medium" | "Low";
  hasUserReportedUncertainty: boolean;
  confidenceDisplayLabel: string;
  context: {
    employmentStatus: string;
    housingType: string;
    householdStructure: string;
    hasDependents: boolean;
    confidenceLevel: string;
  };
  baseline: {
    monthsUntilDepletion: number;
    startingCapital: number;
    netMonthlyBurn: number;
    essentialExpenses: number;
    nonEssentialExpenses: number;
    totalExpenses: number;
    incomeIncluded: number;
    stabilityBand: string;
    stabilityScore: number;
  };
  severeCaseRunway: number;
  redundancyPackage: {
    statutoryRedundancy: number;
    noticePay: number;
    holidayPay: number;
    enhancedAmount: number;
    manualOverrideAmount: number;
    useManualOverride: boolean;
    totalPackage: number;
    qualifyingServiceMet: boolean;
  };
  composition: PayloadCompositionItem[];
  compositionReconciliation: {
    startingCapitalTotal: number;
    componentsSum: number;
    reconciles: boolean;
    shownSeparately: PayloadCompositionItem[];
  };
  startingCapitalTotal: number;
  income: {
    currentMonthlyNetIncome: number;
    replacementMonthlyIncome: number;
    monthsUntilNewJob: number;
    benefitSupportEstimate: number;
    partnerMonthlyNetIncome: number;
    includePartnerIncome: boolean;
  };
  pressure: PayloadPressurePoint;
  pressurePoints: Array<{
    pointKey: string;
    label: string;
    formattedValue: string;
    severity: "low" | "moderate" | "elevated";
  }>;
  scenarios: PayloadScenario[];
  sensitivity: PayloadSensitivityItem[];
  assumptionQuality: Array<{
    inputKey: string;
    label: string;
    status: "complete" | "partial" | "missing" | "uncertain";
    note?: string;
  }>;
  weakInputs: PayloadWeakInput[];
  stabilityFactors: string[];
  netMonthlyBurnHelp: string;
  executiveSummaryThemeKeys: string[];
  packageComponents: Array<{
    itemKey: string;
    label: string;
    status: string;
  }>;
}

export interface StoredPrivateRunwayBrief {
  narrative: PrivateRunwayBriefNarrative;
  payloadFingerprint: string;
}

export function isLegacyStoredBrief(data: unknown): data is { brief: PrivateRunwayBrief; payloadFingerprint: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "brief" in data &&
    typeof (data as { brief: unknown }).brief === "object"
  );
}

export type { BriefDashboardData } from "./buildBriefDashboardData";
