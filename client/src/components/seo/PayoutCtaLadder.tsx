import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_COPY, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";

export const PAYOUT_SEO_SLUGS = new Set([
  "redundancy-entitlement-calculator",
  "how-much-redundancy-pay-am-i-entitled-to",
  "what-redundancy-pay-am-i-entitled-to",
  "redundancy-package-calculator",
  "redundancy-offer-calculator",
  "enhanced-redundancy-offer-calculator",
  "voluntary-redundancy-offer-calculator",
  "is-my-redundancy-package-fair",
  "what-should-my-redundancy-package-include",
  "redundancy-payout-calculator",
  "tax-free-redundancy-pay-calculator",
  "redundancy-pay-notice-pay-holiday-pay",
  "pilon-and-redundancy-pay-calculator",
  "redundancy-final-pay-calculator",
  "redundancy-package-checklist",
  "redundancy-lump-sum-calculator",
  "free-redundancy-calculator",
  "statutory-redundancy-pay-calculator",
]);

interface PayoutCtaLadderProps {
  slug: string;
  className?: string;
}

export function PayoutCtaLadder({ slug, className = "" }: PayoutCtaLadderProps) {
  if (!PAYOUT_SEO_SLUGS.has(slug)) return null;

  return (
    <div className={`rounded-xl border border-gold/25 bg-[hsl(40_30%_98%)] p-5 space-y-3 ${className}`} data-testid="payout-cta-ladder">
      <p className="text-sm font-semibold text-primary">Next steps under your assumptions</p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <Link href="/wizard">
          <Button size="sm" className="btn-gold w-full sm:w-auto">
            {PRODUCT_COPY.buildCta}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
        <Link href="/wizard?step=0">
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            Add package details
          </Button>
        </Link>
        <Link href="/unlock">
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            Unlock full report — £{RUNWAY_REPORT_PRICE_GBP}
          </Button>
        </Link>
      </div>
    </div>
  );
}
