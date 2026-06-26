import { z } from "zod";

const confidenceSchema = z.enum(["High", "Medium", "Low"]);

const payloadScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  monthsUntilDepletion: z.number(),
  whatChanged: z.string(),
  includeInBrief: z.boolean(),
  jobGapMonths: z.number().optional(),
});

const payloadSchema = z.object({
  confidence: confidenceSchema,
  hasUserReportedUncertainty: z.boolean(),
  confidenceDisplayLabel: z.string(),
  context: z.object({
    employmentStatus: z.string(),
    housingType: z.string(),
    householdStructure: z.string(),
    hasDependents: z.boolean(),
    confidenceLevel: z.string(),
  }),
  baseline: z.object({
    monthsUntilDepletion: z.number(),
    startingCapital: z.number(),
    netMonthlyBurn: z.number(),
    essentialExpenses: z.number(),
    nonEssentialExpenses: z.number(),
    totalExpenses: z.number(),
    incomeIncluded: z.number(),
    stabilityBand: z.string(),
    stabilityScore: z.number(),
  }),
  severeCaseRunway: z.number(),
  redundancyPackage: z.object({
    statutoryRedundancy: z.number(),
    noticePay: z.number(),
    holidayPay: z.number(),
    enhancedAmount: z.number(),
    manualOverrideAmount: z.number(),
    useManualOverride: z.boolean(),
    totalPackage: z.number(),
    qualifyingServiceMet: z.boolean(),
  }),
  composition: z.array(
    z.object({ label: z.string(), amount: z.number(), itemKey: z.string().optional() }),
  ),
  compositionReconciliation: z.object({
    startingCapitalTotal: z.number(),
    componentsSum: z.number(),
    reconciles: z.boolean(),
    shownSeparately: z.array(
      z.object({ label: z.string(), amount: z.number(), itemKey: z.string().optional() }),
    ),
  }),
  startingCapitalTotal: z.number(),
  income: z.object({
    currentMonthlyNetIncome: z.number(),
    replacementMonthlyIncome: z.number(),
    monthsUntilNewJob: z.number(),
    benefitSupportEstimate: z.number(),
    partnerMonthlyNetIncome: z.number(),
    includePartnerIncome: z.boolean(),
  }),
  pressure: z.object({
    label: z.string(),
    value: z.string(),
    housingPercentOfEssentials: z.number().optional(),
    housingPercentOfIncome: z.number().nullable().optional(),
  }),
  pressurePoints: z.array(
    z.object({
      pointKey: z.string(),
      label: z.string(),
      formattedValue: z.string(),
      severity: z.enum(["low", "moderate", "elevated"]),
    }),
  ),
  scenarios: z.array(payloadScenarioSchema),
  sensitivity: z.array(
    z.object({
      driverKey: z.string(),
      factor: z.string(),
      baseRunway: z.number(),
      adjustedRunway: z.number(),
      differenceMonths: z.number(),
    }),
  ),
  assumptionQuality: z.array(
    z.object({
      inputKey: z.string(),
      label: z.string(),
      status: z.enum(["complete", "partial", "missing", "uncertain"]),
      note: z.string().optional(),
    }),
  ),
  weakInputs: z.array(z.object({ input: z.string(), whyItMatters: z.string() })),
  stabilityFactors: z.array(z.string()),
  netMonthlyBurnHelp: z.string(),
  executiveSummaryThemeKeys: z.array(z.string()),
  packageComponents: z.array(
    z.object({
      itemKey: z.string(),
      label: z.string(),
      status: z.string(),
    }),
  ),
  positionEnhancement: z.object({
    situationType: z.enum(["at_risk", "post_redundancy", "other"]),
    topClarificationAreas: z.array(
      z.object({
        itemKey: z.string(),
        label: z.string(),
        bucket: z.string(),
      }),
    ),
    missingMoneyKeys: z.array(z.string()),
    scenarioInsight: z.string(),
    consultationPrepGaps: z.array(z.string()),
    highValueLabels: z.array(z.string()),
    leverageThemes: z.array(z.string()),
  }),
});

export const privateRunwayBriefRequestSchema = z.object({
  sessionToken: z.string().min(1).max(128),
  payload: payloadSchema,
});

export const PRIVATE_RUNWAY_BRIEF_DISCLAIMER =
  "This is an illustrative summary based on the figures entered. It is not financial, legal, tax, employment, debt, mortgage, benefits or career advice and does not predict job outcomes.";

export const privateRunwayBriefNarrativeSchema = z.object({
  executiveSummary: z.object({
    headline: z.string().min(1),
    narrativeSummary: z.string().min(1),
    qualitativeFindings: z.array(
      z.object({
        themeKey: z.string(),
        observation: z.string().min(1),
      }),
    ),
    methodologyInContext: z.string().min(1),
  }),
  runwayRangeCommentary: z.object({
    summary: z.string().min(1),
    scenarioComments: z.array(
      z.object({
        scenarioKey: z.string(),
        interpretation: z.string().min(1),
      }),
    ),
  }),
  packageCommentary: z.object({
    summary: z.string().min(1),
    componentComments: z.array(
      z.object({
        itemKey: z.string(),
        explanation: z.string().min(1),
      }),
    ),
  }),
  positionEnhancementCommentary: z.object({
    summary: z.string().min(1),
    packageOpportunities: z.array(z.string().min(1)),
    consultationReadiness: z.string().optional(),
    leverageThemes: z.array(z.string().min(1)),
  }),
  capitalCompositionCommentary: z.object({
    summary: z.string().min(1),
    itemComments: z.array(
      z.object({
        itemKey: z.string(),
        explanation: z.string().min(1),
      }),
    ),
  }),
  pressureMapCommentary: z.object({
    summary: z.string().min(1),
    pressurePointComments: z.array(
      z.object({
        pointKey: z.string(),
        interpretation: z.string().min(1),
      }),
    ),
  }),
  sensitivityCommentary: z.object({
    summary: z.string().min(1),
    driverComments: z.array(
      z.object({
        driverKey: z.string(),
        explanation: z.string().min(1),
      }),
    ),
  }),
  assumptionsCommentary: z.object({
    confidenceSummary: z.string().min(1),
    itemsToCheck: z.array(
      z.object({
        inputKey: z.string(),
        whyItMatters: z.string().min(1),
      }),
    ),
  }),
  professionalQuestions: z.object({
    financialAdviser: z.array(z.string()),
    mortgageBroker: z.array(z.string()),
    employerOrCareer: z.array(z.string()),
    benefitsSignposting: z.array(z.string()),
  }),
  resetCta: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  disclaimer: z.string().min(1),
});

export const briefNarrativeLiteSchema = z.object({
  executiveHeadline: z.string().min(1),
  executiveObservations: z
    .array(
      z.object({
        themeKey: z.string().min(1),
        observation: z.string().min(1),
      }),
    )
    .min(1)
    .max(3),
});

/** @deprecated */
export const privateRunwayBriefResponseKeys = [
  "executiveSnapshot",
  "runwayRange",
  "runwayComposition",
  "pressureMap",
  "sensitivity",
  "assumptionsToCheck",
  "professionalQuestions",
  "nextStep",
  "disclaimer",
] as const;
