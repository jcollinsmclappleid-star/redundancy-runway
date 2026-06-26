import type { AiCtaPreset } from "@shared/aiRedundancySeo";

export interface AiResearchStat {
  value: string;
  label: string;
}

export interface AiResearchSource {
  label: string;
  url: string;
}

export interface AiSeoSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  /** Optional stat callouts — unique to this section */
  stats?: AiResearchStat[];
}

export interface AiRedundancySeoPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  badge: string;
  intro: string;
  /** Empathetic framing for anxiety — shown under intro */
  anxietyNote?: string;
  positioning?: string;
  ctaPreset: AiCtaPreset;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  midCta?: "readiness" | "consultation" | "protection";
  showRunwayEmbed?: boolean;
  /** Hero sidebar stats — page-specific research highlights */
  heroStats?: AiResearchStat[];
  sections: AiSeoSection[];
  faqs: Array<{ question: string; answer: string }>;
  /** Bibliography for this page only */
  researchSources?: AiResearchSource[];
}
