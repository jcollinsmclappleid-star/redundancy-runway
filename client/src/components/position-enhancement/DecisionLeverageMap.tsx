import { LEVERAGE_MAP_DISCLAIMER } from "@shared/complianceCopy";
import type { LeverageMapItem } from "@/lib/position-enhancement/buildPositionEnhancementData";
import type { PositionModuleId } from "@/lib/position-enhancement/situationContext";
import { PositionModulePanel } from "./PositionModulePanel";

const CATEGORY_LABELS = {
  money: "Money leverage",
  time: "Time leverage",
  options: "Options leverage",
  evidence: "Evidence leverage",
} as const;

interface DecisionLeverageMapProps {
  items: LeverageMapItem[];
  onNavigate: (target: LeverageMapItem["actionTarget"]) => void;
}

export function DecisionLeverageMap({ items, onNavigate }: DecisionLeverageMapProps) {
  const categories = ["money", "time", "options", "evidence"] as const;

  return (
    <PositionModulePanel
      title="Decision Leverage Map"
      subtitle="See what could improve your position across money, time, options and evidence."
      testId="module-leverage-map"
      disclaimer={LEVERAGE_MAP_DISCLAIMER}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          return (
            <div key={cat} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-primary mb-3">{CATEGORY_LABELS[cat]}</p>
              <div className="space-y-3">
                {catItems.map((item) => (
                  <button
                    key={item.itemKey}
                    type="button"
                    className="w-full text-left rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 hover:bg-slate-100/80 transition-colors"
                    onClick={() => onNavigate(item.actionTarget)}
                  >
                    <p className="text-xs font-semibold text-foreground mb-0.5">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mb-1">{item.currentStatus}</p>
                    <p className="text-[10px] text-primary">{item.improvementOpportunity}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PositionModulePanel>
  );
}

export type { PositionModuleId };
