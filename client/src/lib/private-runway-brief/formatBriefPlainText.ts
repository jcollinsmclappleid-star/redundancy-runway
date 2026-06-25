import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "./types";
import { buildBriefDashboardData } from "./buildBriefDashboardData";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildExecutiveSummaryFacts } from "./buildExecutiveSummaryFacts";
import { formatGBP, formatMonths } from "@/lib/engine";
import { RESET_CTA_DEFAULTS } from "./types";
import { RUNWAY_BRIEF_NAME, RUNWAY_REPORT_FULL, SITE_NAME } from "@shared/product";

function getExecutiveSummary(narrative: PrivateRunwayBriefNarrative) {
  if (narrative.executiveSummary) return narrative.executiveSummary;
  if (narrative.overview) {
    return {
      headline: narrative.overview.headline,
      narrativeSummary: narrative.overview.summary,
      qualitativeFindings: [],
      methodologyInContext: "",
    };
  }
  return null;
}

export function formatBriefPlainText(inputs: RunwayInputs, narrative: PrivateRunwayBriefNarrative): string {
  const dashboard = buildBriefDashboardData(inputs);
  const packageData = buildPackageDashboardData(inputs);
  const facts = buildExecutiveSummaryFacts(dashboard);
  const exec = getExecutiveSummary(narrative);
  const packageCommentary = narrative.packageCommentary ?? {
    summary: narrative.capitalCompositionCommentary.summary,
    componentComments: narrative.capitalCompositionCommentary.itemComments,
  };

  const lines: string[] = [
    `${RUNWAY_BRIEF_NAME.toUpperCase()} — ${SITE_NAME}`,
    `${RUNWAY_REPORT_FULL}`,
    "====================",
    `Generated: ${new Date(narrative.generatedAt).toLocaleString("en-GB")}`,
    `Confidence: ${dashboard.confidenceDisplayLabel}`,
    "",
    "PACKAGE ESTIMATE",
    packageCommentary.summary,
    `  Estimated statutory: ${formatGBP(packageData.estimate.statutoryRedundancy)}`,
    `  Notice pay: ${formatGBP(packageData.estimate.noticePay)}`,
    `  Holiday pay: ${formatGBP(packageData.estimate.holidayPay)}`,
    `  Total package in model: ${formatGBP(packageData.packageTotal)}`,
    `  Package completeness: ${packageData.completeness.percent}% (${packageData.completeness.bandLabel})`,
    "",
    ...packageData.components.map((c) => {
      const comment = packageCommentary.componentComments.find((x) => x.itemKey === c.itemKey);
      return `  ${c.label}${c.amount != null && c.amount > 0 ? `: ${formatGBP(c.amount)}` : ""}${comment ? ` — ${comment.explanation}` : ""}`;
    }),
    "",
    "AT A GLANCE",
    `  Baseline runway: ${formatMonths(dashboard.baseline.monthsUntilDepletion)}`,
    `  Severe-case runway: ${formatMonths(dashboard.severeCaseRunway)}`,
    `  Starting capital: ${formatGBP(dashboard.baseline.startingCapital)}`,
    `  Net monthly burn: ${formatGBP(dashboard.baseline.netMonthlyBurn)}`,
    `  Housing pressure: ${dashboard.baseline.housingPercentOfEssentials}% of essentials`,
    "",
  ];

  if (exec) {
    lines.push(
      "EXECUTIVE SUMMARY",
      exec.headline,
      exec.narrativeSummary,
      "",
      "QUALITATIVE FINDINGS",
      ...exec.qualitativeFindings.map((f) => `  [${f.themeKey}] ${f.observation}`),
      "",
      "HOW YOUR FIGURES WERE USED",
      `  ${facts.modelCalculated.title}: ${facts.modelCalculated.body}`,
      `  ${facts.startingCapitalLogic.title}: ${facts.startingCapitalLogic.body}`,
      `  ${facts.monthlyPressureLogic.title}: ${facts.monthlyPressureLogic.body}`,
      "",
    );
    if (exec.methodologyInContext) {
      lines.push("METHODOLOGY IN CONTEXT", exec.methodologyInContext, "");
    }
  }

  lines.push(
    "RUNWAY RANGE",
    narrative.runwayRangeCommentary.summary,
    "",
    ...dashboard.scenarios.flatMap((s) => {
      const comment = narrative.runwayRangeCommentary.scenarioComments.find(
        (c) => c.scenarioKey === s.scenarioKey,
      );
      return [
        `  ${s.name}: ${formatMonths(s.monthsUntilDepletion)}`,
        `    ${s.whatChanged}`,
        comment ? `    ${comment.interpretation}` : "",
        "",
      ];
    }),
    "CAPITAL COMPOSITION",
    narrative.capitalCompositionCommentary.summary,
    `  Starting capital used in model: ${formatGBP(dashboard.composition.startingCapitalTotal)}`,
    "",
    ...dashboard.composition.includedInStartingCapital.map((i) => {
      const comment = narrative.capitalCompositionCommentary.itemComments.find(
        (c) => c.itemKey === i.itemKey,
      );
      return `  ${i.label}: ${formatGBP(i.amount)}${comment ? ` — ${comment.explanation}` : ""}`;
    }),
    "",
    "MONTHLY PRESSURE MAP",
    narrative.pressureMapCommentary.summary,
    "",
    ...dashboard.pressurePoints.map((p) => {
      const comment = narrative.pressureMapCommentary.pressurePointComments.find(
        (c) => c.pointKey === p.pointKey,
      );
      return `  ${p.label}: ${p.formattedValue}${comment ? ` — ${comment.interpretation}` : ""}`;
    }),
    "",
    "SENSITIVITY DRIVERS",
    narrative.sensitivityCommentary.summary,
    "",
    ...dashboard.sensitivity.map((s, i) => {
      const comment = narrative.sensitivityCommentary.driverComments.find(
        (c) => c.driverKey === s.driverKey,
      );
      return `  ${i + 1}. ${s.factor}: ${formatMonths(s.baseRunway)} → ${formatMonths(s.adjustedRunway)} (${s.differenceMonths >= 0 ? "+" : ""}${s.differenceMonths} mo)${comment ? ` — ${comment.explanation}` : ""}`;
    }),
    "",
    "ASSUMPTION QUALITY",
    narrative.assumptionsCommentary.confidenceSummary,
    "",
    ...dashboard.assumptionQuality.map((a) => `  [${a.status}] ${a.label}`),
    ...narrative.assumptionsCommentary.itemsToCheck.map((m) => `  • ${m.inputKey}: ${m.whyItMatters}`),
    "",
    "QUESTIONS TO TAKE FORWARD",
    "",
    "Financial adviser:",
    ...narrative.professionalQuestions.financialAdviser.map((q) => `  • ${q}`),
    "",
    "Mortgage broker:",
    ...(narrative.professionalQuestions.mortgageBroker.length > 0
      ? narrative.professionalQuestions.mortgageBroker.map((q) => `  • ${q}`)
      : ["  (Not applicable under your assumptions)"]),
    "",
    "Employer / career:",
    ...narrative.professionalQuestions.employerOrCareer.map((q) => `  • ${q}`),
    "",
    "Benefits signposting:",
    ...narrative.professionalQuestions.benefitsSignposting.map((q) => `  • ${q}`),
    "",
    narrative.resetCta.title || RESET_CTA_DEFAULTS.title,
    narrative.resetCta.body || RESET_CTA_DEFAULTS.body,
    "",
    narrative.disclaimer,
  );

  return lines.join("\n");
}

export function fingerprintInputs(inputs: unknown): string {
  const str = JSON.stringify(inputs);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
