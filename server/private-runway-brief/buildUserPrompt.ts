import type { PrivateRunwayBriefPayload } from "../../client/src/lib/private-runway-brief/types";

function fmt(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}

function fmtMo(n: number) {
  return `${fmt(n)}/mo`;
}

export function buildPrivateRunwayBriefUserPrompt(payload: PrivateRunwayBriefPayload): string {
  const recon = payload.compositionReconciliation;
  const reconNote = recon.reconciles
    ? `Composition reconciles: components sum to ${fmt(recon.componentsSum)} = starting capital ${fmt(recon.startingCapitalTotal)}`
    : `Composition note: components sum ${fmt(recon.componentsSum)} vs starting capital ${fmt(recon.startingCapitalTotal)} — items shown separately are NOT included in starting capital total`;

  return `Generate narrative commentary for a Private Runway Brief. Do NOT include any numbers in your response — all figures are rendered by the frontend.

MODEL CONFIDENCE: ${payload.confidence}
CONFIDENCE DISPLAY: ${payload.confidenceDisplayLabel}
USER REPORTED UNCERTAINTY: ${payload.hasUserReportedUncertainty ? "Yes" : "No"}

CONTEXT:
  Employment situation: ${payload.context.employmentStatus}
  Housing: ${payload.context.housingType}
  Household: ${payload.context.householdStructure}
  Dependents: ${payload.context.hasDependents ? "Yes" : "No"}
  Self-reported confidence: ${payload.context.confidenceLevel}

BASELINE (entered assumptions):
  Runway: ${payload.baseline.monthsUntilDepletion} months
  Starting capital: ${fmt(payload.baseline.startingCapital)}
  Net monthly burn: ${fmtMo(payload.baseline.netMonthlyBurn)} (${payload.netMonthlyBurnHelp})
  Monthly essential costs: ${fmtMo(payload.baseline.essentialExpenses)}
  Monthly flexible costs: ${fmtMo(payload.baseline.nonEssentialExpenses)}
  Income included in model: ${fmtMo(payload.baseline.incomeIncluded)}
  Total expenses: ${fmtMo(payload.baseline.totalExpenses)}
  Stability: ${payload.baseline.stabilityBand} (${payload.baseline.stabilityScore}/100)

SEVERE-CASE RUNWAY: ${payload.severeCaseRunway} months (Zero Income scenario)

REDUNDANCY PACKAGE:
  Statutory estimate: ${fmt(payload.redundancyPackage.statutoryRedundancy)}
  Notice pay: ${fmt(payload.redundancyPackage.noticePay)}
  Holiday pay: ${fmt(payload.redundancyPackage.holidayPay)}
  Enhanced/manual: ${fmt(payload.redundancyPackage.enhancedAmount)}
  Manual override used: ${payload.redundancyPackage.useManualOverride ? `Yes — ${fmt(payload.redundancyPackage.manualOverrideAmount)}` : "No"}
  Total package in model: ${fmt(payload.redundancyPackage.totalPackage)}
  Qualifying service met: ${payload.redundancyPackage.qualifyingServiceMet ? "Yes" : "No"}

PACKAGE COMPONENTS (use itemKey for packageCommentary — no amounts in your response):
${payload.packageComponents.map((c) => `  - itemKey: ${c.itemKey} | ${c.label} [${c.status}]`).join("\n")}

STARTING CAPITAL TOTAL: ${fmt(payload.startingCapitalTotal)}
${reconNote}

COMPOSITION (included in starting capital — use itemKey for comments):
${payload.composition.map((c) => `  - itemKey: ${c.itemKey ?? c.label} | ${c.label}: ${fmt(c.amount)}`).join("\n")}
${payload.compositionReconciliation.shownSeparately.length > 0 ? `\nSHOWN SEPARATELY (not in starting capital):\n${payload.compositionReconciliation.shownSeparately.map((c) => `  - itemKey: ${c.itemKey ?? c.label} | ${c.label}: ${fmt(c.amount)}`).join("\n")}` : ""}

INCOME ASSUMPTIONS:
  Prior monthly net income: ${fmtMo(payload.income.currentMonthlyNetIncome)}
  Replacement income (gap period): ${fmtMo(payload.income.replacementMonthlyIncome)}
  Months until new job: ${payload.income.monthsUntilNewJob}
  Benefits estimate: ${fmtMo(payload.income.benefitSupportEstimate)}
  Partner income included: ${payload.income.includePartnerIncome ? `Yes — ${fmtMo(payload.income.partnerMonthlyNetIncome)}` : "No"}

PRESSURE POINTS (use pointKey for comments):
${payload.pressurePoints.map((p) => `  - pointKey: ${p.pointKey} | ${p.label}: ${p.formattedValue} [${p.severity}]`).join("\n")}

SCENARIOS (use scenarioKey for comments — do NOT contradict whatChanged):
${payload.scenarios
  .map(
    (s) => `  scenarioKey: ${s.id}
    Name: ${s.name}
    Months: ${s.monthsUntilDepletion}
    ${s.jobGapMonths != null ? `Job-gap months: ${s.jobGapMonths}` : ""}
    Description: ${s.description}
    What changed: ${s.whatChanged}`,
  )
  .join("\n")}

SENSITIVITY (use driverKey for comments — pre-ranked, most negative impact first):
${payload.sensitivity
  .map(
    (s) =>
      `  - driverKey: ${s.driverKey} | ${s.factor}: baseline ${s.baseRunway} mo → ${s.adjustedRunway} mo (${s.differenceMonths >= 0 ? "+" : ""}${s.differenceMonths} mo)`,
  )
  .join("\n")}

ASSUMPTION QUALITY:
${payload.assumptionQuality.map((a) => `  - inputKey: ${a.inputKey} | ${a.label}: ${a.status}${a.note ? ` (${a.note})` : ""}`).join("\n")}

STABILITY FACTORS:
${payload.stabilityFactors.map((f) => `  - ${f}`).join("\n")}

WEAK OR MISSING INPUTS:
${payload.weakInputs.length > 0 ? payload.weakInputs.map((w) => `  - ${w.input}: ${w.whyItMatters}`).join("\n") : "  None flagged"}

EXECUTIVE SUMMARY THEMES (use themeKey for qualitativeFindings — report on model logic, no numbers in your response):
${payload.executiveSummaryThemeKeys.map((k) => `  - ${k}`).join("\n")}

Return valid JSON matching the narrative schema now. No numbers in your response.`;
}
