import type { RunwayInputs, RunwayResult, MonthProjection, ScenarioComparison, SpendingImpact, SensitivityResult } from "@shared/schema";

const MAX_PROJECTION_MONTHS = 60;

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

function computeStartingCapital(inputs: RunwayInputs): number {
  return (
    inputs.cashSavings +
    inputs.liquidInvestments +
    inputs.redundancyPayout +
    inputs.otherOneOffIncome
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
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
      monthsUntilDepletion = month;
      milestones.push({ month, description: "Capital fully depleted", severity: "critical" });
      monthMilestones.push("Capital fully depleted");
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

  const stabilityScore = computeStabilityScore(inputs, monthsUntilDepletion, essentialExpenses, totalExpenses, startingCapital);
  const stabilityBand = stabilityScore >= 75 ? "Stable" : stabilityScore >= 45 ? "Watch" : "High Pressure";

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
    milestones,
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

function computeStabilityScore(
  inputs: RunwayInputs,
  monthsUntilDepletion: number,
  essentialExpenses: number,
  totalExpenses: number,
  startingCapital: number,
): number {
  let score = 100;

  if (monthsUntilDepletion < 3) score -= 40;
  else if (monthsUntilDepletion < 6) score -= 30;
  else if (monthsUntilDepletion < 9) score -= 20;
  else if (monthsUntilDepletion < 12) score -= 10;

  if (essentialExpenses > 0 && inputs.mortgageOrRent / essentialExpenses > 0.45) score -= 10;
  else if (essentialExpenses > 0 && inputs.mortgageOrRent / essentialExpenses > 0.35) score -= 5;

  if (totalExpenses > 0 && inputs.debtRepayments / totalExpenses > 0.25) score -= 15;
  else if (totalExpenses > 0 && inputs.debtRepayments / totalExpenses > 0.15) score -= 8;

  const gapIncome = inputs.replacementMonthlyIncome + inputs.benefitSupportEstimate;
  const replacementRatio = inputs.currentMonthlyNetIncome > 0
    ? gapIncome / inputs.currentMonthlyNetIncome
    : 0;
  if (replacementRatio < 0.25) score -= 15;
  else if (replacementRatio < 0.5) score -= 10;

  if (startingCapital > 0 && totalExpenses > 0) {
    const monthsOfCover = startingCapital / totalExpenses;
    if (monthsOfCover < 3) score -= 10;
  }

  const nonEssential = computeNonEssentialExpenses(inputs);
  if (totalExpenses > 0 && nonEssential / totalExpenses > 0.3) score -= 5;

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
    { key: "subscriptions", label: "Subscriptions (cancel all)", effort: "Low", reductionPercent: 1.0 },
    { key: "leisure", label: "Leisure (halve)", effort: "Medium", reductionPercent: 0.5 },
    { key: "travel", label: "Travel & holidays (cancel)", effort: "Low", reductionPercent: 1.0 },
    { key: "discretionaryOther", label: "Other discretionary (cancel)", effort: "Medium", reductionPercent: 1.0 },
    { key: "food", label: "Food & groceries (-25%)", effort: "Medium", reductionPercent: 0.25 },
    { key: "transport", label: "Transport (-30%)", effort: "Medium", reductionPercent: 0.3 },
    { key: "insurance", label: "Insurance (review -15%)", effort: "High", reductionPercent: 0.15 },
    { key: "utilities", label: "Utilities (-10%)", effort: "Medium", reductionPercent: 0.1 },
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
      label: "Essential expenses increase by 10%",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: expense10.monthsUntilDepletion,
      difference: round2(expense10.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "Essential expenses increase by 20%",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: expense20.monthsUntilDepletion,
      difference: round2(expense20.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "Income resumes 3 months later than assumed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: delay3.monthsUntilDepletion,
      difference: round2(delay3.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "Income resumes 6 months later than assumed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: delay6.monthsUntilDepletion,
      difference: round2(delay6.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "All non-essential spending removed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: noNonEssential.monthsUntilDepletion,
      difference: round2(noNonEssential.monthsUntilDepletion - base.monthsUntilDepletion),
    },
    {
      label: "Starting savings are 50% lower than assumed",
      baseRunway: base.monthsUntilDepletion,
      adjustedRunway: halfSavings.monthsUntilDepletion,
      difference: round2(halfSavings.monthsUntilDepletion - base.monthsUntilDepletion),
    },
  ];
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
