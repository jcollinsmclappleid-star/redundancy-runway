import { SITE_NAME, SITE_URL } from "@shared/site";

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
  "at-risk-of-redundancy-what-to-do",
  "made-redundant-what-next",
  "first-week-after-redundancy",
  "redundancy-action-plan",
  "redundancy-consultation-questions",
  "questions-to-ask-in-redundancy-consultation",
  "what-to-do-before-redundancy-consultation",
  "worried-about-losing-your-job",
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
  "tax-free-redundancy-pay-calculator",
  "redundancy-pay-30000-tax-free",
  "pilon-and-redundancy-pay-calculator",
  "redundancy-pay-notice-pay-holiday-pay",
  "redundancy-lump-sum-calculator",
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
];

const publicSeoPaths = new Set(seoSlugs.map((slug) => `/${slug}`));

const articleSeoPaths = new Set([
  "/at-risk-of-redundancy-what-to-do",
  "/made-redundant-what-next",
  "/first-week-after-redundancy",
  "/redundancy-action-plan",
  "/redundancy-consultation-questions",
  "/questions-to-ask-in-redundancy-consultation",
  "/what-to-do-before-redundancy-consultation",
  "/worried-about-losing-your-job",
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
  "/how-much-redundancy-pay-am-i-entitled-to",
  "/what-redundancy-pay-am-i-entitled-to",
  "/is-my-redundancy-package-fair",
  "/can-i-negotiate-redundancy-pay",
  "/what-should-my-redundancy-package-include",
  "/redundancy-package-checklist",
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
  ["/redundancy-reset", {
    title: "7-Day Redundancy Reset",
    description: "A private written support journey that turns your redundancy calculator result into practical next steps.",
    ogType: "website",
  }],
  ["/statutory-redundancy-pay", {
    title: "Statutory Redundancy Pay Calculator",
    description: "Calculate UK statutory redundancy pay using age, weekly pay and complete years of service.",
    ogType: "website",
  }],
  ["/redundancy-mortgage", {
    title: "Redundancy Mortgage Calculator UK",
    description: "Model mortgage pressure and household runway after redundancy using private scenario assumptions.",
    ogType: "website",
  }],
  ["/voluntary-redundancy", {
    title: "Voluntary Redundancy Calculator UK",
    description: "Model voluntary redundancy package assumptions and household runway scenarios.",
    ogType: "website",
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
