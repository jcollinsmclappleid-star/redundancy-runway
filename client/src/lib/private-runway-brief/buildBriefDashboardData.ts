import type { RunwayInputs } from "@shared/schema";
import type { MonthProjection, RunwayResult } from "@shared/schema";
import {
  computeRunway,
  computeScenarios,
  computeSensitivity,
  computeMortgageSensitivity,
  computeProjectionRange,
  computeRedundancyEstimate,
} from "@/lib/engine";
import { chartTheme } from "@/lib/chart-theme";
import { computeConfidence, hasUserReportedUncertainty } from "./computeConfidence";
import { buildAssumptionQuality } from "./buildAssumptionQuality";
import { buildComposition } from "./buildComposition";
import { buildSlowCaseInputs, buildSevereCaseInputs } from "@/lib/runwayAssumptions";
import type { AssumptionQualityItem } from "./buildAssumptionQuality";
import type { CompositionReconciliation } from "./buildComposition";

export const NET_MONTHLY_BURN_HELP =
  "Net monthly burn is the monthly shortfall after income included in the model.";

export interface BriefPathScenario {
  scenarioKey: string;
  name: string;
  shortName: string;
  description: string;
  whatChanged: string;
  color: string;
  tag: string;
  tagTone: "balanced" | "sustain" | "stretch" | "complex";
  monthsUntilDepletion: number;
  monthlyBurn: number;
  startingCapital: number;
  stabilityScore: number;
  stabilityBand: string;
  capitalAfter3Months: number;
  capitalAfter6Months: number;
  capitalAfter12Months: number;
  projections: MonthProjection[];
  milestones: RunwayResult["milestones"];
  depletionMonth: number | null;
  endingCapital: number;
  jobGapMonths?: number;
}

export interface DashboardScenario {
  scenarioKey: string;
  name: string;
  description: string;
  monthsUntilDepletion: number;
  whatChanged: string;
  jobGapMonths?: number;
  projections: MonthProjection[];
}

export interface DashboardSensitivityDriver {
  driverKey: string;
  factor: string;
  baseRunway: number;
  adjustedRunway: number;
  differenceMonths: number;
}

export interface DashboardPressurePoint {
  pointKey: string;
  label: string;
  value: number;
  formattedValue: string;
  severity: "low" | "moderate" | "elevated";
}

export interface BriefDashboardData {
  confidence: "High" | "Medium" | "Low";
  hasUserReportedUncertainty: boolean;
  confidenceDisplayLabel: string;
  baseline: {
    monthsUntilDepletion: number;
    startingCapital: number;
    netMonthlyBurn: number;
    essentialExpenses: number;
    nonEssentialExpenses: number;
    totalExpenses: number;
    incomeIncluded: number;
    debtRepayments: number;
    housingCost: number;
    housingPercentOfEssentials: number;
    housingPercentOfIncome: number | null;
    stabilityBand: string;
    stabilityScore: number;
    projections: MonthProjection[];
  };
  severeCaseRunway: number;
  scenarios: DashboardScenario[];
  pathScenarios: BriefPathScenario[];
  pathChartScenarios: Array<{ scenarioKey: string; name: string; projections: MonthProjection[]; color: string }>;
  composition: CompositionReconciliation;
  compositionBar: Array<{ label: string; value: number; color: string }>;
  pressurePoints: DashboardPressurePoint[];
  sensitivity: DashboardSensitivityDriver[];
  assumptionQuality: AssumptionQualityItem[];
  stabilityFactors: string[];
}

const SENSITIVITY_DRIVER_KEYS = [
  "essential_expenses_10",
  "essential_expenses_20",
  "job_gap_delay_3",
  "job_gap_delay_6",
  "remove_non_essential",
  "savings_half",
] as const;

const MORTGAGE_DRIVER_KEY = "housing_cost_increase";

function shouldIncludeOneIncome(inputs: RunwayInputs): boolean {
  return inputs.context.householdStructure !== "single" || inputs.includePartnerIncome;
}

function buildSlowRecoveryWhatChanged(userGap: number, p75Gap: number, worseGap: number, percentileLabel: string): string {
  if (p75Gap > userGap) {
    return `Job-gap extended to ${worseGap} months (${percentileLabel} labour-market reference).`;
  }
  if (p75Gap < userGap) {
    return `75th percentile reference is ${p75Gap} months — shorter than your entered ${userGap} months. This scenario uses the longer ${worseGap}-month gap as the stress baseline.`;
  }
  return `Uses your entered ${userGap}-month job-gap with ${percentileLabel} labour-market reference.`;
}

function buildSlowRecoveryName(userGap: number, p75Gap: number): string {
  if (p75Gap > userGap) {
    return "Slower Reemployment Scenario";
  }
  if (p75Gap < userGap) {
    return "Labour-market reference (75th percentile)";
  }
  return "Slower Reemployment Scenario";
}

function buildOneIncomeScenario(inputs: RunwayInputs): DashboardScenario | null {
  if (!shouldIncludeOneIncome(inputs)) return null;

  const partnerIncluded = inputs.includePartnerIncome && inputs.partnerMonthlyNetIncome > 0;
  const oneIncomeInputs: RunwayInputs = {
    ...inputs,
    replacementMonthlyIncome: 0,
    benefitSupportEstimate: 0,
    currentMonthlyNetIncome: 0,
    monthsUntilNewJob: 0,
    includePartnerIncome: partnerIncluded,
  };

  const result = computeRunway(oneIncomeInputs);
  const partnerNote = partnerIncluded
    ? `Partner income of £${inputs.partnerMonthlyNetIncome.toLocaleString("en-GB")}/mo remains in the model.`
    : "Partner income is not included in this scenario.";

  return {
    scenarioKey: "one_income",
    name: "One-Income Household",
    description: "Models the household with your income at zero.",
    monthsUntilDepletion: result.monthsUntilDepletion,
    whatChanged: `Your salary, replacement income and benefits were set to zero. ${partnerNote}`,
    projections: result.projections,
  };
}

function computeIncomeIncluded(inputs: RunwayInputs): number {
  let income = 0;
  if (inputs.currentMonthlyNetIncome > 0) income += inputs.currentMonthlyNetIncome;
  if (inputs.replacementMonthlyIncome > 0) income += inputs.replacementMonthlyIncome;
  if (inputs.benefitSupportEstimate > 0) income += inputs.benefitSupportEstimate;
  if (inputs.includePartnerIncome && inputs.partnerMonthlyNetIncome > 0) {
    income += inputs.partnerMonthlyNetIncome;
  }
  return income;
}

function buildSensitivityDrivers(inputs: RunwayInputs, baseRunway: number): DashboardSensitivityDriver[] {
  const base = computeSensitivity(inputs);
  const mortgage = inputs.mortgageOrRent > 0 ? computeMortgageSensitivity(inputs) : [];

  const items: DashboardSensitivityDriver[] = [
    ...base.map((s, i) => ({
      driverKey: SENSITIVITY_DRIVER_KEYS[i] ?? `sensitivity_${i}`,
      factor: s.label,
      baseRunway: s.baseRunway,
      adjustedRunway: s.adjustedRunway,
      differenceMonths: s.difference,
    })),
    ...mortgage.map((m, i) => ({
      driverKey: `${MORTGAGE_DRIVER_KEY}_${m.increasePercent}`,
      factor: m.label,
      baseRunway,
      adjustedRunway: m.adjustedRunway,
      differenceMonths: m.difference,
    })),
  ];

  return items.sort((a, b) => a.differenceMonths - b.differenceMonths).slice(0, 8);
}

function pressureSeverity(ratio: number): "low" | "moderate" | "elevated" {
  if (ratio >= 50) return "elevated";
  if (ratio >= 30) return "moderate";
  return "low";
}

const PATH_SHORT_NAMES: Record<string, string> = {
  baseline: "Baseline",
  slow_recovery: "Slow",
  severe: "Zero income",
  structural: "Structural",
  one_income: "One-income",
};

const PATH_COLORS: Record<string, string> = {
  baseline: chartTheme.color.s1,
  slow_recovery: chartTheme.color.s2,
  severe: chartTheme.color.pressure,
  structural: chartTheme.color.s4,
  one_income: chartTheme.color.s3,
};

function scoreToTone(score: number): { tag: string; tagTone: BriefPathScenario["tagTone"] } {
  if (score >= 70) return { tag: "Sustainable", tagTone: "sustain" };
  if (score >= 55) return { tag: "Balanced", tagTone: "balanced" };
  if (score >= 35) return { tag: "Stretched", tagTone: "stretch" };
  return { tag: "Under pressure", tagTone: "complex" };
}

function buildPathScenario(
  scenarioKey: string,
  name: string,
  description: string,
  whatChanged: string,
  result: RunwayResult,
  jobGapMonths?: number,
): BriefPathScenario {
  const depletionIdx = result.projections.findIndex((p) => p.capital <= 0);
  const endingCapital = result.projections[result.projections.length - 1]?.capital ?? 0;
  const { tag, tagTone } = scoreToTone(result.stabilityScore);

  return {
    scenarioKey,
    name,
    shortName: PATH_SHORT_NAMES[scenarioKey] ?? name,
    description,
    whatChanged,
    color: PATH_COLORS[scenarioKey] ?? chartTheme.color.s1,
    tag,
    tagTone,
    monthsUntilDepletion: result.monthsUntilDepletion,
    monthlyBurn: result.monthlyBurn,
    startingCapital: result.startingCapital,
    stabilityScore: result.stabilityScore,
    stabilityBand: result.stabilityBand,
    capitalAfter3Months: result.capitalAfter3Months,
    capitalAfter6Months: result.capitalAfter6Months,
    capitalAfter12Months: result.capitalAfter12Months,
    projections: result.projections,
    milestones: result.milestones,
    depletionMonth: depletionIdx > 0 ? depletionIdx : null,
    endingCapital,
    jobGapMonths,
  };
}

export function buildBriefDashboardData(inputs: RunwayInputs): BriefDashboardData {
  const confidence = computeConfidence(inputs);
  const userUncertain = hasUserReportedUncertainty(inputs);
  const confidenceDisplayLabel =
    confidence === "High" && userUncertain
      ? "High data completeness · user-reported uncertainty noted"
      : `${confidence} data completeness`;

  const baseline = computeRunway(inputs);
  const projectionRange = computeProjectionRange(inputs);
  const scenariosRaw = computeScenarios(inputs);
  const redundancyEst = computeRedundancyEstimate(inputs.redundancyPackage);

  const userGap = inputs.monthsUntilNewJob;
  const p75Gap = projectionRange.slow.reemploymentMonths;
  const worseGap = Math.max(userGap, p75Gap);

  const slowCase = buildSlowCaseInputs(inputs, worseGap);
  const slowResult = computeRunway(slowCase.inputs);
  const severeCase = buildSevereCaseInputs(inputs);
  const severeResult = computeRunway(severeCase.inputs);

  const structural = scenariosRaw.find((s) => s.name === "Structural Transition");

  const scenarios: DashboardScenario[] = [
    {
      scenarioKey: "baseline",
      name: "Baseline (your assumptions)",
      description: "Your entered income, expenses and job-gap assumptions.",
      monthsUntilDepletion: baseline.monthsUntilDepletion,
      whatChanged:
        "Uses all figures as entered — replacement income, job-gap months, partner income and benefits where included.",
      jobGapMonths: userGap,
      projections: baseline.projections,
    },
    {
      scenarioKey: "slow_recovery",
      name: buildSlowRecoveryName(userGap, p75Gap),
      description: slowCase.whatChanged,
      monthsUntilDepletion: slowResult.monthsUntilDepletion,
      whatChanged: slowCase.whatChanged,
      jobGapMonths: worseGap,
      projections: slowResult.projections,
    },
    {
      scenarioKey: "severe",
      name: severeCase.whatChanged.includes("20%") ? "Higher essentials (severe case)" : "Zero Income (severe case)",
      description: severeCase.whatChanged,
      monthsUntilDepletion: severeResult.monthsUntilDepletion,
      whatChanged: severeCase.whatChanged,
      projections: severeResult.projections,
    },
    {
      scenarioKey: "structural",
      name: "Structural Transition",
      description: structural?.description ?? "Slower, lower-income recovery path.",
      monthsUntilDepletion: structural?.result.monthsUntilDepletion ?? baseline.monthsUntilDepletion,
      whatChanged:
        "Models lower replacement income (30% of prior), extended 12-month gap, and reduced prior salary (80%) — illustrative only.",
      projections: structural?.result.projections ?? baseline.projections,
    },
  ];

  const oneIncome = buildOneIncomeScenario(inputs);
  if (oneIncome) scenarios.push(oneIncome);

  const oneIncomeResult =
    oneIncome != null
      ? computeRunway({
          ...inputs,
          replacementMonthlyIncome: 0,
          benefitSupportEstimate: 0,
          currentMonthlyNetIncome: 0,
          monthsUntilNewJob: 0,
          includePartnerIncome: inputs.includePartnerIncome && inputs.partnerMonthlyNetIncome > 0,
        })
      : null;

  const pathScenarios: BriefPathScenario[] = [
    buildPathScenario(
      "baseline",
      "Baseline (your assumptions)",
      "Your entered income, expenses and job-gap assumptions.",
      "Uses all figures as entered — replacement income, job-gap months, partner income and benefits where included.",
      baseline,
      userGap,
    ),
    buildPathScenario(
      "slow_recovery",
      buildSlowRecoveryName(userGap, p75Gap),
      slowCase.whatChanged,
      slowCase.whatChanged,
      slowResult,
      worseGap,
    ),
    buildPathScenario(
      "severe",
      severeCase.whatChanged.includes("20%") ? "Higher essentials (severe case)" : "Zero Income (severe case)",
      severeCase.whatChanged,
      severeCase.whatChanged,
      severeResult,
    ),
    buildPathScenario(
      "structural",
      "Structural Transition",
      structural?.description ?? "Slower, lower-income recovery path.",
      "Models lower replacement income (30% of prior), extended 12-month gap, and reduced prior salary (80%) — illustrative only.",
      structural?.result ?? baseline,
    ),
  ];

  if (oneIncome && oneIncomeResult) {
    pathScenarios.push(
      buildPathScenario(
        "one_income",
        oneIncome.name,
        oneIncome.description,
        oneIncome.whatChanged,
        oneIncomeResult,
      ),
    );
  }

  const pathChartScenarios = pathScenarios.map((s) => ({
    scenarioKey: s.scenarioKey,
    name: s.name,
    projections: s.projections,
    color: s.color,
  }));

  const composition = buildComposition(inputs, baseline.startingCapital);

  const packageTotal =
    inputs.redundancyPackage.useManualOverride && inputs.redundancyPackage.manualOverrideAmount > 0
      ? inputs.redundancyPackage.manualOverrideAmount
      : redundancyEst.totalEstimated;

  const compositionBar = [
    { label: "Cash savings", value: inputs.cashSavings, color: chartTheme.color.cash },
    { label: "Liquid investments", value: inputs.liquidInvestments, color: chartTheme.color.investments },
    { label: "Redundancy package", value: packageTotal, color: chartTheme.color.redundancy },
    {
      label: "Other one-off",
      value: inputs.otherOneOffIncome + (inputs.unpaidWages ?? 0),
      color: chartTheme.color.s4,
    },
  ].filter((c) => c.value > 0);

  const housingPercentOfEssentials =
    baseline.essentialExpenses > 0
      ? Math.round((inputs.mortgageOrRent / baseline.essentialExpenses) * 100)
      : 0;

  const housingPercentOfIncome =
    inputs.currentMonthlyNetIncome > 0
      ? Math.round((inputs.mortgageOrRent / inputs.currentMonthlyNetIncome) * 100)
      : null;

  const incomeIncluded = computeIncomeIncluded(inputs);

  const pressurePoints: DashboardPressurePoint[] = [
    {
      pointKey: "essential_expenses",
      label: "Monthly essential costs",
      value: baseline.essentialExpenses,
      formattedValue: `£${baseline.essentialExpenses.toLocaleString("en-GB")}/mo`,
      severity: pressureSeverity(housingPercentOfEssentials),
    },
    {
      pointKey: "flexible_expenses",
      label: "Monthly flexible costs",
      value: baseline.nonEssentialExpenses,
      formattedValue: `£${baseline.nonEssentialExpenses.toLocaleString("en-GB")}/mo`,
      severity: baseline.nonEssentialExpenses > baseline.essentialExpenses * 0.3 ? "moderate" : "low",
    },
    {
      pointKey: "housing",
      label: "Housing costs",
      value: inputs.mortgageOrRent,
      formattedValue: `£${inputs.mortgageOrRent.toLocaleString("en-GB")}/mo (${housingPercentOfEssentials}% of essentials)`,
      severity: pressureSeverity(housingPercentOfEssentials),
    },
  ];

  if (inputs.debtRepayments > 0) {
    pressurePoints.push({
      pointKey: "debt_repayments",
      label: "Debt repayments",
      value: inputs.debtRepayments,
      formattedValue: `£${inputs.debtRepayments.toLocaleString("en-GB")}/mo`,
      severity: inputs.debtRepayments > baseline.essentialExpenses * 0.2 ? "moderate" : "low",
    });
  }

  pressurePoints.push({
    pointKey: "income_included",
    label: "Income included in model",
    value: incomeIncluded,
    formattedValue: `£${incomeIncluded.toLocaleString("en-GB")}/mo`,
    severity: incomeIncluded >= baseline.totalExpenses ? "low" : "moderate",
  });

  pressurePoints.push({
    pointKey: "net_burn",
    label: "Net monthly burn",
    value: baseline.monthlyBurn,
    formattedValue: `£${baseline.monthlyBurn.toLocaleString("en-GB")}/mo`,
    severity: baseline.monthlyBurn > baseline.essentialExpenses * 0.5 ? "elevated" : baseline.monthlyBurn > 0 ? "moderate" : "low",
  });

  return {
    confidence,
    hasUserReportedUncertainty: userUncertain,
    confidenceDisplayLabel,
    baseline: {
      monthsUntilDepletion: baseline.monthsUntilDepletion,
      startingCapital: baseline.startingCapital,
      netMonthlyBurn: baseline.monthlyBurn,
      essentialExpenses: baseline.essentialExpenses,
      nonEssentialExpenses: baseline.nonEssentialExpenses,
      totalExpenses: baseline.totalExpenses,
      incomeIncluded,
      debtRepayments: inputs.debtRepayments,
      housingCost: inputs.mortgageOrRent,
      housingPercentOfEssentials,
      housingPercentOfIncome,
      stabilityBand: baseline.stabilityBand,
      stabilityScore: baseline.stabilityScore,
      projections: baseline.projections,
    },
    severeCaseRunway: severeResult.monthsUntilDepletion,
    scenarios,
    pathScenarios,
    pathChartScenarios,
    composition,
    compositionBar,
    pressurePoints,
    sensitivity: buildSensitivityDrivers(inputs, baseline.monthsUntilDepletion),
    assumptionQuality: buildAssumptionQuality(inputs),
    stabilityFactors: baseline.stabilityExplanation.factors,
  };
}
