import { RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "./product";

/** Standard guardrail disclaimer for all AI redundancy SEO pages. */
export const AI_REDUNDANCY_SEO_DISCLAIMER =
  "RedundancyCalculatorUK is an assumption-based modelling and preparation tool. It does not provide financial, legal, tax, debt, benefits, mortgage, employment, career or negotiation advice and does not predict redundancy, AI replacement, employment outcomes or package offers.";

export const AI_REDUNDANCY_CLUSTER_SLUGS = [
  "ai-redundancy-calculator",
  "will-ai-replace-my-job",
  "can-my-employer-replace-me-with-ai",
  "what-jobs-will-ai-replace",
  "how-to-protect-your-job-from-ai",
  "ai-job-risk-calculator",
  "jobs-most-at-risk-from-ai",
  "jobs-safe-from-ai",
  "ai-redundancy-rights-uk",
  "ai-proof-your-career",
] as const;

export type AiRedundancyClusterSlug = (typeof AI_REDUNDANCY_CLUSTER_SLUGS)[number];

/** Every AI cluster page links to these hub pages contextually. */
export const AI_CLUSTER_HUB_LINKS = [
  { href: "/ai-redundancy-calculator", label: "AI redundancy calculator", body: "Model readiness, package assumptions and runway if work changes." },
  { href: "/ai-job-risk-calculator", label: "AI job risk calculator", body: "Assess role exposure and financial runway — not job-loss probability." },
  { href: "/will-ai-replace-my-job", label: "Will AI replace my job?", body: "Reframe the question around exposure and preparation." },
  { href: "/can-my-employer-replace-me-with-ai", label: "Can my employer replace me with AI?", body: "Prepare consultation questions if automation is mentioned." },
  { href: "/how-to-protect-your-job-from-ai", label: "Protect your job from AI", body: "Evidence, visibility and alternative-role preparation." },
  { href: "/ai-redundancy-rights-uk", label: "AI redundancy rights UK", body: "Questions and documents — not legal advice." },
] as const;

/** Core redundancy routes that exist today (verified). */
export const AI_CORE_REDUNDANCY_LINKS = [
    { href: "/worried-about-redundancy", label: "Worried about redundancy?", body: "Readiness preparation before anything is final." },
    { href: "/redundancy-readiness-calculator", label: "Redundancy readiness calculator", body: "Package, runway and protection measures from your figures." },
    { href: "/at-risk-of-redundancy-calculator", label: "At risk of redundancy calculator", body: "Consultation prep and runway modelling together." },
    { href: "/at-risk-of-redundancy-what-to-do", label: "At risk of redundancy", body: "Organise facts, questions and first money assumptions." },
  { href: "/redundancy-package-calculator", label: "Redundancy package calculator", body: "Model statutory, notice, holiday and enhanced assumptions." },
  { href: "/redundancy-payout-calculator", label: "Redundancy payout calculator", body: "Estimate total payout and runway context." },
  { href: "/how-to-prepare-for-redundancy-consultation", label: "Prepare for consultation", body: "Documents, questions and package assumptions." },
  { href: "/redundancy-consultation-questions", label: "Consultation questions", body: "Structured HR and consultation question banks." },
  { href: "/redundancy-selection-criteria", label: "Selection criteria", body: "Prepare evidence and clarification questions." },
  { href: "/suitable-alternative-employment-redundancy", label: "Suitable alternative employment", body: "Alternative-role preparation without deciding suitability." },
  { href: "/redundancy-reset", label: "7-Day Redundancy Readiness Reset", body: "Structured written support for the next practical steps." },
] as const;

export const AI_PAID_PREVIEW_HEADLINE = "Unlock your AI redundancy readiness report";
export const AI_PAID_PREVIEW_SUBCOPY =
  "Go beyond the article. Build a private snapshot showing role exposure, package assumptions, runway scenarios, consultation questions and preparation gaps.";
export const AI_PAID_PREVIEW_CTA = `Unlock full report — £${RUNWAY_REPORT_PRICE_GBP}`;
export const AI_PAID_PREVIEW_SUPPORTING = "One-off payment. Modelling and preparation only. No subscription.";

export const AI_PAID_PREVIEW_MODULES = [
  "Protection measures playbook",
  "AI role exposure questions",
  "Role Protection Planner",
  "Consultation Defence Pack",
  "Selection Criteria Prep",
  "Alternative Role Finder",
  "Decision Leverage Map",
  "Runway and package scenarios",
] as const;

export type AiCtaPreset = "readiness" | "consultation" | "protection" | "exposure";

export const AI_CTA_PRESETS: Record<
  AiCtaPreset,
  { primary: { label: string; href: string }; secondary: { label: string; href: string } }
> = {
  readiness: {
    primary: { label: "Start AI redundancy readiness check", href: "/wizard" },
    secondary: { label: `Unlock ${RUNWAY_REPORT_FULL} — £${RUNWAY_REPORT_PRICE_GBP}`, href: "/unlock" },
  },
  consultation: {
    primary: { label: "Prepare AI redundancy questions", href: "/redundancy-consultation-defence-pack" },
    secondary: { label: "Unlock Consultation Defence Pack", href: "/unlock" },
  },
  protection: {
    primary: { label: "Build my role protection plan", href: "/redundancy-role-protection-planner" },
    secondary: { label: "Unlock Role Protection Planner", href: "/unlock" },
  },
  exposure: {
    primary: { label: "Check my role exposure", href: "/wizard" },
    secondary: { label: "Unlock Role Protection Planner", href: "/unlock" },
  },
};
