import type { RunwayInputs } from "@shared/schema";
import { computeRunway } from "@/lib/engine";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildSevereCaseInputs } from "@/lib/runwayAssumptions";
import { buildPositionEnhancementData } from "./buildPositionEnhancementData";

export type StackSegmentStatus = "confirmed" | "estimated" | "unmodelled" | "savings";

export interface MaximiserStackSegment {
  itemKey: string;
  label: string;
  amount: number;
  status: StackSegmentStatus;
  shareOfPackage: number;
}

export interface MaximiserOpportunity {
  itemKey: string;
  label: string;
  rank: number;
  packageUplift: number | null;
  runwayUpliftMonths: number | null;
  startingCapitalUplift: number | null;
  summary: string;
  detail: string;
}

export interface MaximiserScenarioStep {
  scenarioKey: string;
  label: string;
  packageTotal: number;
  baselineRunwayMonths: number;
  deltaPackageVsCurrent: number;
  deltaRunwayVsCurrent: number;
}

export interface MaximiserInsights {
  currentPackageTotal: number;
  currentRunwayMonths: number;
  startingCapital: number;
  statutoryOnlyTotal: number;
  statutoryRunwayMonths: number;
  runwayProtectedVsStatutory: number;
  packageAboveStatutory: number;
  bestCasePackageTotal: number | null;
  bestCaseRunwayMonths: number | null;
  totalPotentialPackageUplift: number | null;
  totalPotentialRunwayUplift: number | null;
  employerOfferDelta: number | null;
  employerRunwayDelta: number | null;
  completenessPercent: number;
  completenessLabel: string;
  stackSegments: MaximiserStackSegment[];
  rankedOpportunities: MaximiserOpportunity[];
  scenarioLadder: MaximiserScenarioStep[];
  headline: string;
  subheadline: string;
}

function runwayWithPackageTotal(
  inputs: RunwayInputs,
  packageTotal: number,
): { startingCapital: number; baselineRunwayMonths: number } {
  const scenarioInputs: RunwayInputs = {
    ...inputs,
    redundancyPackage: {
      ...inputs.redundancyPackage,
      useManualOverride: true,
      manualOverrideAmount: packageTotal,
    },
  };
  const baseline = computeRunway(scenarioInputs);
  return {
    startingCapital: baseline.startingCapital,
    baselineRunwayMonths: baseline.monthsUntilDepletion,
  };
}

function buildStackSegments(
  pkgData: ReturnType<typeof buildPackageDashboardData>,
): MaximiserStackSegment[] {
  const packageKeys = new Set([
    "statutory_redundancy",
    "enhanced_redundancy",
    "manual_package",
    "notice_pay",
    "holiday_pay",
    "unpaid_wages",
  ]);

  const segments: MaximiserStackSegment[] = [];
  let packageSum = 0;

  for (const c of pkgData.components) {
    if (!packageKeys.has(c.itemKey)) continue;
    const amount = c.amount ?? 0;
    if (amount <= 0 && c.status === "missing") continue;

    let status: StackSegmentStatus = "unmodelled";
    if (c.status === "entered") status = "confirmed";
    else if (c.status === "manual_estimate") status = "estimated";
    else if (amount > 0) status = "estimated";

    if (amount > 0) {
      packageSum += amount;
      segments.push({
        itemKey: c.itemKey,
        label: c.label,
        amount,
        status,
        shareOfPackage: 0,
      });
    }
  }

  const savings = inputsSavings(pkgData);
  if (savings > 0) {
    segments.push({
      itemKey: "savings",
      label: "Cash & liquid investments",
      amount: savings,
      status: "savings",
      shareOfPackage: 0,
    });
  }

  const totalForShare = Math.max(pkgData.packageTotal + savings, 1);
  return segments.map((s) => ({
    ...s,
    shareOfPackage: Math.round((s.amount / totalForShare) * 100),
  }));
}

function inputsSavings(pkgData: ReturnType<typeof buildPackageDashboardData>): number {
  const cash = pkgData.components.find((c) => c.itemKey === "cash_savings")?.amount ?? 0;
  const liquid = pkgData.components.find((c) => c.itemKey === "liquid_investments")?.amount ?? 0;
  return cash + liquid;
}

function buildRankedOpportunities(
  inputs: RunwayInputs,
  pkgData: ReturnType<typeof buildPackageDashboardData>,
  positionData: ReturnType<typeof buildPositionEnhancementData>,
  currentTotal: number,
  currentRunway: number,
): MaximiserOpportunity[] {
  const raw: Omit<MaximiserOpportunity, "rank">[] = [];

  for (const row of positionData.payoutScenarios) {
    if (row.scenarioKey === "current_entered") continue;
    const deltaPkg = row.packageTotal - currentTotal;
    const deltaRunway = row.baselineRunwayMonths - currentRunway;
    if (deltaPkg <= 0 && deltaRunway <= 0) continue;

    raw.push({
      itemKey: row.scenarioKey,
      label: row.label,
      packageUplift: deltaPkg > 0 ? deltaPkg : null,
      runwayUpliftMonths: deltaRunway > 0 ? Math.round(deltaRunway * 10) / 10 : null,
      startingCapitalUplift: row.startingCapital - runwayWithPackageTotal(inputs, currentTotal).startingCapital,
      summary: `If your package matched "${row.label}", the model shows a higher total and longer baseline runway.`,
      detail: `Under this scenario, package total is modelled at the ladder figure and flows through to starting capital and months on household costs.`,
    });
  }

  for (const item of [
    ...positionData.maximiser.couldIncreaseTotal,
    ...positionData.maximiser.highValueToClarify,
  ]) {
    if (raw.some((r) => r.itemKey === item.itemKey)) continue;
    if (item.itemKey === "employer_offer") continue;

    const component = pkgData.components.find((c) => c.itemKey === item.itemKey);
    const estAmount = component?.amount ?? item.amount;
    const alreadyIncluded = component?.status === "entered" || component?.status === "manual_estimate";
    if (alreadyIncluded) continue;

    if (estAmount != null && estAmount > 0 && !alreadyIncluded) {
      const upliftRunway = runwayWithPackageTotal(inputs, currentTotal + estAmount);
      const deltaRunway = upliftRunway.baselineRunwayMonths - currentRunway;
      raw.push({
        itemKey: item.itemKey,
        label: item.label,
        packageUplift: estAmount,
        runwayUpliftMonths: deltaRunway > 0 ? Math.round(deltaRunway * 10) / 10 : null,
        startingCapitalUplift: upliftRunway.startingCapital - runwayWithPackageTotal(inputs, currentTotal).startingCapital,
        summary: `Confirming ${item.label.toLowerCase()} could add an estimated amount to the package picture in this model.`,
        detail: item.message,
      });
    } else {
      raw.push({
        itemKey: item.itemKey,
        label: item.label,
        packageUplift: null,
        runwayUpliftMonths: null,
        startingCapitalUplift: null,
        summary: `${item.label} is not yet modelled — entering figures would show the runway impact here.`,
        detail: item.message,
      });
    }
  }

  if (pkgData.offerComparison.hasEmployerOffer && pkgData.offerComparison.difference > 0) {
    raw.push({
      itemKey: "employer_vs_statutory",
      label: "Employer package vs statutory estimate",
      packageUplift: pkgData.offerComparison.difference,
      runwayUpliftMonths: pkgData.offerComparison.extraRunwayMonths,
      startingCapitalUplift: pkgData.offerComparison.difference,
      summary: "Your employer or manual package is above the statutory-only estimate in this model.",
      detail: "A written breakdown helps confirm how much is statutory, enhanced, notice and holiday pay.",
    });
  }

  raw.sort((a, b) => {
    const aScore = (a.runwayUpliftMonths ?? 0) * 1000 + (a.packageUplift ?? 0);
    const bScore = (b.runwayUpliftMonths ?? 0) * 1000 + (b.packageUplift ?? 0);
    return bScore - aScore;
  });

  return raw.map((item, index) => ({ ...item, rank: index + 1 }));
}

export function buildMaximiserInsights(inputs: RunwayInputs): MaximiserInsights {
  const pkgData = buildPackageDashboardData(inputs);
  const positionData = buildPositionEnhancementData(inputs);
  const currentTotal = pkgData.packageTotal;
  const currentRunway = pkgData.bridge.baselineRunwayMonths;
  const statutoryRunway = runwayWithPackageTotal(inputs, pkgData.statutoryOnlyTotal).baselineRunwayMonths;

  const scenarioLadder: MaximiserScenarioStep[] = positionData.payoutScenarios.map((row) => ({
    scenarioKey: row.scenarioKey,
    label: row.label,
    packageTotal: row.packageTotal,
    baselineRunwayMonths: row.baselineRunwayMonths,
    deltaPackageVsCurrent: row.packageTotal - currentTotal,
    deltaRunwayVsCurrent: row.baselineRunwayMonths - currentRunway,
  }));

  const aboveCurrent = scenarioLadder.filter(
    (s) => s.scenarioKey !== "current_entered" && s.packageTotal > currentTotal,
  );
  const bestCase = aboveCurrent.length > 0 ? aboveCurrent[aboveCurrent.length - 1] : null;

  const runwayProtectedVsStatutory = Math.round((currentRunway - statutoryRunway) * 10) / 10;
  const packageAboveStatutory = currentTotal - pkgData.statutoryOnlyTotal;

  const rankedOpportunities = buildRankedOpportunities(
    inputs,
    pkgData,
    positionData,
    currentTotal,
    currentRunway,
  );

  const topOpportunity = rankedOpportunities[0];
  const totalPotentialPackageUplift = bestCase ? bestCase.deltaPackageVsCurrent : null;
  const totalPotentialRunwayUplift = bestCase ? bestCase.deltaRunwayVsCurrent : null;

  const statutoryOnlyRow = scenarioLadder.find((s) => s.scenarioKey === "statutory_only");
  const monthsVsStatutoryOnly =
    statutoryOnlyRow && statutoryOnlyRow.deltaRunwayVsCurrent < 0
      ? Math.abs(statutoryOnlyRow.deltaRunwayVsCurrent)
      : null;

  let headline: string;
  let subheadline: string;

  if (monthsVsStatutoryOnly != null && monthsVsStatutoryOnly >= 1) {
    headline = `Your package is worth ${monthsVsStatutoryOnly} months more than statutory redundancy alone`;
    subheadline = `In this model, notice, holiday and enhanced pay lift baseline runway from ${statutoryOnlyRow!.baselineRunwayMonths} to ${currentRunway} months — verify each line with HR.`;
  } else if (topOpportunity?.packageUplift != null && topOpportunity.packageUplift > 0) {
    headline = `Top opportunity: ${topOpportunity.label}`;
    subheadline =
      topOpportunity.runwayUpliftMonths != null && topOpportunity.runwayUpliftMonths > 0
        ? `Under this model, this area could add ${topOpportunity.packageUplift.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })} and up to ${topOpportunity.runwayUpliftMonths} months baseline runway.`
        : `Under this model, this area could add ${topOpportunity.packageUplift.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })} to the package picture.`;
  } else if (runwayProtectedVsStatutory > 0 && packageAboveStatutory > 0) {
    headline = `Your package is worth ${runwayProtectedVsStatutory} months more than statutory-only in this model`;
    subheadline = `Enhanced pay, notice and holiday in your assumptions add ${packageAboveStatutory.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })} above a statutory-only baseline — verify the breakdown with HR.`;
  } else if (pkgData.offerComparison.hasEmployerOffer && pkgData.offerComparison.difference > 0) {
    headline = "Your package is above statutory-only in this model";
    subheadline = "Use the breakdown below to see how each component feeds starting capital and months on household costs.";
  } else if (rankedOpportunities.length > 0) {
    headline = `${rankedOpportunities.length} area${rankedOpportunities.length === 1 ? "" : "s"} to strengthen your package picture`;
    subheadline = "Ranked by modelled runway impact — preparation support, not a prediction of what you will receive.";
  } else {
    headline = "Core package components are mapped in your model";
    subheadline = "Review verification items below before relying on the headline figure in conversations.";
  }

  return {
    currentPackageTotal: currentTotal,
    currentRunwayMonths: currentRunway,
    startingCapital: pkgData.bridge.startingCapital,
    statutoryOnlyTotal: pkgData.statutoryOnlyTotal,
    statutoryRunwayMonths: statutoryRunway,
    runwayProtectedVsStatutory,
    packageAboveStatutory,
    bestCasePackageTotal: bestCase?.packageTotal ?? null,
    bestCaseRunwayMonths: bestCase?.baselineRunwayMonths ?? null,
    totalPotentialPackageUplift,
    totalPotentialRunwayUplift,
    employerOfferDelta: pkgData.offerComparison.hasEmployerOffer ? pkgData.offerComparison.difference : null,
    employerRunwayDelta: pkgData.offerComparison.extraRunwayMonths,
    completenessPercent: pkgData.completeness.percent,
    completenessLabel: pkgData.completeness.bandLabel,
    stackSegments: buildStackSegments(pkgData),
    rankedOpportunities,
    scenarioLadder,
    headline,
    subheadline,
  };
}

/** Severe runway for a package total — used in UI comparisons */
export function maximiserSevereRunwayMonths(inputs: RunwayInputs, packageTotal: number): number {
  const scenarioInputs: RunwayInputs = {
    ...inputs,
    redundancyPackage: {
      ...inputs.redundancyPackage,
      useManualOverride: true,
      manualOverrideAmount: packageTotal,
    },
  };
  return computeRunway(buildSevereCaseInputs(scenarioInputs).inputs).monthsUntilDepletion;
}
