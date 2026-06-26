import type { BriefSituationType } from "@shared/briefCopy";

export type BriefContentSource = "engine" | "template" | "ai";

export interface BriefTocItem {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
}

export interface BriefFinding {
  themeKey: string;
  title: string;
  body: string;
  source: BriefContentSource;
}

export interface BriefPackageGuide {
  itemKey: string;
  title: string;
  body: string;
  whenRelevant: string;
  applies: boolean;
}

export interface BriefAssumptionItem {
  inputKey: string;
  label: string;
  status: string;
  whyItMatters: string;
}

export interface BriefProfessionalQuestions {
  hrPackage: string[];
  financialAdviser: string[];
  mortgageBroker: string[];
  employerOrCareer: string[];
  benefitsSignposting: string[];
}

/** Optional AI overlay — executive only (lite mode). */
export interface BriefNarrativeLite {
  executiveHeadline?: string;
  executiveObservations?: Array<{
    themeKey: string;
    observation: string;
  }>;
  generatedAt?: string;
  aiEnhanced?: boolean;
}

export interface BriefDocument {
  version: string;
  generatedAt: string;
  situationType: BriefSituationType;
  situationIntro: string;
  confidence: "High" | "Medium" | "Low";
  confidenceDisplayLabel: string;
  toc: BriefTocItem[];
  executive: {
    headline: string;
    headlineSource: BriefContentSource;
    focusThemeKey: string;
    focusLabel: string;
    situationIntro: string;
    findings: BriefFinding[];
    methodologyNote: string;
  };
  package: {
    intro: string;
    guides: BriefPackageGuide[];
  };
  position: {
    packageIntro: string;
    consultationIntro: string;
    scenariosIntro: string;
    showConsultation: boolean;
    protectionPillarCount: number;
  };
  assumptions: {
    confidenceSummary: string;
    items: BriefAssumptionItem[];
  };
  professionalQuestions: BriefProfessionalQuestions;
  methodology: string;
  glossary: Array<{ term: string; definition: string }>;
  signposting: Array<{ label: string; url: string }>;
  scenarioReadingGuide: string;
  disclaimer: string;
  aiEnhanced: boolean;
}

export const BRIEF_TOC_DEFINITION: Omit<BriefTocItem, "id">[] = [
  { number: "1", title: "Executive summary", subtitle: "Key findings from your assumptions" },
  { number: "2", title: "Your redundancy package", subtitle: "Redundancy Pay Maximiser, breakdown and guidance" },
  { number: "3", title: "How long the money may last", subtitle: "Months on household costs and path" },
  { number: "4", title: "Improve your position", subtitle: "Protection measures, verification and preparation playbooks" },
  { number: "5", title: "Scenarios and sensitivities", subtitle: "What changes the picture" },
  { number: "6", title: "Assumptions to verify", subtitle: "Data quality and gaps" },
  { number: "7", title: "Questions to take forward", subtitle: "Documents, HR questions and professional signposting" },
  { number: "A", title: "Methodology and glossary", subtitle: "How this report is built" },
];

export const BRIEF_SECTION_IDS = {
  executive: "brief-exec",
  package: "brief-package",
  months: "brief-months",
  position: "brief-position",
  sensitivity: "brief-sensitivity",
  assumptions: "brief-assumptions",
  questions: "brief-questions",
  appendix: "brief-appendix",
} as const;
