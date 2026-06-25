import type { RunwayInputs } from "@shared/schema";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { formatGBP } from "@/lib/engine";
import { PRODUCT_COPY } from "@shared/product";

const LOCKED_CARDS = [
  {
    key: "completeness",
    title: "Package completeness",
    teaser: "See which package figures have been entered, which are missing, and which may need verifying.",
    mock: "—%",
  },
  {
    key: "offer",
    title: "Statutory vs employer package",
    teaser: "Compare the statutory estimate with an employer or manual package assumption.",
    mock: "+£—",
  },
  {
    key: "notice",
    title: "Notice pay / PILON",
    teaser: "Model notice period or pay in lieu separately from statutory redundancy.",
    mock: "£—",
  },
  {
    key: "holiday",
    title: "Holiday & final pay",
    teaser: "See accrued holiday and other final pay components in the model.",
    mock: "£—",
  },
  {
    key: "tax",
    title: "Tax-sensitive split",
    teaser: "Separate package components for modelling clarity. Not tax advice.",
    mock: "—",
  },
  {
    key: "bridge",
    title: "Payout to runway",
    teaser: "See how the package feeds into starting capital and estimated runway.",
    mock: "— mo",
  },
] as const;

interface LockedPackagePreviewGridProps {
  inputs: RunwayInputs;
  onUnlock?: () => void;
}

export function LockedPackagePreviewGrid({ inputs, onUnlock }: LockedPackagePreviewGridProps) {
  const [, navigate] = useLocation();
  const data = buildPackageDashboardData(inputs);
  const statutory = data.estimate.statutoryRedundancy;

  const handleUnlock = () => {
    if (onUnlock) onUnlock();
    else navigate("/unlock");
  };

  return (
    <section className="space-y-4" data-testid="locked-package-preview-grid">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <h2 className="text-base font-semibold">Wider package intelligence — locked</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Your estimated statutory redundancy is {formatGBP(statutory)} under the assumptions entered.
          Unlock the full report to model the wider package and see how it may affect your runway.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {LOCKED_CARDS.map((card) => (
          <div
            key={card.key}
            className="relative rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            <div className="p-4">
              <p className="text-sm font-semibold text-primary mb-1">{card.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{card.teaser}</p>
              <p className="text-xl font-bold text-primary/40 tabular-nums blur-[5px] select-none pointer-events-none">
                {card.mock}
              </p>
            </div>
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-600/80" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <Button className="btn-gold" onClick={handleUnlock} data-testid="button-locked-package-unlock">
          {PRODUCT_COPY.unlockHeadline}
        </Button>
      </div>
    </section>
  );
}
