import type { RunwayInputs } from "@shared/schema";
import {
  computeRedundancyEstimate,
  computeRunway,
  computeVoluntaryRedundancyComparison,
  UK_STATUTORY_REDUNDANCY,
  formatGBP,
} from "@/lib/engine";
import { buildComposition } from "@/lib/private-runway-brief/buildComposition";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";

export type PackageComponentStatus = "entered" | "missing" | "not_applicable" | "manual_estimate";

export interface PackageComponentRow {
  itemKey: string;
  label: string;
  amount: number | null;
  status: PackageComponentStatus;
  explanation: string;
  checkNote?: string;
  taxLabel?: "usually_separate" | "may_be_taxable" | "check_treatment" | "included_as_entered";
}

export interface PackageWarning {
  warningKey: string;
  title: string;
  body: string;
  severity: "info" | "caution";
}

export interface StatutoryBandRow {
  label: string;
  weeks: number;
  amount: number;
}

export interface PackageDashboardData {
  estimate: ReturnType<typeof computeRedundancyEstimate>;
  packageTotal: number;
  amountUsedInRunway: number;
  statutoryOnlyTotal: number;
  composition: ReturnType<typeof buildComposition>;
  components: PackageComponentRow[];
  warnings: PackageWarning[];
  statutoryBands: StatutoryBandRow[];
  cappedWeeklyPay: number;
  cappedYears: number;
  bridge: {
    packageTotal: number;
    savingsAndInvestments: number;
    startingCapital: number;
    netMonthlyBurn: number;
    baselineRunwayMonths: number;
    severeRunwayMonths: number;
  };
  offerComparison: {
    statutoryEstimate: number;
    employerOffer: number;
    difference: number;
    upliftPercent: number | null;
    extraRunwayMonths: number | null;
    hasEmployerOffer: boolean;
  };
  taxSensitive: PackageComponentRow[];
  checklist: Array<{
    itemKey: string;
    label: string;
    status: "entered" | "not_entered" | "not_applicable" | "verify";
    whyItMatters: string;
    whereToCheck: string;
  }>;
  completeness: {
    percent: number;
    band: "limited" | "partial" | "strong" | "detailed";
    bandLabel: string;
    enteredCount: number;
    applicableCount: number;
    missingKeys: string[];
  };
}

function componentStatus(amount: number, entered: boolean, manual = false): PackageComponentStatus {
  if (manual) return "manual_estimate";
  if (!entered) return "missing";
  if (amount > 0) return "entered";
  return "missing";
}

export function buildPackageDashboardData(inputs: RunwayInputs): PackageDashboardData {
  const pkg = inputs.redundancyPackage;
  const estimate = computeRedundancyEstimate(pkg);
  const baseline = computeRunway(inputs);
  const brief = buildBriefDashboardData(inputs);
  const composition = buildComposition(inputs, baseline.startingCapital);

  const packageTotal =
    pkg.useManualOverride && pkg.manualOverrideAmount > 0
      ? pkg.manualOverrideAmount
      : estimate.totalEstimated;

  const statutoryOnlyTotal = estimate.statutoryRedundancy + estimate.noticePay + estimate.holidayPay;

  const cappedWeeklyPay = Math.min(pkg.weeklyGrossPay, UK_STATUTORY_REDUNDANCY.weeklyPayCap);
  const cappedYears = Math.min(pkg.yearsOfService, UK_STATUTORY_REDUNDANCY.maxServiceYears);

  const statutoryBands: StatutoryBandRow[] = [];
  if (estimate.qualifyingServiceMet && cappedYears > 0) {
    let under22 = 0;
    let mid = 0;
    let over41 = 0;
    for (let year = 0; year < cappedYears; year++) {
      const ageAtYear = pkg.age - (cappedYears - year);
      if (ageAtYear < 22) under22 += 0.5;
      else if (ageAtYear >= 41) over41 += 1.5;
      else mid += 1;
    }
    if (under22 > 0) {
      statutoryBands.push({
        label: "Years under age 22 (½ week each)",
        weeks: under22,
        amount: Math.round(under22 * cappedWeeklyPay * 100) / 100,
      });
    }
    if (mid > 0) {
      statutoryBands.push({
        label: "Years aged 22–40 (1 week each)",
        weeks: mid,
        amount: Math.round(mid * cappedWeeklyPay * 100) / 100,
      });
    }
    if (over41 > 0) {
      statutoryBands.push({
        label: "Years aged 41+ (1½ weeks each)",
        weeks: over41,
        amount: Math.round(over41 * cappedWeeklyPay * 100) / 100,
      });
    }
  }

  const warnings: PackageWarning[] = [];
  if (!estimate.qualifyingServiceMet) {
    warnings.push({
      warningKey: "min_service",
      title: "Less than 2 years' service",
      body: "Under these assumptions, statutory redundancy may be £0. Notice pay and holiday pay can still be modelled if entered.",
      severity: "caution",
    });
  }
  if (pkg.weeklyGrossPay > UK_STATUTORY_REDUNDANCY.weeklyPayCap) {
    warnings.push({
      warningKey: "weekly_cap",
      title: "Weekly pay cap applied",
      body: `Statutory redundancy uses ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}/week cap for redundancies on or after ${UK_STATUTORY_REDUNDANCY.effectiveFrom}.`,
      severity: "info",
    });
  }
  if (pkg.yearsOfService > UK_STATUTORY_REDUNDANCY.maxServiceYears) {
    warnings.push({
      warningKey: "service_cap",
      title: "Service cap applied",
      body: `Only ${UK_STATUTORY_REDUNDANCY.maxServiceYears} years count toward the statutory estimate in this model.`,
      severity: "info",
    });
  }
  if (pkg.enhancedPackage && pkg.enhancedAmount > 0) {
    warnings.push({
      warningKey: "enhanced",
      title: "Enhanced/manual package entered",
      body: "The enhanced figure replaces the statutory redundancy element in the package total used for runway — statutory is shown separately for reference.",
      severity: "info",
    });
  }

  const components: PackageComponentRow[] = [
    {
      itemKey: "statutory_redundancy",
      label: "Statutory redundancy pay",
      amount: estimate.statutoryRedundancy > 0 ? estimate.statutoryRedundancy : null,
      status: estimate.qualifyingServiceMet && pkg.weeklyGrossPay > 0 ? "entered" : "missing",
      explanation: "Estimated statutory redundancy based on age, service and weekly pay assumptions entered.",
      checkNote: "Check this figure against your redundancy letter or HR confirmation.",
      taxLabel: "usually_separate",
    },
    {
      itemKey: "enhanced_redundancy",
      label: "Enhanced redundancy pay",
      amount: pkg.enhancedPackage && pkg.enhancedAmount > 0 ? pkg.enhancedAmount : null,
      status: pkg.enhancedPackage
        ? pkg.enhancedAmount > 0
          ? "entered"
          : "missing"
        : "not_applicable",
      explanation: "Employer-enhanced redundancy assumption entered in the model.",
      taxLabel: "check_treatment",
    },
    {
      itemKey: "notice_pay",
      label: "Notice pay or PILON",
      amount: estimate.noticePay > 0 ? estimate.noticePay : null,
      status: pkg.noticeWeeks > 0 ? (estimate.noticePay > 0 ? "entered" : "missing") : "missing",
      explanation: "Notice period weeks × weekly gross pay as entered. PILON may be modelled here as a notice assumption.",
      checkNote: "Confirm whether notice is worked, paid in lieu, or a separate PILON line on your letter.",
      taxLabel: "may_be_taxable",
    },
    {
      itemKey: "holiday_pay",
      label: "Accrued holiday pay",
      amount: estimate.holidayPay > 0 ? estimate.holidayPay : null,
      status: pkg.holidayWeeks > 0 ? (estimate.holidayPay > 0 ? "entered" : "missing") : "missing",
      explanation: "Untaken holiday weeks × weekly gross pay as entered.",
      taxLabel: "may_be_taxable",
    },
    {
      itemKey: "unpaid_wages",
      label: "Unpaid wages",
      amount: (inputs.unpaidWages ?? 0) > 0 ? inputs.unpaidWages ?? 0 : null,
      status: (inputs.unpaidWages ?? 0) > 0 ? "entered" : "missing",
      explanation: "Final wages owed — included in starting capital if entered.",
      taxLabel: "may_be_taxable",
    },
    {
      itemKey: "voluntary_offer",
      label: "Voluntary redundancy offer",
      amount: (inputs.voluntaryRedundancyAmount ?? 0) > 0 ? inputs.voluntaryRedundancyAmount ?? 0 : null,
      status:
        inputs.context.employmentStatus === "voluntary_redundancy"
          ? (inputs.voluntaryRedundancyAmount ?? 0) > 0
            ? "entered"
            : "missing"
          : "not_applicable",
      explanation: "Voluntary offer amount for comparison — not added to runway unless also entered as package.",
    },
    {
      itemKey: "cash_savings",
      label: "Cash savings (runway)",
      amount: inputs.cashSavings > 0 ? inputs.cashSavings : null,
      status: inputs.cashSavings > 0 ? "entered" : "missing",
      explanation: "Savings used in the runway model alongside the package.",
    },
    {
      itemKey: "liquid_investments",
      label: "Liquid investments (runway)",
      amount: inputs.liquidInvestments > 0 ? inputs.liquidInvestments : null,
      status: inputs.liquidInvestments > 0 ? "entered" : "missing",
      explanation: "Accessible investments included in starting capital.",
    },
  ];

  if (pkg.useManualOverride && pkg.manualOverrideAmount > 0) {
    components.unshift({
      itemKey: "manual_package",
      label: "Manual package total",
      amount: pkg.manualOverrideAmount,
      status: "manual_estimate",
      explanation: "Confirmed employer package total entered as a manual override.",
      checkNote: "Verify this matches your settlement letter or HR confirmation.",
      taxLabel: "included_as_entered",
    });
  }

  const employerOffer =
    pkg.useManualOverride && pkg.manualOverrideAmount > 0
      ? pkg.manualOverrideAmount
      : pkg.enhancedPackage && pkg.enhancedAmount > 0
        ? pkg.enhancedAmount + estimate.noticePay + estimate.holidayPay
        : 0;

  const statutoryEstimate = statutoryOnlyTotal;
  const diff = employerOffer > 0 ? employerOffer - statutoryEstimate : 0;
  const upliftPercent =
    employerOffer > 0 && statutoryEstimate > 0 ? Math.round((diff / statutoryEstimate) * 100) : null;

  let extraRunwayMonths: number | null = null;
  if (employerOffer > 0 && diff !== 0) {
    const vr = computeVoluntaryRedundancyComparison(inputs);
    if (vr) extraRunwayMonths = vr.delta;
    else {
      const slow = brief.scenarios.find((s) => s.scenarioKey === "baseline");
      if (slow) extraRunwayMonths = Math.round((diff / Math.max(baseline.monthlyBurn, 1)) * 10) / 10;
    }
  }

  const severe = brief.scenarios.find((s) => s.scenarioKey === "severe");

  const taxSensitive = components.filter((c) =>
    ["statutory_redundancy", "enhanced_redundancy", "notice_pay", "holiday_pay", "unpaid_wages", "manual_package"].includes(
      c.itemKey,
    ),
  );

  const checklist: PackageDashboardData["checklist"] = [
    {
      itemKey: "statutory",
      label: "Statutory redundancy estimate",
      status: pkg.weeklyGrossPay > 0 ? "entered" : "not_entered",
      whyItMatters: "Forms the baseline package estimate in the model.",
      whereToCheck: "Redundancy letter, HR, GOV.UK guidance",
    },
    {
      itemKey: "enhanced",
      label: "Enhanced redundancy package",
      status: pkg.enhancedPackage ? (pkg.enhancedAmount > 0 ? "entered" : "verify") : "not_applicable",
      whyItMatters: "May replace statutory in the package total used for runway.",
      whereToCheck: "Employer offer letter, settlement agreement",
    },
    {
      itemKey: "notice",
      label: "Notice period or PILON",
      status: pkg.noticeWeeks > 0 ? "entered" : "not_entered",
      whyItMatters: "Often a large part of final pay; treatment may differ from redundancy pay.",
      whereToCheck: "Contract, payslip, HR letter",
    },
    {
      itemKey: "holiday",
      label: "Accrued holiday pay",
      status: pkg.holidayWeeks > 0 ? "entered" : "not_entered",
      whyItMatters: "Untaken holiday may be paid on termination.",
      whereToCheck: "Payslip, HR, leave records",
    },
    {
      itemKey: "wages",
      label: "Unpaid wages",
      status: (inputs.unpaidWages ?? 0) > 0 ? "entered" : "not_entered",
      whyItMatters: "Final payroll items affect starting capital if included.",
      whereToCheck: "Final payslip, HR",
    },
    {
      itemKey: "tax",
      label: "Tax treatment",
      status: "verify",
      whyItMatters: "Components may be treated differently — this model uses gross figures.",
      whereToCheck: "Payroll, HMRC guidance, qualified tax professional",
    },
    {
      itemKey: "payment_date",
      label: "Payment date",
      status: "verify",
      whyItMatters: "Timing affects when cash is available for runway modelling.",
      whereToCheck: "Employer letter, payroll",
    },
    {
      itemKey: "settlement",
      label: "Settlement agreement terms",
      status: pkg.useManualOverride ? "verify" : "not_applicable",
      whyItMatters: "Manual package totals should match signed terms.",
      whereToCheck: "Solicitor, employer HR",
    },
    {
      itemKey: "bonus",
      label: "Bonus or commission",
      status: inputs.otherOneOffIncome > 0 ? "entered" : "not_entered",
      whyItMatters: "Final bonus or commission may form part of leaving pay if owed.",
      whereToCheck: "Contract, payslip, HR letter",
    },
    {
      itemKey: "benefits_end",
      label: "Benefits or allowances ending",
      status: "verify",
      whyItMatters: "Company car, health cover or other benefits may affect monthly pressure after leaving.",
      whereToCheck: "Contract, HR, benefits summary",
    },
    {
      itemKey: "deductions",
      label: "Deductions from package",
      status: "verify",
      whyItMatters: "Loan repayments or other deductions may reduce the net amount received.",
      whereToCheck: "Payslip, settlement letter, payroll",
    },
    {
      itemKey: "pension",
      label: "Pension contributions",
      status: "verify",
      whyItMatters: "Employer pension terms on exit may need separate verification.",
      whereToCheck: "Pension provider, HR, scheme documents",
    },
  ];

  const completenessItems: Array<{ key: string; entered: boolean; applicable: boolean }> = [
    { key: "statutory", entered: pkg.weeklyGrossPay > 0, applicable: true },
    { key: "enhanced", entered: pkg.enhancedPackage && pkg.enhancedAmount > 0, applicable: pkg.enhancedPackage },
    { key: "notice", entered: pkg.noticeWeeks > 0, applicable: true },
    { key: "holiday", entered: pkg.holidayWeeks > 0, applicable: true },
    { key: "wages", entered: (inputs.unpaidWages ?? 0) > 0, applicable: true },
    { key: "bonus", entered: inputs.otherOneOffIncome > 0, applicable: true },
    { key: "manual", entered: pkg.useManualOverride && pkg.manualOverrideAmount > 0, applicable: pkg.useManualOverride },
    { key: "savings", entered: inputs.cashSavings > 0 || inputs.liquidInvestments > 0, applicable: true },
    { key: "income_gap", entered: inputs.replacementMonthlyIncome > 0 || inputs.monthsUntilNewJob > 0, applicable: true },
    { key: "essentials", entered: inputs.mortgageOrRent > 0 || inputs.food > 0, applicable: true },
  ];

  const applicable = completenessItems.filter((i) => i.applicable);
  const enteredCount = applicable.filter((i) => i.entered).length;
  const applicableCount = applicable.length;
  const percent = applicableCount > 0 ? Math.round((enteredCount / applicableCount) * 100) : 0;
  const missingKeys = applicable.filter((i) => !i.entered).map((i) => i.key);

  let band: PackageDashboardData["completeness"]["band"] = "limited";
  let bandLabel = "Limited package detail";
  if (percent >= 90) {
    band = "detailed";
    bandLabel = "Detailed package picture";
  } else if (percent >= 70) {
    band = "strong";
    bandLabel = "Strong package picture";
  } else if (percent >= 40) {
    band = "partial";
    bandLabel = "Partial package picture";
  }

  return {
    estimate,
    packageTotal,
    amountUsedInRunway: packageTotal,
    statutoryOnlyTotal,
    composition,
    components,
    warnings,
    statutoryBands,
    cappedWeeklyPay,
    cappedYears,
    bridge: {
      packageTotal,
      savingsAndInvestments: inputs.cashSavings + inputs.liquidInvestments,
      startingCapital: baseline.startingCapital,
      netMonthlyBurn: baseline.monthlyBurn,
      baselineRunwayMonths: baseline.monthsUntilDepletion,
      severeRunwayMonths: severe?.monthsUntilDepletion ?? brief.severeCaseRunway,
    },
    offerComparison: {
      statutoryEstimate,
      employerOffer,
      difference: diff,
      upliftPercent,
      extraRunwayMonths,
      hasEmployerOffer: employerOffer > 0,
    },
    taxSensitive,
    checklist,
    completeness: {
      percent,
      band,
      bandLabel,
      enteredCount,
      applicableCount,
      missingKeys,
    },
  };
}
