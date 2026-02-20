import type {
  RunwayInputs,
  RunwayResult,
  MonthProjection,
  ScenarioComparison,
  SpendingImpact,
  SensitivityResult,
  StabilityExplanation,
  CapitalRecovery,
  RedundancyEstimate,
  MortgageSensitivityResult,
  RedundancyPackageInputs,
  ProjectionRange,
  ProjectionRangeScenario,
} from "@shared/schema";
import { getSectorData } from "@/lib/sectorData";
import { getAgeBandData, weeksToMonths } from "@/lib/ukBenchmarks";

const MAX_PROJECTION_MONTHS = 60;
const UK_STATUTORY_WEEKLY_PAY_CAP = 643;
const UK_TAX_FREE_THRESHOLD = 30000;

function computeEssentialExpenses(inputs: RunwayInputs): number {
  return (
    inputs.mortgageOrRent +
    inputs.utilities +
    inputs.food +
    inputs.insurance +
    inputs.transport +
    inputs.debtRepayments +
    inputs.childcare +
    inputs.otherEssential
  );
}

function computeNonEssentialExpenses(inputs: RunwayInputs): number {
  return (
    inputs.subscriptions +
    inputs.leisure +
    inputs.travel +
    inputs.discretionaryOther
  );
}

function getRedundancyTotal(inputs: RunwayInputs): number {
  const pkg = inputs.redundancyPackage;
  if (pkg.useManualOverride && pkg.manualOverrideAmount > 0) {
    return pkg.manualOverrideAmount;
  }
  const estimate = computeRedundancyEstimate(pkg);
  return estimate.totalEstimated;
}

function computeStartingCapital(inputs: RunwayInputs): number {
  return (
    inputs.cashSavings +
    inputs.liquidInvestments +
    getRedundancyTotal(inputs) +
    inputs.otherOneOffIncome
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeRedundancyEstimate(pkg: RedundancyPackageInputs): RedundancyEstimate {
  const cappedWeeklyPay = Math.min(pkg.weeklyGrossPay, UK_STATUTORY_WEEKLY_PAY_CAP);
  const cappedYears = Math.min(pkg.yearsOfService, 20);

  let statutoryWeeks = 0;
  for (let year = 0; year < cappedYears; year++) {
    const ageAtYear = pkg.age - (cappedYears - year);
    if (ageAtYear < 22) {
      statutoryWeeks += 0.5;
    } else if (ageAtYear >= 41) {
      statutoryWeeks += 1.5;
    } else {
      statutoryWeeks += 1;
    }
  }

  const statutoryRedundancy = round2(statutoryWeeks * cappedWeeklyPay);
  const noticePay = round2(pkg.noticeWeeks * pkg.weeklyGrossPay);
  const holidayPay = round2(pkg.holidayWeeks * pkg.weeklyGrossPay);

  let totalEstimated = statutoryRedundancy + noticePay + holidayPay;
  if (pkg.enhancedPackage && pkg.enhancedAmount > 0) {
    totalEstimated = pkg.enhancedAmount + noticePay + holidayPay;
  }

  return {
    statutoryRedundancy,
    noticePay,
    holidayPay,
    totalEstimated: round2(totalEstimated),
    taxFreeThreshold: UK_TAX_FREE_THRESHOLD,
  };
}

export function computeRunway(inputs: RunwayInputs): RunwayResult {
  const startingCapital = computeStartingCapital(inputs);
  const essentialExpenses = computeEssentialExpenses(inputs);
  const nonEssentialExpenses = computeNonEssentialExpenses(inputs);
  const totalExpenses = essentialExpenses + (inputs.includeNonEssential ? nonEssentialExpenses : 0);

  const projections: MonthProjection[] = [];
  const milestones: RunwayResult["milestones"] = [];
  let capital = startingCapital;
  let monthsUntilDepletion = MAX_PROJECTION_MONTHS;
  let depleted = false;

  const halfCapitalThreshold = startingCapital / 2;
  let halfCapitalReached = false;
  let emergencyBufferReached = false;
  let oneMonthExpensesReached = false;

  let depletionMonth: number | null = null;
  let recoveryMonth: number | null = null;

  for (let month = 0; month <= MAX_PROJECTION_MONTHS; month++) {
    if (month === 0) {
      projections.push({
        month: 0,
        capital: round2(capital),
        income: 0,
        expenses: 0,
        netBurn: 0,
        milestones: [],
      });
      continue;
    }

    const income = computeMonthlyIncome(inputs, month);
    const netBurn = totalExpenses - income;
    capital = capital - netBurn;

    const monthMilestones: string[] = [];

    if (capital <= 0 && !depleted) {
      capital = 0;
      depleted = true;
      depletionMonth = month;
      monthsUntilDepletion = month;
      milestones.push({ month, description: "Capital fully depleted", severity: "critical" });
      monthMilestones.push("Capital fully depleted");
    }

    if (depleted && capital > 0 && recoveryMonth === null) {
      recoveryMonth = month;
    }

    if (!depleted) {
      if (!halfCapitalReached && capital <= halfCapitalThreshold && startingCapital > 0) {
        halfCapitalReached = true;
        milestones.push({ month, description: `Capital falls below 50% of starting amount (${formatGBP(halfCapitalThreshold)})`, severity: "warning" });
        monthMilestones.push("Capital below 50%");
      }

      if (!emergencyBufferReached && capital <= inputs.emergencyBuffer && inputs.emergencyBuffer > 0) {
        emergencyBufferReached = true;
        milestones.push({ month, description: `Capital falls below selected buffer (${formatGBP(inputs.emergencyBuffer)})`, severity: "warning" });
        monthMilestones.push("Below emergency buffer");
      }

      if (!oneMonthExpensesReached && capital <= totalExpenses && totalExpenses > 0) {
        oneMonthExpensesReached = true;
        milestones.push({ month, description: `Capital equals one month of expenses (${formatGBP(totalExpenses)})`, severity: "critical" });
        monthMilestones.push("One month expenses remaining");
      }
    }

    projections.push({
      month,
      capital: round2(Math.max(0, capital)),
      income: round2(income),
      expenses: round2(totalExpenses),
      netBurn: round2(netBurn),
      milestones: monthMilestones,
    });
  }

  if (!depleted && capital > 0) {
    monthsUntilDepletion = MAX_PROJECTION_MONTHS;
  }

  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate;
  const monthlyBurn = totalExpenses - gapIncome;

  const stabilityExplanation = computeStabilityExplanation(inputs, monthsUntilDepletion, essentialExpenses, totalExpenses, startingCapital);
  const stabilityScore = computeStabilityScoreFromExplanation(stabilityExplanation);
  const stabilityBand: RunwayResult["stabilityBand"] = stabilityScore >= 75 ? "Stable" : stabilityScore >= 45 ? "Watch" : "High Pressure";

  const capitalRecovery = computeCapitalRecovery(inputs, projections, startingCapital, depletionMonth);

  return {
    monthsUntilDepletion: Math.min(monthsUntilDepletion, MAX_PROJECTION_MONTHS),
    capitalAfter3Months: round2(Math.max(0, projections[Math.min(3, projections.length - 1)]?.capital ?? 0)),
    capitalAfter6Months: round2(Math.max(0, projections[Math.min(6, projections.length - 1)]?.capital ?? 0)),
    capitalAfter12Months: round2(Math.max(0, projections[Math.min(12, projections.length - 1)]?.capital ?? 0)),
    startingCapital: round2(startingCapital),
    monthlyBurn: round2(Math.max(0, monthlyBurn)),
    essentialExpenses: round2(essentialExpenses),
    nonEssentialExpenses: round2(nonEssentialExpenses),
    totalExpenses: round2(totalExpenses),
    projections,
    stabilityScore,
    stabilityBand,
    stabilityExplanation,
    milestones,
    capitalRecovery,
  };
}

function computeMonthlyIncome(inputs: RunwayInputs, month: number): number {
  if (inputs.monthsUntilNewJob > 0 && month <= inputs.monthsUntilNewJob) {
    return inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate;
  } else if (inputs.monthsUntilNewJob > 0 && month > inputs.monthsUntilNewJob) {
    return inputs.currentMonthlyNetIncome;
  }
  return inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate;
}

function computeCapitalRecovery(
  inputs: RunwayInputs,
  projections: MonthProjection[],
  startingCapital: number,
  depletionMonth: number | null,
): CapitalRecovery {
  if (inputs.monthsUntilNewJob <= 0 || startingCapital <= 0) {
    return { recoveryMonth: null, rebuildDuration: null, capitalAt12MonthsPostReemployment: 0, recovers: false };
  }

  const reemploymentMonth = inputs.monthsUntilNewJob;
  let recoveryMonth: number | null = null;

  for (let i = reemploymentMonth + 1; i < projections.length; i++) {
    if (projections[i] && projections[i].capital >= startingCapital) {
      recoveryMonth = i;
      break;
    }
  }

  const postReemployment12 = Math.min(reemploymentMonth + 12, projections.length - 1);
  const capitalAt12 = projections[postReemployment12]?.capital ?? 0;

  return {
    recoveryMonth,
    rebuildDuration: recoveryMonth !== null ? recoveryMonth - reemploymentMonth : null,
    capitalAt12MonthsPostReemployment: round2(capitalAt12),
    recovers: recoveryMonth !== null,
  };
}

function computeStabilityExplanation(
  inputs: RunwayInputs,
  monthsUntilDepletion: number,
  essentialExpenses: number,
  totalExpenses: number,
  startingCapital: number,
): StabilityExplanation {
  const housingPercent = essentialExpenses > 0 ? round2((inputs.mortgageOrRent / essentialExpenses) * 100) : 0;
  const debtPercent = totalExpenses > 0 ? round2((inputs.debtRepayments / totalExpenses) * 100) : 0;
  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate;
  const gapIncomePercent = inputs.currentMonthlyNetIncome > 0 ? round2((gapIncome / inputs.currentMonthlyNetIncome) * 100) : 0;
  const capitalCoverMonths = totalExpenses > 0 ? round2(startingCapital / totalExpenses) : 0;
  const nonEssential = computeNonEssentialExpenses(inputs);
  const nonEssentialPercent = totalExpenses > 0 ? round2((nonEssential / totalExpenses) * 100) : 0;

  const factors: string[] = [];
  if (monthsUntilDepletion < 3) factors.push("Runway below 3 months");
  else if (monthsUntilDepletion < 6) factors.push("Runway below 6 months");
  else if (monthsUntilDepletion < 9) factors.push("Runway below 9 months");
  else if (monthsUntilDepletion < 12) factors.push("Runway below 12 months");
  if (housingPercent > 45) factors.push(`Housing represents ${housingPercent}% of essential costs`);
  else if (housingPercent > 35) factors.push(`Housing represents ${housingPercent}% of essential costs`);
  if (debtPercent > 25) factors.push(`Debt represents ${debtPercent}% of total expenses`);
  else if (debtPercent > 15) factors.push(`Debt represents ${debtPercent}% of total expenses`);
  if (gapIncomePercent < 25) factors.push(`Gap income covers ${gapIncomePercent}% of prior earnings`);
  else if (gapIncomePercent < 50) factors.push(`Gap income covers ${gapIncomePercent}% of prior earnings`);
  if (capitalCoverMonths < 3 && startingCapital > 0) factors.push(`Starting capital covers ${capitalCoverMonths.toFixed(1)} months of expenses`);
  if (nonEssentialPercent > 30) factors.push(`Non-essential spending represents ${nonEssentialPercent}% of total`);

  return {
    runwayMonths: monthsUntilDepletion,
    housingPercent,
    debtPercent,
    gapIncomePercent,
    capitalCoverMonths,
    nonEssentialPercent,
    factors,
  };
}

function computeStabilityScoreFromExplanation(explanation: StabilityExplanation): number {
  let score = 100;

  if (explanation.runwayMonths < 3) score -= 40;
  else if (explanation.runwayMonths < 6) score -= 30;
  else if (explanation.runwayMonths < 9) score -= 20;
  else if (explanation.runwayMonths < 12) score -= 10;

  if (explanation.housingPercent > 45) score -= 10;
  else if (explanation.housingPercent > 35) score -= 5;

  if (explanation.debtPercent > 25) score -= 15;
  else if (explanation.debtPercent > 15) score -= 8;

  if (explanation.gapIncomePercent < 25) score -= 15;
  else if (explanation.gapIncomePercent < 50) score -= 10;

  if (explanation.capitalCoverMonths < 3 && explanation.capitalCoverMonths > 0) score -= 10;

  if (explanation.nonEssentialPercent > 30) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function computeScenarios(inputs: RunwayInputs): ScenarioComparison[] {
  const zeroIncomeInputs: RunwayInputs = {
    ...inputs,
    replacementMonthlyIncome: 0,
    benefitSupportEstimate: 0,
    monthsUntilNewJob: 0,
  };

  const halfIncomeInputs: RunwayInputs = {
    ...inputs,
    replacementMonthlyIncome: inputs.currentMonthlyNetIncome * 0.5,
    benefitSupportEstimate: 0,
    monthsUntilNewJob: 0,
  };

  const jobGapMonths = inputs.monthsUntilNewJob > 0 ? inputs.monthsUntilNewJob : 6;
  const newJobInputs: RunwayInputs = {
    ...inputs,
    monthsUntilNewJob: jobGapMonths,
  };

  return [
    {
      name: "Zero Income",
      description: "No replacement income or benefits for entire projection period",
      result: computeRunway(zeroIncomeInputs),
    },
    {
      name: "50% Previous Income",
      description: "Income at 50% of previous level, ongoing (e.g. part-time, contract)",
      result: computeRunway(halfIncomeInputs),
    },
    {
      name: `Full income after ${jobGapMonths}mo`,
      description: `Previous income resumes after ${jobGapMonths} months of gap income only`,
      result: computeRunway(newJobInputs),
    },
  ];
}

export function computeEssentialOnlyComparison(inputs: RunwayInputs): { fullRunway: number; essentialOnlyRunway: number; extraMonths: number; monthlySaving: number } {
  const fullResult = computeRunway(inputs);
  const essentialOnlyInputs: RunwayInputs = { ...inputs, includeNonEssential: false };
  const essentialResult = computeRunway(essentialOnlyInputs);
  const nonEssential = computeNonEssentialExpenses(inputs);

  return {
    fullRunway: fullResult.monthsUntilDepletion,
    essentialOnlyRunway: essentialResult.monthsUntilDepletion,
    extraMonths: essentialResult.monthsUntilDepletion - fullResult.monthsUntilDepletion,
    monthlySaving: round2(nonEssential),
  };
}

export function computeSpendingImpact(inputs: RunwayInputs): SpendingImpact[] {
  const baseResult = computeRunway(inputs);
  const categories: Array<{ key: keyof RunwayInputs; label: string; effort: "Low" | "Medium" | "High"; reductionPercent: number }> = [
    { key: "subscriptions", label: "If subscription spending were removed", effort: "Low", reductionPercent: 1.0 },
    { key: "leisure", label: "If leisure spending were 50% lower", effort: "Medium", reductionPercent: 0.5 },
    { key: "travel", label: "If travel spending were removed", effort: "Low", reductionPercent: 1.0 },
    { key: "discretionaryOther", label: "If other discretionary were removed", effort: "Medium", reductionPercent: 1.0 },
    { key: "food", label: "If food spending were 25% lower", effort: "Medium", reductionPercent: 0.25 },
    { key: "transport", label: "If transport spending were 30% lower", effort: "Medium", reductionPercent: 0.3 },
    { key: "insurance", label: "If insurance costs were 15% lower", effort: "High", reductionPercent: 0.15 },
    { key: "utilities", label: "If utility costs were 10% lower", effort: "Medium", reductionPercent: 0.1 },
  ];

  const baseRunway = baseResult.monthsUntilDepletion;

  return categories
    .map((cat) => {
      const currentAmount = Number(inputs[cat.key]) || 0;
      if (currentAmount <= 0) return null;

      const reductionAmount = round2(currentAmount * cat.reductionPercent);

      const modifiedInputs = { ...inputs, [cat.key]: currentAmount - reductionAmount };
      const modifiedResult = computeRunway(modifiedInputs);

      let runwayExtension = modifiedResult.monthsUntilDepletion - baseRunway;
      if (baseRunway >= MAX_PROJECTION_MONTHS && modifiedResult.monthsUntilDepletion >= MAX_PROJECTION_MONTHS) {
        runwayExtension = 0;
      }

      return {
        category: cat.label,
        currentAmount: round2(currentAmount),
        reductionAmount,
        runwayExtensionMonths: round2(Math.max(0, runwayExtension)),
        impactPerPound: reductionAmount > 0 && runwayExtension > 0 ? round2(runwayExtension / reductionAmount) : 0,
        effort: cat.effort,
      };
    })
    .filter((item): item is SpendingImpact => item !== null && item.reductionAmount > 0)
    .sort((a, b) => {
      if (b.runwayExtensionMonths !== a.runwayExtensionMonths) {
        return b.runwayExtensionMonths - a.runwayExtensionMonths;
      }
      return b.reductionAmount - a.reductionAmount;
    });
}

export function computeSensitivity(inputs: RunwayInputs): SensitivityResult[] {
  const base = computeRunway(inputs);

  const expense10 = computeRunway({
    ...inputs,
    mortgageOrRent: inputs.mortgageOrRent * 1.1,
    utilities: inputs.utilities * 1.1,
    food: inputs.food * 1.1,
    insurance: inputs.insurance * 1.1,
    transport: inputs.transport * 1.1,
  });

  const expense20 = computeRunway({
    ...inputs,
    mortgageOrRent: inputs.mortgageOrRent * 1.2,
    utilities: inputs.utilities * 1.2,
    food: inputs.food * 1.2,
    insurance: inputs.insurance * 1.2,
    transport: inputs.transport * 1.2,
  });

  const delay3 = computeRunway({
    ...inputs,
    monthsUntilNewJob: (inputs.monthsUntilNewJob || 6) + 3,
  });

  const delay6 = computeRunway({
    ...inputs,
    monthsUntilNewJob: (inputs.monthsUntilNewJob || 6) + 6,
  });

  const noNonEssential = computeRunway({
    ...inputs,
    includeNonEssential: false,
  });

  const halfSavings = computeRunway({
    ...inputs,
    cashSavings: inputs.cashSavings * 0.5,
    liquidInvestments: inputs.liquidInvestments * 0.5,
  });

  return [
    {
      label: "If essential expenses increased by 10%",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: expense10.monthsUntilDepletion,
      difference: round2(expense10.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "If essential expenses increased by 20%",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: expense20.monthsUntilDepletion,
      difference: round2(expense20.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "If income resumed 3 months later than assumed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: delay3.monthsUntilDepletion,
      difference: round2(delay3.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "If income resumed 6 months later than assumed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: delay6.monthsUntilDepletion,
      difference: round2(delay6.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "If all non-essential spending were removed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: noNonEssential.monthsUntilDepletion,
      difference: round2(noNonEssential.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "If starting savings were 50% lower than assumed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: halfSavings.monthsUntilDepletion,
      difference: round2(halfSavings.monthsUntilDepletion - base.monthsUntilDepletion),
    },
  ];
}

export function computeMortgageSensitivity(inputs: RunwayInputs): MortgageSensitivityResult[] {
  const base = computeRunway(inputs);
  const percentages = [1, 2, inputs.mortgageSensitivityPercent].filter((p, i, arr) => p > 0 && arr.indexOf(p) === i);

  return percentages.map((pct) => {
    const increase = inputs.mortgageOrRent * (pct / 100);
    const modified = computeRunway({
      ...inputs,
      mortgageOrRent: inputs.mortgageOrRent + increase,
    });

    return {
      label: `If housing cost increased by ${pct}%`,
      increasePercent: pct,
      adjustedRunway: modified.monthsUntilDepletion,
      difference: round2(modified.monthsUntilDepletion - base.monthsUntilDepletion),
      newHousingCost: round2(inputs.mortgageOrRent + increase),
    };
  });
}

export function computeProjectionRange(inputs: RunwayInputs): ProjectionRange {
  const sectorData = getSectorData(inputs.sector);
  const ageBandData = getAgeBandData(inputs.redundancyPackage.age);

  const effectiveP25 = Math.min(sectorData.p25Weeks, ageBandData.p25Weeks);
  const effectiveP50 = Math.round((sectorData.medianWeeks + ageBandData.medianWeeks) / 2);
  const effectiveP75 = Math.max(sectorData.p75Weeks, ageBandData.p75Weeks);

  function buildScenario(
    label: string,
    percentileLabel: string,
    weeks: number,
  ): ProjectionRangeScenario {
    const months = Math.max(1, Math.round(weeksToMonths(weeks)));
    const scenarioInputs: RunwayInputs = {
      ...inputs,
      monthsUntilNewJob: months,
    };
    const scenarioResult = computeRunway(scenarioInputs);

    let depletionMonth: number | null = null;
    let recoveryMonth: number | null = null;

    for (const p of scenarioResult.projections) {
      if (p.capital <= 0 && depletionMonth === null) {
        depletionMonth = p.month;
      }
    }

    if (scenarioResult.capitalRecovery.recovers) {
      recoveryMonth = scenarioResult.capitalRecovery.recoveryMonth;
    }

    return {
      label,
      percentileLabel,
      reemploymentWeeks: weeks,
      reemploymentMonths: weeksToMonths(weeks),
      runwayMonths: scenarioResult.monthsUntilDepletion,
      depletionMonth,
      recoveryMonth,
    };
  }

  return {
    fast: buildScenario("Fast Reemployment Scenario", "25th percentile", effectiveP25),
    typical: buildScenario("Typical Reemployment Scenario", "Median", effectiveP50),
    slow: buildScenario("Slower Reemployment Scenario", "75th percentile", effectiveP75),
  };
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonths(months: number): string {
  if (months >= MAX_PROJECTION_MONTHS) return "60+ months";
  if (months === 1) return "1 month";
  return `${months} months`;
}
