import type { RunwayInputs } from "@shared/schema";
import { ukBenchmarks } from "@/lib/ukBenchmarks";
import { buildBriefDashboardData } from "./buildBriefDashboardData";
import { buildExecutiveSummaryFacts } from "./buildExecutiveSummaryFacts";
import { buildAssumptionQuality } from "./buildAssumptionQuality";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { getSituationType, isAtRiskContext } from "@/lib/position-enhancement/situationContext";
import { getProtectionMeasuresForReport } from "@shared/protectionMeasuresCopy";
import { PRIVATE_RUNWAY_BRIEF_DISCLAIMER } from "./types";
import {
  ASSUMPTION_VERIFY_GUIDES,
  BRIEF_GLOSSARY,
  BRIEF_METHODOLOGY,
  BRIEF_REPORT_VERSION,
  EXECUTIVE_HEADLINE_TEMPLATES,
  PACKAGE_COMPONENT_GUIDES,
  POSITION_PLAYBOOK_INTRO,
  PROFESSIONAL_QUESTION_BANK,
  SCENARIO_READING_GUIDE,
  SIGNPOSTING_LINKS,
  SITUATION_INTROS,
  THEME_FINDING_TEMPLATES,
  THEME_LABELS,
  type BriefSituationType,
} from "@shared/briefCopy";
import {
  BRIEF_SECTION_IDS,
  BRIEF_TOC_DEFINITION,
  type BriefDocument,
  type BriefFinding,
  type BriefNarrativeLite,
  type BriefPackageGuide,
} from "./briefDocumentTypes";
import { validateBriefNarrativeLite } from "@shared/validateBriefNarrative";
import type { PrivateRunwayBriefNarrative } from "./types";
import { RESET_CTA_DEFAULTS } from "./types";

function buildTemplateNarrativeForPanels(
  inputs: RunwayInputs,
  document: BriefDocument,
  dashboard: ReturnType<typeof buildBriefDashboardData>,
): PrivateRunwayBriefNarrative {
  const sensitivitySummary =
    THEME_FINDING_TEMPLATES.sensitivity?.body ??
    "Under the assumptions entered, the sensitivity tests show which inputs move the months-left figure most in this model.";

  return {
    generatedAt: document.generatedAt,
    confidence: document.confidence,
    executiveSummary: {
      headline: document.executive.headline,
      narrativeSummary: document.executive.findings.map((f) => f.body).join(" "),
      qualitativeFindings: document.executive.findings.map((f) => ({
        themeKey: f.themeKey,
        observation: f.body,
      })),
      methodologyInContext: document.executive.methodologyNote,
    },
    runwayRangeCommentary: {
      summary: document.scenarioReadingGuide,
      scenarioComments: dashboard.scenarios.map((s) => ({
        scenarioKey: s.scenarioKey,
        interpretation: `Under the assumptions entered, this scenario uses: ${s.whatChanged}`,
      })),
    },
    packageCommentary: {
      summary: document.package.intro,
      componentComments: document.package.guides.map((g) => ({
        itemKey: g.itemKey,
        explanation: g.body,
      })),
    },
    capitalCompositionCommentary: {
      summary: "Starting capital combines the package and other amounts entered in the model.",
      itemComments: [],
    },
    pressureMapCommentary: {
      summary:
        "Monthly pressure reflects essential and flexible costs minus income included in the model during the gap period.",
      pressurePointComments: dashboard.pressurePoints.map((p) => ({
        pointKey: p.pointKey,
        interpretation: `${p.label} is a ${p.severity} pressure point under the assumptions entered.`,
      })),
    },
    sensitivityCommentary: {
      summary: sensitivitySummary,
      driverComments: dashboard.sensitivity.map((s) => ({
        driverKey: s.driverKey,
        explanation: `Under the assumptions entered, ${s.factor.toLowerCase()} changes baseline months by ${s.differenceMonths >= 0 ? "+" : ""}${s.differenceMonths.toFixed(1)} in this model stress test.`,
      })),
    },
    assumptionsCommentary: {
      confidenceSummary: document.assumptions.confidenceSummary,
      itemsToCheck: document.assumptions.items.map((i) => ({
        inputKey: i.inputKey,
        whyItMatters: i.whyItMatters,
      })),
    },
    professionalQuestions: document.professionalQuestions,
    resetCta: {
      title: RESET_CTA_DEFAULTS.title,
      body: RESET_CTA_DEFAULTS.body,
    },
    disclaimer: document.disclaimer,
  };
}

export { buildTemplateNarrativeForPanels };

function mapSituationType(inputs: RunwayInputs): BriefSituationType {
  return getSituationType(inputs.context.employmentStatus) as BriefSituationType;
}

function rankThemeKeys(
  inputs: RunwayInputs,
  dashboard: ReturnType<typeof buildBriefDashboardData>,
  positionData: ReturnType<typeof buildPositionEnhancementData>,
): string[] {
  const themes: string[] = [];
  const packageData = buildPackageDashboardData(inputs);
  const housingPct = dashboard.baseline.housingPercentOfEssentials;
  const baselineMonths = dashboard.baseline.monthsUntilDepletion;
  const severeMonths = dashboard.severeCaseRunway;
  const spread = baselineMonths - severeMonths;

  if (
    positionData.briefSummary.missingMoneyKeys.length > 0 ||
    positionData.briefSummary.topClarificationAreas.length > 0 ||
    packageData.completeness.percent < 85
  ) {
    themes.push("package_clarity");
  }

  if (housingPct >= ukBenchmarks.housingBurden.stressReferenceThresholdPercent) {
    themes.push("housing_pressure");
  }

  if (spread >= 2) {
    themes.push("scenario_spread");
  }

  if (dashboard.baseline.netMonthlyBurn > 0) {
    themes.push("monthly_pressure");
  }

  const topSens = dashboard.sensitivity[0];
  if (topSens && Math.abs(topSens.differenceMonths) >= 1) {
    themes.push("sensitivity");
  }

  const assumptionQuality = buildAssumptionQuality(inputs);
  if (assumptionQuality.some((a) => a.status === "missing" || a.status === "uncertain")) {
    themes.push("data_quality");
  }

  themes.push("starting_capital", "runway_duration");

  if (
    inputs.replacementMonthlyIncome > 0 ||
    inputs.benefitSupportEstimate > 0 ||
    inputs.includePartnerIncome
  ) {
    themes.push("income_assumptions");
  }

  const seen = new Set<string>();
  return themes.filter((t) => {
    if (seen.has(t)) return false;
    seen.add(t);
    return Boolean(THEME_FINDING_TEMPLATES[t]);
  });
}

function pickExecutiveHeadline(
  focusTheme: string,
  situationType: BriefSituationType,
): string {
  if (situationType === "at_risk" && focusTheme === "package_clarity") {
    return EXECUTIVE_HEADLINE_TEMPLATES.at_risk_consultation;
  }
  if (situationType === "post_redundancy" && focusTheme === "package_clarity") {
    return EXECUTIVE_HEADLINE_TEMPLATES.post_redundancy_package;
  }
  return EXECUTIVE_HEADLINE_TEMPLATES[focusTheme] ?? EXECUTIVE_HEADLINE_TEMPLATES.default;
}

function buildTemplateFindings(themeKeys: string[]): BriefFinding[] {
  const findings: BriefFinding[] = [];
  for (const themeKey of themeKeys.slice(0, 5)) {
    const template = THEME_FINDING_TEMPLATES[themeKey];
    if (!template) continue;
    findings.push({
      themeKey,
      title: template.title,
      body: template.body,
      source: "template",
    });
  }
  return findings;
}

function mergeAiFindings(
  templateFindings: BriefFinding[],
  lite?: BriefNarrativeLite,
): BriefFinding[] {
  if (!lite?.executiveObservations?.length) return templateFindings.slice(0, 3);

  const validation = validateBriefNarrativeLite(lite);
  if (!validation.ok) return templateFindings.slice(0, 3);

  const byKey = new Map(templateFindings.map((f) => [f.themeKey, f]));
  const merged: BriefFinding[] = [];

  for (const obs of lite.executiveObservations.slice(0, 3)) {
    const base = byKey.get(obs.themeKey);
    merged.push({
      themeKey: obs.themeKey,
      title: base?.title ?? THEME_LABELS[obs.themeKey] ?? obs.themeKey.replace(/_/g, " "),
      body: obs.observation,
      source: "ai",
    });
  }

  for (const f of templateFindings) {
    if (merged.length >= 5) break;
    if (!merged.some((m) => m.themeKey === f.themeKey)) merged.push(f);
  }

  return merged.slice(0, 5);
}

function buildPackageGuides(
  inputs: RunwayInputs,
  positionData: ReturnType<typeof buildPositionEnhancementData>,
): BriefPackageGuide[] {
  const keys = new Set<string>([
    "statutory_redundancy",
    "notice_pay",
    "holiday_pay",
  ]);

  if (inputs.redundancyPackage.enhancedAmount > 0 || inputs.redundancyPackage.useManualOverride) {
    keys.add("enhanced_redundancy");
  }
  if ((inputs.unpaidWages ?? 0) > 0 || positionData.missingMoney.some((m) => m.itemKey === "wages")) {
    keys.add("unpaid_wages");
  }

  const guides: BriefPackageGuide[] = [];
  for (const itemKey of Array.from(keys)) {
    const guide = PACKAGE_COMPONENT_GUIDES[itemKey];
    if (!guide) continue;
    guides.push({
      itemKey,
      title: guide.title,
      body: guide.body,
      whenRelevant: guide.whenRelevant,
      applies: true,
    });
  }
  return guides;
}

function buildProfessionalQuestions(inputs: RunwayInputs): BriefDocument["professionalQuestions"] {
  const hasMortgage =
    inputs.mortgageOrRent > 0 ||
    inputs.context.housingType === "mortgage" ||
    inputs.context.housingType === "renting";
  const hasDependents = inputs.context.hasDependents;
  const atRisk = isAtRiskContext(inputs.context.employmentStatus);

  return {
    hrPackage: [...PROFESSIONAL_QUESTION_BANK.hrPackage],
    financialAdviser: [...PROFESSIONAL_QUESTION_BANK.financialAdviser],
    mortgageBroker: hasMortgage ? [...PROFESSIONAL_QUESTION_BANK.mortgageBroker] : [],
    employerOrCareer: atRisk
      ? [
          ...PROFESSIONAL_QUESTION_BANK.employerOrCareer,
          "What selection criteria apply to my role and how can I request clarity on scoring?",
        ]
      : [...PROFESSIONAL_QUESTION_BANK.employerOrCareer],
    benefitsSignposting:
      hasDependents || inputs.benefitSupportEstimate > 0
        ? [...PROFESSIONAL_QUESTION_BANK.benefitsSignposting]
        : PROFESSIONAL_QUESTION_BANK.benefitsSignposting.slice(0, 2),
  };
}

function buildAssumptionItems(inputs: RunwayInputs): BriefDocument["assumptions"]["items"] {
  const quality = buildAssumptionQuality(inputs);
  return quality
    .filter((q) => q.status !== "complete")
    .slice(0, 6)
    .map((q) => ({
      inputKey: q.inputKey,
      label: q.label,
      status: q.status,
      whyItMatters:
        ASSUMPTION_VERIFY_GUIDES[q.inputKey] ??
        q.note ??
        "Verifying this input helps confirm the model reflects your situation.",
    }));
}

export function buildBriefDocument(
  inputs: RunwayInputs,
  options?: {
    narrativeLite?: BriefNarrativeLite;
    generatedAt?: string;
  },
): BriefDocument {
  const dashboard = buildBriefDashboardData(inputs);
  const facts = buildExecutiveSummaryFacts(dashboard);
  const positionData = buildPositionEnhancementData(inputs);
  const situationType = mapSituationType(inputs);
  const protectionPillarCount = getProtectionMeasuresForReport(
    situationType,
    inputs.context.employmentStatus,
  ).length;
  const themeKeys = rankThemeKeys(inputs, dashboard, positionData);
  const focusThemeKey = themeKeys[0] ?? "runway_duration";

  let headline = pickExecutiveHeadline(focusThemeKey, situationType);
  let headlineSource: BriefFinding["source"] = "template";
  let aiEnhanced = false;

  const lite = options?.narrativeLite;
  if (lite?.executiveHeadline) {
    const validation = validateBriefNarrativeLite(lite);
    if (validation.ok) {
      headline = lite.executiveHeadline;
      headlineSource = "ai";
      aiEnhanced = true;
    }
  }

  const templateFindings = buildTemplateFindings(themeKeys);
  const findings = mergeAiFindings(templateFindings, aiEnhanced ? lite : undefined);

  const toc = [
    { id: BRIEF_SECTION_IDS.executive, ...BRIEF_TOC_DEFINITION[0] },
    { id: BRIEF_SECTION_IDS.package, ...BRIEF_TOC_DEFINITION[1] },
    { id: BRIEF_SECTION_IDS.months, ...BRIEF_TOC_DEFINITION[2] },
    { id: BRIEF_SECTION_IDS.position, ...BRIEF_TOC_DEFINITION[3] },
    { id: BRIEF_SECTION_IDS.sensitivity, ...BRIEF_TOC_DEFINITION[4] },
    { id: BRIEF_SECTION_IDS.assumptions, ...BRIEF_TOC_DEFINITION[5] },
    { id: BRIEF_SECTION_IDS.questions, ...BRIEF_TOC_DEFINITION[6] },
    { id: BRIEF_SECTION_IDS.appendix, ...BRIEF_TOC_DEFINITION[7] },
  ];

  return {
    version: BRIEF_REPORT_VERSION,
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    situationType,
    situationIntro: SITUATION_INTROS[situationType],
    confidence: dashboard.confidence,
    confidenceDisplayLabel: dashboard.confidenceDisplayLabel,
    toc,
    executive: {
      headline,
      headlineSource,
      focusThemeKey,
      focusLabel: THEME_LABELS[focusThemeKey] ?? focusThemeKey,
      situationIntro: SITUATION_INTROS[situationType],
      findings,
      methodologyNote: facts.methodologyNote,
    },
    package: {
      intro:
        "Section 2 shows your package breakdown from the assumptions entered, plus standard UK guidance on what each component usually means and what to verify.",
      guides: buildPackageGuides(inputs, positionData),
    },
    position: {
      packageIntro: POSITION_PLAYBOOK_INTRO.package,
      consultationIntro: POSITION_PLAYBOOK_INTRO.consultation,
      scenariosIntro: POSITION_PLAYBOOK_INTRO.scenarios,
      showConsultation: situationType === "at_risk",
      protectionPillarCount,
    },
    assumptions: {
      confidenceSummary: `Assumption quality: ${dashboard.confidenceDisplayLabel}. ${dashboard.confidence === "High" ? "Core inputs are populated for modelling." : "Some inputs are partial or uncertain — verify flagged items below."}`,
      items: buildAssumptionItems(inputs),
    },
    professionalQuestions: buildProfessionalQuestions(inputs),
    methodology: BRIEF_METHODOLOGY,
    glossary: BRIEF_GLOSSARY,
    signposting: SIGNPOSTING_LINKS,
    scenarioReadingGuide: SCENARIO_READING_GUIDE,
    disclaimer: PRIVATE_RUNWAY_BRIEF_DISCLAIMER,
    aiEnhanced,
  };
}

/** Map legacy full narrative to lite overlay (executive only). */
export function legacyNarrativeToLite(narrative: {
  executiveSummary: {
    headline: string;
    qualitativeFindings: Array<{ themeKey: string; observation: string }>;
  };
  generatedAt: string;
}): BriefNarrativeLite {
  return {
    executiveHeadline: narrative.executiveSummary.headline,
    executiveObservations: narrative.executiveSummary.qualitativeFindings.slice(0, 3),
    generatedAt: narrative.generatedAt,
    aiEnhanced: true,
  };
}
