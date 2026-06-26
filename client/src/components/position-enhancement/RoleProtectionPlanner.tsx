import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ROLE_PROTECTION_DISCLAIMER } from "@shared/complianceCopy";
import type { PositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { PositionModulePanel } from "./PositionModulePanel";

interface RoleProtectionPlannerProps {
  data: PositionEnhancementData;
}

export function RoleProtectionPlanner({ data }: RoleProtectionPlannerProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <PositionModulePanel
      title="Role Protection Planner"
      subtitle="Prepare practical steps that may strengthen your position before redundancy decisions are final."
      testId="module-role-protection"
      disclaimer={ROLE_PROTECTION_DISCLAIMER}
    >
      <div className="space-y-5">
        {data.roleProtectionSections.map((section) => (
          <div key={section.sectionKey}>
            <p className="text-sm font-semibold text-primary mb-2">{section.title}</p>
            <div className="space-y-2">
              {section.actions.map((action) => {
                const key = `${section.sectionKey}-${action}`;
                return (
                  <label key={key} className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox
                      checked={checked[key] ?? false}
                      onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [key]: v === true }))}
                    />
                    {action}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PositionModulePanel>
  );
}
