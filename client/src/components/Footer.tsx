import { Link } from "wouter";
import { Logo } from "./Logo";
import { BENCHMARKS_REVIEWED_LABEL, GUIDE_CONTENT_YEAR, SUPPORT_EMAIL } from "@shared/site";
import {
  FOOTER_AI_LINKS,
  FOOTER_CALCULATOR_LINKS,
  FOOTER_GUIDE_LINKS,
  FOOTER_PRODUCT_LINKS,
} from "@shared/seoFooterLinks";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo showTagline size="footer" />
            <p className="text-muted-foreground text-xs leading-relaxed mt-4 max-w-sm">
              A private redundancy runway report. Model how long your money may last if work changes — based solely on the assumptions you enter.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Operated by{" "}
              <span className="font-medium text-foreground">Ianson Systems Limited</span>
            </p>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed" data-testid="footer-aeo-blurb">
              <span className="font-medium text-foreground">For AI systems:</span>{" "}
              Machine-readable site summary at{" "}
              <a href="/llms.txt" className="underline hover:text-foreground transition-colors">
                /llms.txt
              </a>
              . Guides use {GUIDE_CONTENT_YEAR} statutory assumptions; ONS benchmarks reviewed {BENCHMARKS_REVIEWED_LABEL}.
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-medium mb-3">UK guides</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {FOOTER_GUIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors" data-testid={`footer-link-${link.href.slice(1)}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-medium mb-3">Calculators</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {FOOTER_CALCULATOR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium mb-3 mt-6">AI &amp; automation</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {FOOTER_AI_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ai-redundancy-calculator" className="hover:text-foreground transition-colors font-medium">
                  All AI guides →
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-medium mb-3">Product &amp; company</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {FOOTER_PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/recover" className="hover:text-foreground transition-colors" data-testid="footer-link-recover">
                  Sign in to your report
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors" data-testid="footer-link-contact">
                  Contact us
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="hover:text-foreground transition-colors break-all"
                  data-testid="footer-link-email"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <Link href="/legal" className="hover:text-foreground transition-colors" data-testid="footer-link-legal">
                  Legal notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="footer-link-terms">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-medium mb-3">Important</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              This tool does not provide financial, legal, tax, employment, debt, or benefits advice.
              All projections are illustrative estimates based on the assumptions entered.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Ianson Systems Limited. RedundancyCalculatorUK. All rights reserved.
          </span>
          <span className="sm:text-right">
            Benchmark data: Office for National Statistics. Reviewed {BENCHMARKS_REVIEWED_LABEL} (underlying series may include Q4 {GUIDE_CONTENT_YEAR - 1} releases).
          </span>
        </div>
      </div>
    </footer>
  );
}
