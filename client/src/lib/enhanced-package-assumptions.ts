import { computeRedundancyEstimate, formatGBP } from "@/lib/engine";
import { monthlyFromWeeklyGross } from "@/lib/gross-pay";
import type { RedundancyPackageInputs } from "@shared/schema";

export type EnhancedAssumptionId =
  | "none"
  | "month-per-year"
  | "two-weeks-per-year"
  | "one-week-per-year"
  | "three-months-flat"
  | "unknown-default";

export interface EnhancedPackageAssumption {
  id: EnhancedAssumptionId;
  label: string;
  sub: string;
  amount: number;
  enhancedPackage: boolean;
  enhancedAmount: number;
}

function roundAmount(n: number): number {
  return Math.round(n);
}

export function buildEnhancedPackageAssumptions(
  pkg: RedundancyPackageInputs,
): EnhancedPackageAssumption[] {
  const weekly = pkg.weeklyGrossPay;
  const years = Math.max(0, Math.min(pkg.yearsOfService, 20));
  const monthly = monthlyFromWeeklyGross(weekly);
  const statutory = computeRedundancyEstimate({ ...pkg, enhancedPackage: false, enhancedAmount: 0 })
    .statutoryRedundancy;

  const fmt = (amount: number) => formatGBP(roundAmount(amount));
  const vsStatutory =
    statutory > 0 ? ` · statutory alone is ${formatGBP(statutory)}` : "";

  const none: EnhancedPackageAssumption = {
    id: "none",
    label: "I don't know — assume I don't have one",
    sub: "No enhanced element in the model — statutory, notice and holiday only · £0",
    amount: 0,
    enhancedPackage: false,
    enhancedAmount: 0,
  };

  if (weekly <= 0) {
    return [
      none,
      {
        id: "unknown-default",
        label: "I don't know — assume 1 month per year",
        sub: "Enter gross pay above to calculate from your salary.",
        amount: 0,
        enhancedPackage: true,
        enhancedAmount: 0,
      },
    ];
  }

  const monthPerYear = roundAmount(monthly * years);
  const twoWeeksPerYear = roundAmount(weekly * 2 * years);
  const oneWeekPerYear = roundAmount(weekly * years);
  const threeMonthsFlat = roundAmount(monthly * 3);

  return [
    none,
    {
      id: "month-per-year",
      label: "1 month's pay × years of service",
      sub: `Common VR/enhanced wording · ${fmt(monthPerYear)}${vsStatutory}`,
      amount: monthPerYear,
      enhancedPackage: true,
      enhancedAmount: monthPerYear,
    },
    {
      id: "two-weeks-per-year",
      label: "2 weeks' pay × years of service",
      sub: `Frequent employer formula · ${fmt(twoWeeksPerYear)}${vsStatutory}`,
      amount: twoWeeksPerYear,
      enhancedPackage: true,
      enhancedAmount: twoWeeksPerYear,
    },
    {
      id: "one-week-per-year",
      label: "1 week's pay × years of service",
      sub: `Lower enhancement band · ${fmt(oneWeekPerYear)}${vsStatutory}`,
      amount: oneWeekPerYear,
      enhancedPackage: true,
      enhancedAmount: oneWeekPerYear,
    },
    {
      id: "three-months-flat",
      label: "3 months' gross salary (lump sum)",
      sub: `Sometimes offered as a flat enhancement · ${fmt(threeMonthsFlat)}${vsStatutory}`,
      amount: threeMonthsFlat,
      enhancedPackage: true,
      enhancedAmount: threeMonthsFlat,
    },
    {
      id: "unknown-default",
      label: "I don't know — assume 1 month per year",
      sub: `Planning default from your pay · ${fmt(monthPerYear)}. Check your offer letter.`,
      amount: monthPerYear,
      enhancedPackage: true,
      enhancedAmount: monthPerYear,
    },
  ];
}
