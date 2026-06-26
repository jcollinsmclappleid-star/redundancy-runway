import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { SITE_URL } from "@shared/site";
import { applyRouteSeoToHtml, normalizePathname } from "./seo";

const INDEX_HTML_CANDIDATES = [
  resolve(import.meta.dirname, "..", "dist", "public", "index.html"),
  resolve(import.meta.dirname, "..", "client", "index.html"),
];

function loadIndexHtml() {
  for (const path of INDEX_HTML_CANDIDATES) {
    try {
      return readFileSync(path, "utf8");
    } catch {
      continue;
    }
  }
  throw new Error("Could not load index.html for SEO tests");
}

const INDEX_HTML = loadIndexHtml();

function seoFor(pathname: string) {
  return applyRouteSeoToHtml(INDEX_HTML, pathname);
}

function extractMeta(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1] ?? null;
}

describe("normalizePathname", () => {
  it("strips trailing slashes", () => {
    assert.equal(normalizePathname("/about/"), "/about");
    assert.equal(normalizePathname("/"), "/");
  });
});

describe("applyRouteSeoToHtml", () => {
  it("uses www canonical host", () => {
    const { html } = seoFor("/about");
    const canonical = extractMeta(html, /rel="canonical" href="([^"]+)"/);
    assert.ok(canonical?.startsWith("https://www.redundancycalculatoruk.co.uk"));
  });

  it("sets homepage canonical", () => {
    const { html, statusCode } = seoFor("/");
    assert.equal(statusCode, 200);
    assert.equal(
      extractMeta(html, /rel="canonical" href="([^"]+)"/),
      `${SITE_URL}`,
    );
    assert.equal(extractMeta(html, /name="robots" content="([^"]+)"/), "index, follow");
  });

  it("sets per-page canonical for SEO calculator slugs", () => {
    const path = "/free-redundancy-calculator";
    const { html } = seoFor(path);
    assert.equal(
      extractMeta(html, /rel="canonical" href="([^"]+)"/),
      `${SITE_URL}${path}`,
    );
    assert.equal(extractMeta(html, /name="robots" content="([^"]+)"/), "index, follow");
  });

  it("sets per-page canonical for legal routes", () => {
    for (const path of ["/legal", "/terms", "/privacy", "/methodology"]) {
      const { html } = seoFor(path);
      assert.equal(
        extractMeta(html, /rel="canonical" href="([^"]+)"/),
        `${SITE_URL}${path}`,
      );
    }
  });

  it("noindexes private app routes", () => {
    for (const path of ["/wizard", "/preview", "/unlock", "/results", "/access"]) {
      const { html } = seoFor(path);
      assert.equal(extractMeta(html, /name="robots" content="([^"]+)"/), "noindex, nofollow");
      assert.equal(
        extractMeta(html, /rel="canonical" href="([^"]+)"/),
        `${SITE_URL}${path}`,
      );
    }
  });

  it("returns 404 noindex for unknown paths", () => {
    const { html, statusCode } = seoFor("/not-a-real-page");
    assert.equal(statusCode, 404);
    assert.equal(extractMeta(html, /name="robots" content="([^"]+)"/), "noindex, nofollow");
  });

  it("does not treat retired alias slugs as indexable routes", () => {
    for (const path of ["/statutory-redundancy-pay", "/voluntary-redundancy"]) {
      const { statusCode } = seoFor(path);
      assert.equal(statusCode, 404);
    }
  });

  it("injects unique titles per route", () => {
    const home = extractMeta(seoFor("/").html, /<title>([^<]+)<\/title>/);
    const about = extractMeta(seoFor("/about").html, /<title>([^<]+)<\/title>/);
    assert.notEqual(home, about);
  });
});

describe("sitemap.xml", () => {
  it("lists only www URLs and includes legal pages", () => {
    const xml = readFileSync(resolve(import.meta.dirname, "..", "public", "sitemap.xml"), "utf8");
    assert.ok(!xml.includes("https://redundancycalculatoruk.co.uk/"), "sitemap must not use apex without www");
    assert.ok(xml.includes(`${SITE_URL}/legal`));
    assert.ok(xml.includes(`${SITE_URL}/free-redundancy-calculator`));
    assert.ok(!xml.includes(`${SITE_URL}/wizard`));
    assert.ok(!xml.includes(`${SITE_URL}/statutory-redundancy-pay</loc>`));
  });
});
