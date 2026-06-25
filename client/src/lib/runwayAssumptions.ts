import type { RunwayInputs, RunwayResult, ScenarioComparison } from "@shared/schema";
import { computeRunway, computeScenarios } from "@/lib/engine";

export function hasIncomeRecoveryModelled(inputs: RunwayInputs): boolean {
  const partner = inputs.includePartnerIncome ? (inputs.partnerMonthlyNetIncome ?? 0) : 0;
  return (
    inputs.currentMonthlyNetIncome > 0 ||
    inputs.replacementMonthlyIncome > 0 ||
    inputs.benefitSupportEstimate > 0 ||
    partner > 0
  );
}

export function getGapIncome(inputs: RunwayInputs): number {
  const partner = inputs.includePartnerIncome ? (inputs.partnerMonthlyNetIncome ?? 0) : 0;
  return inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate + partner;
}

export type ResilienceDisplayBand = RunwayResult["stabilityBand"] | "Incomplete";

export interface ResilienceDisplay {
  score: number;
  band: ResilienceDisplayBand;
  bandLabel: string;
  incomeModelled: boolean;
}

/** Caps "Stable" when income recovery has not been modelled — display layer only. */
export function getResilienceDisplay(inputs: RunwayInputs, result: RunwayResult): ResilienceDisplay {
  const incomeModelled = hasIncomeRecoveryModelled(inputs);
  if (incomeModelled) {
    return {
      score: result.stabilityScore,
      band: result.stabilityBand,
      bandLabel: result.stabilityBand,
      incomeModelled: true,
    };
  }

  const cappedScore = Math.min(result.stabilityScore, 74);
  const band: ResilienceDisplayBand = cappedScore >= 45 ? "Watch" : "High Pressure";
  return {
    score: cappedScore,
    band: "Incomplete",
    bandLabel: "Incomplete income assumptions",
    incomeModelled: false,
  };
}

function applyEssentialsMultiplier(inputs: RunwayInputs, multiplier: number): RunwayInputs {
  return {
    ...inputs,
    mortgageOrRent: inputs.mortgageOrRent * multiplier,
    utilities: inputs.utilities * multiplier,
    food: inputs.food * multiplier,
    insurance: inputs.insurance * multiplier,
    transport: inputs.transport * multiplier,
  };
}

/** Slow-case inputs: job-gap extension when income is modelled; essentials stress otherwise. */
export function buildSlowCaseInputs(
  inputs: RunwayInputs,
  worseGapMonths: number,
): { inputs: RunwayInputs; whatChanged: string } {
  if (!hasIncomeRecoveryModelled(inputs)) {
    return {
      inputs: applyEssentialsMultiplier(inputs, 1.1),
      whatChanged: "Essential costs increased by 10% in this stress test — income recovery not yet modelled.",
    };
  }
  return {
    inputs: { ...inputs, monthsUntilNewJob: worseGapMonths },
    whatChanged: `Job-gap extended to ${worseGapMonths} months before prior income resumes.`,
  };
}

/** Severe-case inputs: zero-income path when income is modelled; stronger essentials stress otherwise. */
export function buildSevereCaseInputs(inputs: RunwayInputs): { inputs: RunwayInputs; whatChanged: string } {
  if (!hasIncomeRecoveryModelled(inputs)) {
    return {
      inputs: applyEssentialsMultiplier(inputs, 1.2),
      whatChanged: "Essential costs increased by 20% in this stress test — income recovery not yet modelled.",
    };
  }
  return {
    inputs: {
      ...inputs,
      replacementMonthlyIncome: 0,
      benefitSupportEstimate: 0,
      currentMonthlyNetIncome: 0,
      monthsUntilNewJob: 0,
      includePartnerIncome: false,
      partnerMonthlyNetIncome: 0,
    },
    whatChanged: "Replacement income, benefits and job-gap income set to zero for the full projection.",
  };
}

export function buildPreviewConsoleScenarios(inputs: RunwayInputs): ScenarioComparison[] {
  const baseline = computeRunway(inputs);
  const baselineScenario: ScenarioComparison = {
    name: "Your assumptions",
    description: "Your entered income, expenses and job-gap assumptions.",
    result: baseline,
  };
  return [baselineScenario, ...computeScenarios(inputs)];
}

export function describeIncomePath(inputs: RunwayInputs): string {
  if (!hasIncomeRecoveryModelled(inputs)) {
    return "No income recovery modelled — projection uses gap income only until capital is depleted.";
  }
  const gap = getGapIncome(inputs);
  const parts: string[] = [];
  if (gap > 0) parts.push(`${gap.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })}/mo during the gap`);
  if (inputs.currentMonthlyNetIncome > 0 && inputs.monthsUntilNewJob > 0) {
    parts.push(`full prior income from month ${inputs.monthsUntilNewJob + 1}`);
  } else if (inputs.currentMonthlyNetIncome > 0) {
    parts.push("prior income included from month 1");
  }
  return parts.length > 0 ? parts.join("; then ") : "Income assumptions entered.";
}
