import { Link } from "wouter";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-3">
              <Logo showTagline />
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed mt-3">
              A private redundancy runway report. Model how long your money may last if work changes — based solely on the assumptions you enter.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">UK Redundancy Guides</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/statutory-redundancy-pay" className="hover:text-foreground transition-colors" data-testid="footer-link-statutory">
                  Statutory Redundancy Pay 2025
                </Link>
              </li>
              <li>
                <Link href="/redundancy-mortgage" className="hover:text-foreground transition-colors" data-testid="footer-link-mortgage">
                  Redundancy &amp; Your Mortgage
                </Link>
              </li>
              <li>
                <Link href="/voluntary-redundancy" className="hover:text-foreground transition-colors" data-testid="footer-link-vr">
                  Voluntary Redundancy Guide
                </Link>
              </li>
              <li>
                <Link href="/redundancy-reset" className="hover:text-foreground transition-colors" data-testid="footer-link-reset">
                  7-Day Redundancy Reset
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Legal</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Methodology</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Important</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              This tool does not provide financial, legal, tax, employment, debt, or benefits advice.
              All projections are illustrative estimates based on the assumptions entered and do not predict individual outcomes.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} RedundancyCalculatorUK. All rights reserved.</span>
          <span>Benchmark data: Office for National Statistics. Last updated Q4 2025.</span>
        </div>
      </div>
    </footer>
  );
}
