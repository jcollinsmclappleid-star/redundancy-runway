import type { RunwayInputs } from "@shared/schema";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPackageDashboardData } from "@/lib/package-dashboard/buildPackageDashboardData";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { formatGBP } from "@/lib/engine";
import { PRODUCT_COPY, REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";

interface LockedPackagePreviewGridProps {
  inputs: RunwayInputs;
  onUnlock?: () => void;
}

export function LockedPackagePreviewGrid({ inputs, onUnlock }: LockedPackagePreviewGridProps) {
  const [, navigate] = useLocation();
  const data = buildPackageDashboardData(inputs);
  const position = buildPositionEnhancementData(inputs);
  const statutory = data.estimate.statutoryRedundancy;
  const missingCount = position.missingMoney.filter((m) => m.status === "missing").length;

  const lockedCards = [
    {
      key: "protection-measures",
      title: "Protection measures playbook",
      teaser:
        "Deep preparation pillars for your situation — visibility, consultation records, selection evidence, redeployment and runway.",
      value: "8 pillars",
    },
    {
      key: "maximiser",
      title: REDUNDANCY_PAY_MAXIMISER_NAME,
      teaser:
        "Maps statutory, notice, holiday, enhanced pay and more — what's included, what could increase the total, and what to clarify with HR.",
      value: position.maximiserPreview.blurredTeaser,
    },
    {
      key: "missing-money",
      title: "Missing money checklist",
      teaser: "Common package components people forget to include in their model.",
      value: missingCount > 0 ? `${missingCount} to check` : "Review items",
    },
    {
      key: "payout-scenarios",
      title: "Payout improvement scenarios",
      teaser: "Model how different package outcomes could change your runway.",
      value: formatGBP(data.packageTotal),
    },
    {
      key: "consultation",
      title: "Consultation Defence Pack",
      teaser: "Prepare questions and evidence before decisions are final.",
      value: `${position.consultationSections.length} sections`,
    },
    {
      key: "role-protection",
      title: "Role Protection Planner",
      teaser: "Practical steps that may strengthen your position before redundancy decisions.",
      value: `${position.roleProtectionSections.length} areas`,
    },
    {
      key: "leverage-map",
      title: "Decision Leverage Map",
      teaser: "See improvement opportunities across money, time, options and evidence.",
      value: `${position.leverageMap.length} levers`,
    },
  ] as const;

  const handleUnlock = () => {
    if (onUnlock) onUnlock();
    else navigate("/unlock");
  };

  return (
    <section className="space-y-4" data-testid="locked-package-preview-grid">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <h2 className="text-base font-semibold">{PRODUCT_COPY.unlockHeadline}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{PRODUCT_COPY.unlockSubcopy}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Your estimated statutory redundancy is {formatGBP(statutory)} under the assumptions entered.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {lockedCards.map((card) => (
          <div
            key={card.key}
            className="relative rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center pointer-events-none">
              <Lock className="w-3.5 h-3.5 text-amber-600" aria-hidden />
            </div>
            <div className="p-4 pr-12">
              <p className="text-sm font-semibold text-primary mb-1">{card.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{card.teaser}</p>
              <p
                className="text-xl font-bold text-primary tabular-nums blur-[5px] select-none pointer-events-none"
                data-testid={`locked-value-${card.key}`}
                aria-hidden
              >
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2 space-y-2">
        <Button className="btn-gold" onClick={handleUnlock} data-testid="button-locked-package-unlock">
          {PRODUCT_COPY.unlockCta}
        </Button>
        <p className="text-xs text-muted-foreground">{PRODUCT_COPY.unlockSupportingLine}</p>
      </div>
    </section>
  );
}
