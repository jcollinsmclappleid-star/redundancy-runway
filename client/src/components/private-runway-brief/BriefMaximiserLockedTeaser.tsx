import { Link } from "wouter";
import { Lock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCT_COPY, REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";

interface BriefMaximiserLockedTeaserProps {
  unlockHref?: string;
  compact?: boolean;
}

export function BriefMaximiserLockedTeaser({
  unlockHref = "/unlock",
  compact = false,
}: BriefMaximiserLockedTeaserProps) {
  return (
    <div
      className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white overflow-hidden"
      data-testid="brief-maximiser-locked"
    >
      <div className={`px-4 sm:px-5 ${compact ? "py-4" : "py-5"}`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-primary">{REDUNDANCY_PAY_MAXIMISER_NAME}</p>
              <Badge variant="outline" className="text-[9px] border-gold/40">Flagship tool</Badge>
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              See what could increase your package total, ranked by runway impact — statutory vs full package,
              notice, holiday, enhanced pay and gaps to clarify with HR.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {["Package uplift", "Runway impact", "Ranked opportunities"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-amber-100 bg-white/80 px-2 py-2.5 text-center"
            >
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-bold text-primary/40 blur-[4px] select-none tabular-nums">£—</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={unlockHref}>
            <Button size="sm" className="btn-gold" data-testid="button-unlock-maximiser">
              {PRODUCT_COPY.unlockCta}
            </Button>
          </Link>
          <p className="text-[10px] text-muted-foreground self-center">{PRODUCT_COPY.unlockSupportingLine}</p>
        </div>
      </div>
    </div>
  );
}
