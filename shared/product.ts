import { SITE_NAME, SITE_URL } from "./site";

/**
 * Canonical product names — payout-first, SEO-forward.
 *
 * Paid (£39): Private Redundancy Package & Runway Report
 * Dashboard:  Runway Command Centre
 * Narrative:  Redundancy Runway Brief
 */
export const RUNWAY_REPORT_FULL = "Private Redundancy Package & Runway Report";
/** Shorter form for titles, meta and tight UI */
export const RUNWAY_REPORT_SEO = "Redundancy Package & Runway Report";
export const RUNWAY_BRIEF_NAME = "Redundancy Runway Brief";
export const COMMAND_CENTRE_NAME = "Runway Command Centre";
export const RUNWAY_REPORT_PRICE_GBP = 39;

export const PRODUCT_COPY = {
  briefHeadline: "Your figures, explained in plain English.",
  dualProductLine:
    "Your package dashboard shows what could be included. Your runway dashboard shows how long it may last. Your Redundancy Runway Brief explains the figures in plain English.",
  sampleLabel: "Example only — your figures will depend on the assumptions entered.",
  buildCta: "Calculate my redundancy pay",
  unlockCta: `Unlock ${RUNWAY_REPORT_FULL} — £${RUNWAY_REPORT_PRICE_GBP}`,
  fullScenarioCta: `See your full scenario range — £${RUNWAY_REPORT_PRICE_GBP}`,
  unlockHeadline: "Unlock the full package and runway view.",
  unlockSubcopy:
    "See the estimated payout components, model how long the money may last, and generate a plain-English brief from your figures.",
  unlockModules: [
    "Package breakdown with component status",
    "Statutory vs employer offer comparison",
    "Payout-to-runway bridge",
    "Month-by-month capital path",
    "Income recovery & stress scenarios",
    "Plain-English Redundancy Runway Brief",
  ] as const,
  trustLine:
    "Statutory pay · enhanced package · notice pay · holiday pay · mortgage/runway modelling",
  notAdvice: "Model output · not advice",
  heroH1: "Calculate your redundancy pay, then see how long it could last.",
  heroSub:
    "Use a free UK redundancy calculator to estimate statutory redundancy pay, package components and household runway — then unlock a private report showing what your figures mean.",
  payoutSectionHeading: "Start with the payout. Then understand the runway.",
  payoutSectionBody:
    "Most redundancy calculators stop at statutory pay. RedundancyCalculatorUK helps you model the wider package picture — including statutory redundancy, enhanced package assumptions, notice pay, holiday pay and savings — then shows how long the money may last under different scenarios.",
} as const;

export { SITE_NAME, SITE_URL };
