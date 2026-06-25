import type { RunwayInputs } from "@shared/schema";

export type AssumptionStatus = "complete" | "partial" | "missing" | "uncertain";

export interface AssumptionQualityItem {
  inputKey: string;
  label: string;
  status: AssumptionStatus;
  note?: string;
}

function essentialTotal(inputs: RunwayInputs): number {
  return (
    inputs.mortgageOrRent +
    inputs.utilities +
    inputs.food +
    inputs.councilTax +
    inputs.insurance +
    inputs.transport +
    inputs.debtRepayments +
    inputs.childcare +
    inputs.otherEssential
  );
}

export function buildAssumptionQuality(inputs: RunwayInputs): AssumptionQualityItem[] {
  const uncertain = inputs.context.confidenceLevel === "uncertain";

  const incomeComplete =
    inputs.currentMonthlyNetIncome > 0 ||
    inputs.replacementMonthlyIncome > 0 ||
    inputs.benefitSupportEstimate > 0 ||
    (inputs.includePartnerIncome && inputs.partnerMonthlyNetIncome > 0);

  const packageComplete =
    inputs.redundancyPackage.useManualOverride ||
    inputs.redundancyPackage.weeklyGrossPay > 0 ||
    inputs.redundancyPackage.enhancedAmount > 0;

  const savingsComplete = inputs.cashSavings > 0 || inputs.liquidInvestments > 0;
  const essentials = essentialTotal(inputs);
  const essentialsComplete = inputs.mortgageOrRent > 0 && inputs.food > 0;
  const housingComplete =
    inputs.mortgageOrRent > 0 || inputs.context.housingType === "owned_outright";
  const jobGapComplete = inputs.monthsUntilNewJob > 0;
  const benefitsUsed = inputs.benefitSupportEstimate > 0;
  const partnerRelevant = inputs.context.householdStructure !== "single";
  const partnerComplete =
    !partnerRelevant ||
    !inputs.includePartnerIncome ||
    inputs.partnerMonthlyNetIncome > 0;

  const items: AssumptionQualityItem[] = [
    {
      inputKey: "income",
      label: "Income assumptions",
      status: incomeComplete ? (uncertain ? "uncertain" : "complete") : "missing",
    },
    {
      inputKey: "redundancy_package",
      label: "Redundancy package",
      status: packageComplete ? (uncertain ? "uncertain" : "complete") : "partial",
      note: !packageComplete ? "Package detail may be estimated from limited inputs." : undefined,
    },
    {
      inputKey: "savings",
      label: "Savings and investments",
      status: savingsComplete ? (uncertain ? "uncertain" : "complete") : "missing",
    },
    {
      inputKey: "essential_costs",
      label: "Essential costs",
      status: essentialsComplete
        ? uncertain
          ? "uncertain"
          : "complete"
        : essentials > 0
          ? "partial"
          : "missing",
    },
    {
      inputKey: "housing",
      label: "Housing costs",
      status: housingComplete ? (uncertain ? "uncertain" : "complete") : "missing",
    },
    {
      inputKey: "replacement_timing",
      label: "Replacement income timing",
      status: jobGapComplete ? (uncertain ? "uncertain" : "complete") : "partial",
      note: !jobGapComplete ? "Job-gap months not set — model may use defaults." : undefined,
    },
    {
      inputKey: "sector_job_gap",
      label: "Sector / job-gap assumption",
      status: inputs.sector ? (uncertain ? "uncertain" : "complete") : "partial",
    },
    {
      inputKey: "benefits",
      label: "Benefits estimate",
      status: benefitsUsed ? (uncertain ? "uncertain" : "complete") : "partial",
      note: !benefitsUsed ? "No benefits estimate included in model." : undefined,
    },
    {
      inputKey: "partner_income",
      label: "Partner income",
      status: !partnerRelevant
        ? "complete"
        : partnerComplete
          ? uncertain
            ? "uncertain"
            : "complete"
          : "partial",
      note:
        partnerRelevant && !inputs.includePartnerIncome
          ? "Partner income not included in baseline model."
          : undefined,
    },
  ];

  return items;
}
