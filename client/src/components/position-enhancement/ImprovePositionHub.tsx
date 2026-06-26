import { useMemo, useCallback } from "react";
import type { RunwayInputs } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { POSITION_ENHANCEMENT_DISCLAIMER } from "@shared/complianceCopy";
import { REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import type { PositionModuleId } from "@/lib/position-enhancement/situationContext";
import { RedundancyPackageMaximiser } from "./RedundancyPackageMaximiser";
import { MissingMoneyChecklist } from "./MissingMoneyChecklist";
import { PayoutImprovementScenarios } from "./PayoutImprovementScenarios";
import { ConsultationDefencePack } from "./ConsultationDefencePack";
import { RoleProtectionPlanner } from "./RoleProtectionPlanner";
import { SelectionCriteriaPrep } from "./SelectionCriteriaPrep";
import { AlternativeRoleFinder } from "./AlternativeRoleFinder";
import { DecisionLeverageMap } from "./DecisionLeverageMap";
import { PackageClarificationEmail } from "./PackageClarificationEmail";
import { BriefMaximiserPanel } from "@/components/private-runway-brief/BriefMaximiserPanel";
import { LockedPackagePreviewGrid } from "@/components/package-dashboard/LockedPackagePreviewGrid";

const MODULE_TITLES: Record<PositionModuleId, string> = {
  maximiser: REDUNDANCY_PAY_MAXIMISER_NAME,
  "missing-money": "Missing money checklist",
  "payout-scenarios": "Payout improvement scenarios",
  "consultation-defence": "Consultation Defence Pack",
  "role-protection": "Role Protection Planner",
  "selection-criteria": "Selection Criteria Prep",
  "alternative-roles": "Alternative Role Finder",
  "leverage-map": "Decision Leverage Map",
  "clarification-email": "Package clarification email",
};

interface ImprovePositionHubProps {
  inputs: RunwayInputs;
  onOpenTab?: (tab: string) => void;
  demoMode?: boolean;
}

export function ImprovePositionHub({ inputs, onOpenTab, demoMode = false }: ImprovePositionHubProps) {
  const data = useMemo(() => buildPositionEnhancementData(inputs), [inputs]);

  const scrollToModule = useCallback((moduleId: PositionModuleId | string) => {
    if (moduleId.startsWith("tab-")) {
      onOpenTab?.(moduleId.replace("tab-", ""));
      return;
    }
    const el = document.getElementById(`position-module-${moduleId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    const trigger = el?.querySelector<HTMLButtonElement>("[data-state='closed']");
    trigger?.click();
  }, [onOpenTab]);

  const renderModule = (id: PositionModuleId) => {
    switch (id) {
      case "maximiser":
        return <RedundancyPackageMaximiser data={data} />;
      case "missing-money":
        return <MissingMoneyChecklist data={data} />;
      case "payout-scenarios":
        return <PayoutImprovementScenarios inputs={inputs} data={data} />;
      case "consultation-defence":
        return <ConsultationDefencePack data={data} />;
      case "role-protection":
        return <RoleProtectionPlanner data={data} />;
      case "selection-criteria":
        return <SelectionCriteriaPrep data={data} />;
      case "alternative-roles":
        return <AlternativeRoleFinder data={data} />;
      case "leverage-map":
        return <DecisionLeverageMap items={data.leverageMap} onNavigate={scrollToModule} />;
      case "clarification-email":
        return <PackageClarificationEmail />;
      default:
        return null;
    }
  };

  const moduleOrder = data.moduleOrder.filter((id) => id !== "maximiser") as PositionModuleId[];
  const defaultOpen = data.recommendedModuleIds.find((id) => id !== "maximiser") ?? moduleOrder[0];

  if (demoMode) {
    return (
      <section className="mb-8 space-y-4" data-testid="improve-position-hub">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
          <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-1">Improve your position</p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-2">
            Don&apos;t just calculate the minimum. Understand what could improve your redundancy position.
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mb-2">
            Check the package. Prepare the conversation. Protect your runway.
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">{POSITION_ENHANCEMENT_DISCLAIMER}</p>
        </div>
        <LockedPackagePreviewGrid inputs={inputs} />
      </section>
    );
  }

  return (
    <section className="mb-8 space-y-4" data-testid="improve-position-hub">
      <BriefMaximiserPanel inputs={inputs} />

      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-1">Improve your position</p>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-2">
          Don&apos;t just calculate the minimum. Understand what could improve your redundancy position.
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mb-2">
          Check the package. Prepare the conversation. Protect your runway.
        </p>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">{POSITION_ENHANCEMENT_DISCLAIMER}</p>
      </div>

      <Accordion type="single" collapsible defaultValue={defaultOpen} className="space-y-2">
        {moduleOrder.map((moduleId) => {
          const recommended = data.recommendedModuleIds.includes(moduleId);
          return (
            <AccordionItem
              key={moduleId}
              value={moduleId}
              id={`position-module-${moduleId}`}
              className="rounded-xl border px-4 bg-card"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  {MODULE_TITLES[moduleId]}
                  {recommended && (
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      Recommended for your situation
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">{renderModule(moduleId)}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={() => onOpenTab?.("bridge")}>
          Continue to payout-to-runway bridge
        </Button>
        <Button variant="outline" size="sm" onClick={() => onOpenTab?.("brief")}>
          Open Private Brief
        </Button>
      </div>
    </section>
  );
}
