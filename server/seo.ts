import { SITE_NAME, SITE_URL } from "@shared/site";
import { AI_REDUNDANCY_CLUSTER_SLUGS } from "@shared/aiRedundancySeo";

interface RouteSeo {
  title: string;
  description: string;
  canonical: string;
  robots: "index, follow" | "noindex, nofollow" | "noindex, follow";
  ogType: "website" | "article";
  statusCode: number;
}

const seoSlugs = [
  "free-redundancy-calculator",
  "redundancy-pay-calculator-uk",
  "statutory-redundancy-pay-calculator",
  "redundancy-calculator-uk",
  "redundancy-pay-calculator-2026",
  "how-much-redundancy-pay-will-i-get",
  "how-does-redundancy-pay-work",
  "maximum-redundancy-pay-uk",
  "redundancy-package-calculator",
  "enhanced-redundancy-calculator",
  "voluntary-redundancy-calculator",
  "redundancy-tax-calculator",
  "redundancy-pay-after-tax-calculator",
  "redundancy-notice-pay-calculator",
  "pilon-calculator-redundancy",
  "holiday-pay-redundancy-calculator",
  "redundancy-final-pay-calculator",
  "unpaid-wages-after-redundancy",
  "bonus-commission-redundancy-pay",
  "redundancy-payout-calculator",
  "how-long-will-my-redundancy-pay-last",
  "how-long-will-my-savings-last-after-redundancy",
  "redundancy-runway-calculator",
  "income-loss-calculator-uk",
  "emergency-fund-runway-calculator",
  "mortgage-redundancy-calculator",
  "redundancy-and-mortgage-payments",
  "one-income-household-calculator",
  "redundancy-budget-calculator",
  "job-loss-calculator-uk",
  "redundancy-readiness-calculator",
  "at-risk-of-redundancy-calculator",
  "at-risk-of-redundancy-what-to-do",
  "redundancy-consultation-defence-pack",
  "how-to-prepare-for-redundancy-consultation",
  "made-redundant-what-next",
  "first-week-after-redundancy",
  "redundancy-action-plan",
  "redundancy-consultation-questions",
  "questions-to-ask-in-redundancy-consultation",
  "what-to-do-before-redundancy-consultation",
  "redundancy-consultation-preparation",
  "redundancy-consultation-checklist",
  "worried-about-losing-your-job",
  "how-to-protect-yourself-during-redundancy-consultation",
  "worried-about-redundancy",
  "how-to-avoid-being-selected-for-redundancy",
  "redundancy-selection-criteria",
  "redundancy-selection-score",
  "redundancy-selection-matrix",
  "how-to-challenge-redundancy-selection",
  "redundancy-selection-criteria-examples",
  "what-evidence-to-prepare-for-redundancy-consultation",
  "redundancy-performance-selection-criteria",
  "redundancy-skills-selection-criteria",
  "redundancy-attendance-selection-criteria",
  "suitable-alternative-employment-redundancy",
  "alternative-role-redundancy",
  "redeployment-redundancy",
  "redundancy-alternative-employment-questions",
  "internal-vacancies-redundancy",
  "redundancy-trial-period-alternative-role",
  "refusing-suitable-alternative-employment",
  "redundancy-redeployment-checklist",
  "redundancy-role-protection-planner",
  "how-to-find-alternative-role-during-redundancy",
  "my-job-is-at-risk-what-should-i-do",
  "redundancy-next-steps",
  "redundancy-rights-uk",
  "benefits-after-redundancy",
  "claiming-universal-credit-after-redundancy",
  "universal-credit-after-redundancy",
  "does-redundancy-pay-affect-universal-credit",
  "redundancy-pay-and-benefits",
  "can-i-claim-jsa-after-redundancy",
  "redundancy-pay-and-savings-benefits",
  "employer-insolvent-redundancy-pay",
  "redundancy-payments-service-claim",
  "employer-has-not-paid-redundancy",
  "claim-redundancy-pay-from-government",
  "unpaid-wages-redundancy",
  "holiday-pay-owed-after-redundancy",
  "redundancy-pay-over-40",
  "redundancy-pay-after-5-years",
  "redundancy-pay-after-10-years",
  "redundancy-pay-after-20-years",
  "part-time-redundancy-pay-calculator",
  "zero-hours-redundancy-pay-calculator",
  "fixed-term-contract-redundancy-pay",
  "redundancy-pay-over-50",
  "redundancy-pay-over-60",
  "redundancy-pay-less-than-2-years-service",
  "ai-job-uncertainty-financial-planning",
  "redundancy-entitlement-calculator",
  "am-i-entitled-to-redundancy-pay",
  "tax-free-redundancy-pay-calculator",
  "redundancy-pay-30000-tax-free",
  "pilon-and-redundancy-pay-calculator",
  "redundancy-pay-notice-pay-holiday-pay",
  "redundancy-payment-date",
  "redundancy-lump-sum-calculator",
  "how-to-get-more-redundancy-pay",
  "maximise-redundancy-package",
  "missing-redundancy-payments-checklist",
  "redundancy-package-maximiser",
  "redundancy-offer-calculator",
  "enhanced-redundancy-offer-calculator",
  "voluntary-redundancy-offer-calculator",
  "redundancy-final-salary-calculator",
  "what-should-my-redundancy-package-include",
  "redundancy-package-checklist",
  "how-much-redundancy-pay-am-i-entitled-to",
  "what-redundancy-pay-am-i-entitled-to",
  "is-my-redundancy-package-fair",
  "can-i-negotiate-redundancy-pay",
  "redundancy-settlement-agreement-calculator",
  ...AI_REDUNDANCY_CLUSTER_SLUGS,
];

const publicSeoPaths = new Set(seoSlugs.map((slug) => `/${slug}`));

const articleSeoPaths = new Set([
  "/at-risk-of-redundancy-what-to-do",
  "/redundancy-consultation-defence-pack",
  "/how-to-prepare-for-redundancy-consultation",
  "/made-redundant-what-next",
  "/first-week-after-redundancy",
  "/redundancy-action-plan",
  "/redundancy-consultation-questions",
  "/questions-to-ask-in-redundancy-consultation",
  "/what-to-do-before-redundancy-consultation",
  "/redundancy-consultation-preparation",
  "/redundancy-consultation-checklist",
  "/worried-about-losing-your-job",
  "/how-to-protect-yourself-during-redundancy-consultation",
  "/worried-about-redundancy",
  "/how-to-avoid-being-selected-for-redundancy",
  "/redundancy-selection-criteria",
  "/redundancy-selection-score",
  "/redundancy-selection-matrix",
  "/how-to-challenge-redundancy-selection",
  "/redundancy-selection-criteria-examples",
  "/what-evidence-to-prepare-for-redundancy-consultation",
  "/redundancy-performance-selection-criteria",
  "/redundancy-skills-selection-criteria",
  "/redundancy-attendance-selection-criteria",
  "/suitable-alternative-employment-redundancy",
  "/alternative-role-redundancy",
  "/redeployment-redundancy",
  "/redundancy-alternative-employment-questions",
  "/internal-vacancies-redundancy",
  "/redundancy-trial-period-alternative-role",
  "/refusing-suitable-alternative-employment",
  "/redundancy-redeployment-checklist",
  "/redundancy-role-protection-planner",
  "/how-to-find-alternative-role-during-redundancy",
  "/my-job-is-at-risk-what-should-i-do",
  "/redundancy-next-steps",
  "/redundancy-rights-uk",
  "/benefits-after-redundancy",
  "/claiming-universal-credit-after-redundancy",
  "/universal-credit-after-redundancy",
  "/does-redundancy-pay-affect-universal-credit",
  "/redundancy-pay-and-benefits",
  "/can-i-claim-jsa-after-redundancy",
  "/redundancy-pay-and-savings-benefits",
  "/employer-insolvent-redundancy-pay",
  "/redundancy-payments-service-claim",
  "/employer-has-not-paid-redundancy",
  "/claim-redundancy-pay-from-government",
  "/unpaid-wages-redundancy",
  "/holiday-pay-owed-after-redundancy",
  "/fixed-term-contract-redundancy-pay",
  "/am-i-entitled-to-redundancy-pay",
  "/how-much-redundancy-pay-am-i-entitled-to",
  "/what-redundancy-pay-am-i-entitled-to",
  "/is-my-redundancy-package-fair",
  "/can-i-negotiate-redundancy-pay",
  "/what-should-my-redundancy-package-include",
  "/redundancy-package-checklist",
  "/how-to-get-more-redundancy-pay",
  "/maximise-redundancy-package",
  "/missing-redundancy-payments-checklist",
  "/unpaid-wages-after-redundancy",
  "/bonus-commission-redundancy-pay",
  "/redundancy-payment-date",
]);

const staticPublicRoutes = new Map<string, Pick<RouteSeo, "title" | "description" | "ogType">>([
  ["/", {
    title: `${SITE_NAME} | UK Redundancy Pay & Runway Calculator`,
    description: "Calculate your UK statutory redundancy pay and model how long your money may last with private runway scenarios.",
    ogType: "website",
  }],
  ["/about", {
    title: `About ${SITE_NAME}`,
    description: "Learn about RedundancyCalculatorUK, the private UK redundancy pay and runway modelling tool.",
    ogType: "website",
  }],
  ["/contact", {
    title: `Contact ${SITE_NAME}`,
    description: "Contact RedundancyCalculatorUK for product support and private report access help.",
    ogType: "website",
  }],
  ["/legal", {
    title: `Legal Notice | ${SITE_NAME}`,
    description: "Legal and regulatory notice for RedundancyCalculatorUK — non-advisory modelling tool.",
    ogType: "website",
  }],
  ["/terms", {
    title: `Terms of Use | ${SITE_NAME}`,
    description: "Terms of use for RedundancyCalculatorUK redundancy pay and runway calculator.",
    ogType: "website",
  }],
  ["/privacy", {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: "Privacy policy for RedundancyCalculatorUK under UK GDPR.",
    ogType: "website",
  }],
  ["/methodology", {
    title: `Methodology | ${SITE_NAME}`,
    description: "How RedundancyCalculatorUK models statutory redundancy pay and household runway.",
    ogType: "website",
  }],
  ["/redundancy-reset", {
    title: "7-Day Redundancy Reset",
    description: "A private written support journey that turns your redundancy calculator result into practical next steps.",
    ogType: "website",
  }],
  ["/redundancy-mortgage", {
    title: "Redundancy Mortgage Calculator UK",
    description: "Model mortgage pressure and household runway after redundancy using private scenario assumptions.",
    ogType: "website",
  }],
  ["/redundancy-consultation-defence-pack", {
    title: "Redundancy Consultation Defence Pack",
    description: "Prepare for redundancy consultation by organising documents, questions, role evidence and package assumptions without promising an outcome.",
    ogType: "article",
  }],
  ["/how-to-prepare-for-redundancy-consultation", {
    title: "How to Prepare for Redundancy Consultation",
    description: "Prepare for redundancy consultation with a calm checklist for documents, selection questions, alternatives and package assumptions.",
    ogType: "article",
  }],
  ["/redundancy-consultation-questions", {
    title: "Redundancy Consultation Questions to Ask",
    description: "Prepare questions for a redundancy consultation and understand what assumptions to clarify before modelling your package.",
    ogType: "article",
  }],
  ["/questions-to-ask-in-redundancy-consultation", {
    title: "Questions to Ask in a Redundancy Consultation",
    description: "A practical checklist of questions to ask during redundancy consultation, with links to calculator and next-step planning.",
    ogType: "article",
  }],
  ["/what-to-do-before-redundancy-consultation", {
    title: "What to Do Before a Redundancy Consultation",
    description: "Prepare for redundancy consultation by organising documents, pay assumptions, questions and household runway figures.",
    ogType: "article",
  }],
  ["/redundancy-consultation-preparation", {
    title: "Redundancy Consultation Preparation",
    description: "Prepare for redundancy consultation by organising role evidence, selection questions, package assumptions and next-step planning.",
    ogType: "article",
  }],
  ["/redundancy-consultation-checklist", {
    title: "Redundancy Consultation Checklist",
    description: "Use a redundancy consultation checklist to organise questions, evidence, package figures and follow-up actions before meetings.",
    ogType: "article",
  }],
  ["/how-to-protect-yourself-during-redundancy-consultation", {
    title: "How to Protect Yourself During Redundancy Consultation",
    description: "Organise documents, evidence, questions and package assumptions during redundancy consultation without promising an outcome.",
    ogType: "article",
  }],
  ["/at-risk-of-redundancy-what-to-do", {
    title: "At Risk of Redundancy: What to Do Next",
    description: "A calm guide to what to organise if your role is at risk, including pay assumptions, consultation questions and next-step planning.",
    ogType: "article",
  }],
  ["/worried-about-redundancy", {
    title: "Worried About Redundancy? Prepare Calmly",
    description: "If you are worried about redundancy, organise documents, consultation questions, package assumptions and household runway scenarios calmly.",
    ogType: "article",
  }],
  ["/how-to-avoid-being-selected-for-redundancy", {
    title: "How to Avoid Being Selected for Redundancy | Prep Guide",
    description: "Understand selection criteria and organise evidence, questions and package assumptions before redundancy consultation.",
    ogType: "article",
  }],
  ["/redundancy-selection-criteria", {
    title: "Redundancy Selection Criteria | UK Preparation Guide",
    description: "Understand common redundancy selection criteria and prepare evidence and questions before consultation.",
    ogType: "article",
  }],
  ["/redundancy-selection-score", {
    title: "Redundancy Selection Score | Preparation Guide",
    description: "Prepare questions about redundancy selection scoring and organise evidence before consultation without assessing fairness.",
    ogType: "article",
  }],
  ["/redundancy-selection-matrix", {
    title: "Redundancy Selection Matrix | Criteria Prep",
    description: "Use a selection matrix preparation guide to organise criteria, evidence, scores and consultation questions.",
    ogType: "article",
  }],
  ["/how-to-challenge-redundancy-selection", {
    title: "How to Challenge Redundancy Selection | Prep Guide",
    description: "Prepare evidence and questions if you want to query redundancy selection, without rights assessment or outcome promises.",
    ogType: "article",
  }],
  ["/redundancy-selection-criteria-examples", {
    title: "Redundancy Selection Criteria Examples",
    description: "Review common redundancy selection criteria examples and prepare evidence questions before consultation.",
    ogType: "article",
  }],
  ["/what-evidence-to-prepare-for-redundancy-consultation", {
    title: "What Evidence to Prepare for Redundancy Consultation",
    description: "Organise role evidence, selection criteria notes, performance context, skills records and attendance information before consultation.",
    ogType: "article",
  }],
  ["/redundancy-performance-selection-criteria", {
    title: "Redundancy Performance Selection Criteria",
    description: "Prepare evidence and questions where performance is mentioned in redundancy selection criteria.",
    ogType: "article",
  }],
  ["/redundancy-skills-selection-criteria", {
    title: "Redundancy Skills Selection Criteria",
    description: "Prepare skills evidence and consultation questions where skills, qualifications or experience are part of redundancy selection.",
    ogType: "article",
  }],
  ["/redundancy-attendance-selection-criteria", {
    title: "Redundancy Attendance Selection Criteria",
    description: "Prepare attendance context and consultation questions where attendance is included in redundancy selection criteria.",
    ogType: "article",
  }],
  ["/suitable-alternative-employment-redundancy", {
    title: "Suitable Alternative Employment Redundancy | Prep Guide",
    description: "Prepare questions about suitable alternative employment, redeployment options, role fit and trial-period details before consultation.",
    ogType: "article",
  }],
  ["/alternative-role-redundancy", {
    title: "Alternative Role Redundancy | Questions to Prepare",
    description: "Organise alternative role details, role-fit questions, pay assumptions and consultation notes before redundancy decisions.",
    ogType: "article",
  }],
  ["/redeployment-redundancy", {
    title: "Redeployment Redundancy | Alternative Role Prep",
    description: "Prepare for redeployment conversations by organising vacancies, role-fit evidence, skills, questions and package assumptions.",
    ogType: "article",
  }],
  ["/redundancy-alternative-employment-questions", {
    title: "Redundancy Alternative Employment Questions",
    description: "Prepare calm questions about alternative employment, redeployment, vacancy details, role terms, trial periods and next steps.",
    ogType: "article",
  }],
  ["/internal-vacancies-redundancy", {
    title: "Internal Vacancies During Redundancy | Prep Guide",
    description: "Track internal vacancies, redeployment options, deadlines, role-fit evidence and questions during redundancy consultation.",
    ogType: "article",
  }],
  ["/redundancy-trial-period-alternative-role", {
    title: "Redundancy Trial Period Alternative Role",
    description: "Prepare questions about alternative-role trial periods, training, dates, written terms and next steps during redundancy.",
    ogType: "article",
  }],
  ["/refusing-suitable-alternative-employment", {
    title: "Refusing Suitable Alternative Employment | Prep Guide",
    description: "Prepare facts and questions before discussing refusal of suitable alternative employment, without deciding suitability or outcomes.",
    ogType: "article",
  }],
  ["/redundancy-redeployment-checklist", {
    title: "Redundancy Redeployment Checklist",
    description: "Use a redeployment checklist to organise internal vacancies, role-fit evidence, questions, trial periods and package assumptions.",
    ogType: "article",
  }],
  ["/redundancy-role-protection-planner", {
    title: "Redundancy Role Protection Planner",
    description: "Organise role evidence, redeployment options, alternative-role questions and consultation notes in a structured planner.",
    ogType: "article",
  }],
  ["/how-to-find-alternative-role-during-redundancy", {
    title: "How to Find an Alternative Role During Redundancy",
    description: "Prepare a calm alternative-role search plan with internal vacancies, skills evidence, redeployment questions and deadlines.",
    ogType: "article",
  }],
  ["/how-to-get-more-redundancy-pay", {
    title: "How to Get More Redundancy Pay | RedundancyCalculatorUK",
    description: "Understand which redundancy package components could affect the total and use a private calculator to model payout and runway scenarios.",
    ogType: "article",
  }],
  ["/maximise-redundancy-package", {
    title: "Maximise Redundancy Package Understanding | UK Calculator",
    description: "Check which package components may affect your redundancy total and model how different package assumptions affect your runway.",
    ogType: "article",
  }],
  ["/can-i-negotiate-redundancy-pay", {
    title: "Can I Negotiate Redundancy Pay? | RedundancyCalculatorUK",
    description: "Understand what figures to clarify before redundancy pay conversations and model statutory, enhanced and voluntary package scenarios.",
    ogType: "article",
  }],
  ["/redundancy-package-checklist", {
    title: "Redundancy Package Checklist UK",
    description: "Check common redundancy package components including statutory pay, enhanced redundancy, notice pay, PILON, holiday pay and final pay.",
    ogType: "article",
  }],
  ["/what-should-my-redundancy-package-include", {
    title: "What Should My Redundancy Package Include?",
    description: "Understand common redundancy package components and use a private calculator to model your package and runway assumptions.",
    ogType: "article",
  }],
  ["/missing-redundancy-payments-checklist", {
    title: "Missing Redundancy Payments Checklist",
    description: "Review common final pay items that may be missed from a redundancy model, including notice, holiday pay, unpaid wages and bonus.",
    ogType: "article",
  }],
  ["/redundancy-package-maximiser", {
    title: "Redundancy Package Maximiser | Private Report",
    description: "Go beyond the statutory estimate with package checks, payout scenarios and runway modelling.",
    ogType: "website",
  }],
  ["/redundancy-payout-calculator", {
    title: "Redundancy Payout Calculator UK",
    description: "Estimate redundancy payout components and model how the payout may affect your household runway.",
    ogType: "website",
  }],
  ["/redundancy-offer-calculator", {
    title: "Redundancy Offer Calculator UK",
    description: "Compare employer package assumptions with statutory redundancy estimates and model how different offers affect runway.",
    ogType: "website",
  }],
  ["/enhanced-redundancy-offer-calculator", {
    title: "Enhanced Redundancy Offer Calculator UK",
    description: "Model an enhanced redundancy offer against statutory redundancy, notice pay, holiday pay and household runway assumptions.",
    ogType: "website",
  }],
  ["/redundancy-entitlement-calculator", {
    title: "Redundancy Entitlement Calculator UK",
    description: "Estimate statutory redundancy pay under UK age-band assumptions and model package components. Illustrative only — does not decide legal entitlement.",
    ogType: "website",
  }],
  ["/how-much-redundancy-pay-am-i-entitled-to", {
    title: "How Much Redundancy Pay Am I Entitled To? UK Estimate",
    description: "Estimate statutory redundancy pay based on the assumptions entered without treating the result as a legal entitlement decision.",
    ogType: "article",
  }],
  ["/what-redundancy-pay-am-i-entitled-to", {
    title: "What Redundancy Pay Am I Entitled To? UK Guide",
    description: "Understand what may affect a statutory redundancy estimate and keep package components separate from entitlement decisions.",
    ogType: "article",
  }],
  ["/am-i-entitled-to-redundancy-pay", {
    title: "Am I Entitled to Redundancy Pay? | UK Estimate",
    description: "Check an estimated statutory redundancy payment based on the assumptions entered without treating the result as legal entitlement.",
    ogType: "article",
  }],
  ["/redundancy-pay-less-than-2-years-service", {
    title: "Redundancy Pay With Less Than 2 Years' Service",
    description: "Understand redundancy pay eligibility with less than 2 years' service and what other package assumptions may matter.",
    ogType: "website",
  }],
  ["/maximum-redundancy-pay-uk", {
    title: "Maximum Redundancy Pay UK",
    description: "Understand the maximum statutory redundancy payment in the UK and estimate your payment using current assumptions.",
    ogType: "website",
  }],
  ["/redundancy-pay-over-50", {
    title: "Redundancy Pay Over 50 UK",
    description: "Estimate redundancy pay over 50 and model how savings, mortgage costs and replacement income affect your runway.",
    ogType: "website",
  }],
  ["/redundancy-pay-over-60", {
    title: "Redundancy Pay Over 60 UK",
    description: "Estimate redundancy pay over 60 and model household runway, pension-adjacent questions and income recovery assumptions.",
    ogType: "website",
  }],
  ["/part-time-redundancy-pay-calculator", {
    title: "Part-Time Redundancy Pay Calculator UK",
    description: "Estimate redundancy pay assumptions for part-time work using weekly pay and length of service.",
    ogType: "website",
  }],
  ["/zero-hours-redundancy-pay-calculator", {
    title: "Zero-Hours Redundancy Pay Calculator UK",
    description: "Estimate redundancy pay assumptions for variable-hours work and model how final pay may affect your runway.",
    ogType: "website",
  }],
  ["/redundancy-pay-notice-pay-holiday-pay", {
    title: "Redundancy Pay, Notice Pay and Holiday Pay UK",
    description: "Estimate redundancy pay, notice pay and holiday pay as separate package components before modelling final pay and runway.",
    ogType: "website",
  }],
  ["/pilon-and-redundancy-pay-calculator", {
    title: "PILON and Redundancy Pay Calculator UK",
    description: "Estimate payment in lieu of notice alongside redundancy pay and keep PILON separate from holiday, wages and tax-sensitive assumptions.",
    ogType: "website",
  }],
  ["/holiday-pay-redundancy-calculator", {
    title: "Holiday Pay Redundancy Calculator UK",
    description: "Estimate accrued holiday pay as a separate redundancy package component and model how it affects final pay and runway.",
    ogType: "website",
  }],
  ["/redundancy-notice-pay-calculator", {
    title: "Redundancy Notice Pay Calculator UK",
    description: "Estimate notice pay alongside redundancy pay and keep worked notice, PILON and final pay assumptions separate.",
    ogType: "website",
  }],
  ["/unpaid-wages-after-redundancy", {
    title: "Unpaid Wages After Redundancy | Package Checklist",
    description: "Organise unpaid wages, final salary, notice, holiday pay and redundancy pay as separate final package assumptions.",
    ogType: "article",
  }],
  ["/bonus-commission-redundancy-pay", {
    title: "Bonus and Commission in Redundancy Pay | UK Checklist",
    description: "Check where bonus, commission and company benefits may sit in a redundancy package model before estimating final pay and runway.",
    ogType: "article",
  }],
  ["/redundancy-final-pay-calculator", {
    title: "Redundancy Final Pay Calculator UK",
    description: "Estimate final pay elements after redundancy, including redundancy pay, notice pay, holiday pay, unpaid wages, bonus and deductions.",
    ogType: "website",
  }],
  ["/tax-free-redundancy-pay-calculator", {
    title: "Tax-Free Redundancy Pay Calculator UK",
    description: "Separate tax-sensitive redundancy, notice, holiday, wages and bonus assumptions before modelling package runway.",
    ogType: "website",
  }],
  ["/redundancy-pay-30000-tax-free", {
    title: "Is Redundancy Pay £30,000 Tax-Free? UK Guide",
    description: "Understand the £30,000 redundancy tax-free threshold and separate notice, holiday, wages and bonus assumptions from redundancy pay.",
    ogType: "article",
  }],
  ["/redundancy-payment-date", {
    title: "Redundancy Payment Date | Package Timing Checklist",
    description: "Plan redundancy payment date assumptions and model how payment timing may affect final pay, bills and household runway.",
    ogType: "article",
  }],
]);

const noindexPrefixes = [
  "/admin",
  "/access",
  "/preview",
  "/recover",
  "/report-access",
  "/results",
  "/unlock",
  "/wizard",
  "/payment-success",
  "/brief-example",
  "/report-example",
  "/redundancy-reset/intake",
  "/redundancy-reset/portal",
];

export function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function titleFromPath(pathname: string) {
  const title = normalizePathname(pathname)
    .slice(1)
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part === "uk") return "UK";
      if (part === "ai") return "AI";
      if (part === "jsa") return "JSA";
      if (part === "pilon") return "PILON";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");

  return title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | UK Redundancy Pay & Runway Calculator`;
}

function descriptionFromPath(pathname: string) {
  const topic = normalizePathname(pathname).slice(1).replace(/-/g, " ");
  return `Use ${SITE_NAME} to understand ${topic || "UK redundancy pay"} and move into private redundancy pay and runway modelling.`;
}

function getRouteSeo(originalUrl: string): RouteSeo {
  const url = new URL(originalUrl, SITE_URL);
  const pathname = normalizePathname(url.pathname);
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  if (staticPublicRoutes.has(pathname)) {
    const meta = staticPublicRoutes.get(pathname)!;
    return { ...meta, canonical, robots: "index, follow", statusCode: 200 };
  }

  if (publicSeoPaths.has(pathname)) {
    return {
      title: titleFromPath(pathname),
      description: descriptionFromPath(pathname),
      canonical,
      robots: "index, follow",
      ogType: articleSeoPaths.has(pathname) ? "article" : "website",
      statusCode: 200,
    };
  }

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return {
      title: `Page Not Found | ${SITE_NAME}`,
      description: "This RedundancyCalculatorUK API route could not be found.",
      canonical,
      robots: "noindex, nofollow",
      ogType: "website",
      statusCode: 404,
    };
  }

  if (noindexPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return {
      title: `${SITE_NAME} Private Access`,
      description: "Private RedundancyCalculatorUK access page.",
      canonical,
      robots: "noindex, nofollow",
      ogType: "website",
      statusCode: 200,
    };
  }

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    description: "This RedundancyCalculatorUK page could not be found.",
    canonical,
    robots: "noindex, nofollow",
    ogType: "website",
    statusCode: 404,
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceOrInsertMeta(html: string, selector: RegExp, replacement: string) {
  if (selector.test(html)) {
    return html.replace(selector, replacement);
  }

  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

export function applyRouteSeoToHtml(html: string, originalUrl: string) {
  const seo = getRouteSeo(originalUrl);
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);
  const robots = escapeHtml(seo.robots);
  const ogType = escapeHtml(seo.ogType);
  const ogImage = escapeHtml(`${SITE_URL}/og-image.png`);

  let nextHtml = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${robots}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
  nextHtml = replaceOrInsertMeta(nextHtml, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${ogImage}" />`);

  return { html: nextHtml, statusCode: seo.statusCode, seo };
}
