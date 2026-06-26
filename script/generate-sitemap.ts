/**
 * Generates public/sitemap.xml from SEO page slugs and static public routes.
 * Run: npm run sitemap:generate
 *
 * Slugs are parsed from SEO content source files to avoid importing React at build time.
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL } from "@shared/site";
import { AI_REDUNDANCY_CLUSTER_SLUGS } from "@shared/aiRedundancySeo";

const SEO_PAGES_FILE = resolve(
  import.meta.dirname,
  "..",
  "client",
  "src",
  "pages",
  "seo",
  "redundancy-calculator-pages.tsx",
);

const APP_ROUTES_FILE = resolve(import.meta.dirname, "..", "client", "src", "App.tsx");

const STATIC_ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/legal", priority: "0.4", changefreq: "yearly" },
  { path: "/terms", priority: "0.4", changefreq: "yearly" },
  { path: "/privacy", priority: "0.4", changefreq: "yearly" },
  { path: "/methodology", priority: "0.5", changefreq: "monthly" },
  { path: "/redundancy-reset", priority: "0.7", changefreq: "monthly" },
  { path: "/redundancy-mortgage", priority: "0.8", changefreq: "monthly" },
];

const HIGH_PRIORITY_SLUGS = new Set([
  "free-redundancy-calculator",
  "redundancy-pay-calculator-uk",
  "statutory-redundancy-pay-calculator",
  "redundancy-calculator-uk",
  "redundancy-package-calculator",
  "redundancy-entitlement-calculator",
  "how-much-redundancy-pay-am-i-entitled-to",
  "ai-redundancy-calculator",
  "ai-job-risk-calculator",
  "redundancy-readiness-calculator",
  "at-risk-of-redundancy-calculator",
]);

const MISSING_SEO_PAGES_FILE = resolve(
  import.meta.dirname,
  "..",
  "client",
  "src",
  "pages",
  "seo",
  "missing-seo-page-content.ts",
);

const NOINDEX_ROUTE_PREFIXES = [
  "/admin",
  "/access",
  "/brief-example",
  "/payment-success",
  "/preview",
  "/recover",
  "/report-access",
  "/report-example",
  "/results",
  "/unlock",
  "/wizard",
  "/redundancy-reset/intake",
  "/redundancy-reset/portal",
];

function readSlugLinesFromFile(filePath: string): string[] {
  const source = readFileSync(filePath, "utf8");
  return [...source.matchAll(/^\s+slug: "([^"]+)"/gm)].map((match) => match[1]);
}

function readGuidePageSlugsFromFile(filePath: string): string[] {
  const source = readFileSync(filePath, "utf8");
  return [...source.matchAll(/guidePage\(\s*"([^"]+)"/gm)].map((match) => match[1]);
}

function isIndexableLiteralRoute(path: string): boolean {
  if (path.includes(":")) return false;
  return !NOINDEX_ROUTE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function readIndexableRoutesFromApp(): string[] {
  const source = readFileSync(APP_ROUTES_FILE, "utf8");
  return [...source.matchAll(/<Route\s+path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter(isIndexableLiteralRoute)
    .map((path) => (path === "/" ? path : path.replace(/\/+$/, "")));
}

function readSeoCalculatorSlugs(): string[] {
  const slugs = [
    ...readSlugLinesFromFile(SEO_PAGES_FILE),
    ...readSlugLinesFromFile(MISSING_SEO_PAGES_FILE),
    ...readGuidePageSlugsFromFile(MISSING_SEO_PAGES_FILE),
  ];
  if (slugs.length === 0) {
    throw new Error(`No SEO slugs found in SEO page content files`);
  }
  return [...new Set(slugs)];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(path: string, priority: string, changefreq: string, lastmod: string) {
  const loc = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function main() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries: string[] = [];

  for (const route of STATIC_ROUTES) {
    entries.push(urlEntry(route.path, route.priority, route.changefreq, lastmod));
  }

  const seen = new Set(STATIC_ROUTES.map((route) => route.path));

  const sitemapPaths = [
    ...readSeoCalculatorSlugs().map((slug) => `/${slug}`),
    ...AI_REDUNDANCY_CLUSTER_SLUGS.map((slug) => `/${slug}`),
    ...readIndexableRoutesFromApp(),
  ];

  for (const path of sitemapPaths) {
    if (seen.has(path)) continue;
    seen.add(path);
    const slug = path.slice(1);
    const priority = HIGH_PRIORITY_SLUGS.has(slug) ? "0.95" : "0.8";
    entries.push(urlEntry(path, priority, "monthly", lastmod));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  const outputPath = resolve(import.meta.dirname, "..", "public", "sitemap.xml");
  writeFileSync(outputPath, xml, "utf8");
  console.log(`Wrote ${entries.length} URLs to ${outputPath}`);
}

main();
