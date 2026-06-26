import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ALTERNATIVE_ROLE_DISCLAIMER } from "@shared/complianceCopy";
import type { PositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { getSessionToken } from "@/lib/sessionToken";
import { PositionModulePanel } from "./PositionModulePanel";

const STORAGE_KEY_PREFIX = "position-prep-";

interface AlternativeRoleState {
  currentRole: string;
  skills: string;
  location: string;
  salaryRange: string;
  departments: string;
  willingToRetrain: boolean;
  remoteHybrid: string;
}

const DEFAULT_STATE: AlternativeRoleState = {
  currentRole: "",
  skills: "",
  location: "",
  salaryRange: "",
  departments: "",
  willingToRetrain: false,
  remoteHybrid: "",
};

interface AlternativeRoleFinderProps {
  data: PositionEnhancementData;
}

export function AlternativeRoleFinder({ data }: AlternativeRoleFinderProps) {
  const [state, setState] = useState<AlternativeRoleState>(DEFAULT_STATE);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${getSessionToken()}`);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${getSessionToken()}`, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const update = <K extends keyof AlternativeRoleState>(key: K, value: AlternativeRoleState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PositionModulePanel
      title="Alternative Role Finder"
      subtitle="Prepare for redeployment or suitable alternative role conversations."
      testId="module-alternative-roles"
      disclaimer={ALTERNATIVE_ROLE_DISCLAIMER}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="current-role" className="text-xs">
            Current role
          </Label>
          <Input id="current-role" value={state.currentRole} onChange={(e) => update("currentRole", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="location" className="text-xs">
            Preferred location / flexibility
          </Label>
          <Input id="location" value={state.location} onChange={(e) => update("location", e.target.value)} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="skills" className="text-xs">
            Skills
          </Label>
          <Textarea id="skills" value={state.skills} onChange={(e) => update("skills", e.target.value)} className="mt-1 min-h-[60px]" />
        </div>
        <div>
          <Label htmlFor="salary" className="text-xs">
            Salary range
          </Label>
          <Input id="salary" value={state.salaryRange} onChange={(e) => update("salaryRange", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="departments" className="text-xs">
            Internal departments of interest
          </Label>
          <Input id="departments" value={state.departments} onChange={(e) => update("departments", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="remote" className="text-xs">
            Remote / hybrid flexibility
          </Label>
          <Input id="remote" value={state.remoteHybrid} onChange={(e) => update("remoteHybrid", e.target.value)} className="mt-1" />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox checked={state.willingToRetrain} onCheckedChange={(v) => update("willingToRetrain", v === true)} />
          Willing to retrain
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-primary mb-2">Internal role search checklist</p>
          <ul className="space-y-1.5">
            {data.alternativeRoleChecklist.map((item) => (
              <li key={item} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-primary mb-2">Questions to ask about alternative roles</p>
          <ul className="space-y-1.5">
            {data.alternativeRoleQuestions.map((q) => (
              <li key={q} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0">·</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PositionModulePanel>
  );
}

// re-export for email module - actually email is separate file
