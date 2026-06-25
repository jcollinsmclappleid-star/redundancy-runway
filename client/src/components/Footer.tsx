import { Link } from "wouter";
import { Logo } from "./Logo";

const SUPPORT_EMAIL = "support@redundancycalculatoruk.co.uk";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-5">
            <Logo showTagline size="footer" />
            <p className="text-muted-foreground text-xs leading-relaxed mt-4 max-w-sm">
              A private redundancy runway report. Model how long your money may last if work changes — based solely on the assumptions you enter.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Operated by{" "}
              <span className="font-medium text-foreground">Ianson Systems Limited</span>
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-sm font-medium mb-3">UK Redundancy Guides</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/statutory-redundancy-pay-calculator" className="hover:text-foreground transition-colors" data-testid="footer-link-statutory">
                  Statutory Redundancy Pay 2025
                </Link>
              </li>
              <li>
                <Link href="/redundancy-mortgage" className="hover:text-foreground transition-colors" data-testid="footer-link-mortgage">
                  Redundancy &amp; Your Mortgage
                </Link>
              </li>
              <li>
                <Link href="/voluntary-redundancy-calculator" className="hover:text-foreground transition-colors" data-testid="footer-link-vr">
                  Voluntary Redundancy Guide
                </Link>
              </li>
              <li>
                <Link href="/redundancy-reset" className="hover:text-foreground transition-colors" data-testid="footer-link-reset">
                  7-Day Redundancy Reset
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors" data-testid="footer-link-about">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-medium mb-3">Company</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
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
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
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
          <span className="sm:text-right">Benchmark data: Office for National Statistics. Last updated Q4 2025.</span>
        </div>
      </div>
    </footer>
  );
}
