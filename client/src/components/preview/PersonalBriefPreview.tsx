import { useMemo } from "react";
import { useLocation } from "wouter";
import type { RunwayInputs } from "@shared/schema";
import { FileText, Lock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildBriefPreviewOpener } from "@/lib/preview/buildBriefPreviewOpener";
import { RUNWAY_BRIEF_NAME, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";

interface PersonalBriefPreviewProps {
  inputs: RunwayInputs;
}

export function PersonalBriefPreview({ inputs }: PersonalBriefPreviewProps) {
  const [, navigate] = useLocation();
  const { lead, detail } = useMemo(() => buildBriefPreviewOpener(inputs), [inputs]);

  return (
    <Card className="border-gold/25 overflow-hidden" data-testid="card-personal-brief-preview">
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b bg-primary/5">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-primary">Your {RUNWAY_BRIEF_NAME} — preview</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Generated from your assumptions. Unlock for the full plain-English report.
          </p>
        </div>
        <div className="relative bg-white">
          <div className="p-5 space-y-3">
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">{lead}</p>
            <p className="text-sm text-muted-foreground leading-relaxed blur-[4px] select-none pointer-events-none" aria-hidden>
              {detail} Month-by-month capital paths, slow and severe recovery cases, and sensitivity rankings are included in the paid report…
            </p>
            <div className="rounded-lg border border-slate-200 p-3 blur-[5px] select-none pointer-events-none space-y-2" aria-hidden>
              <p className="text-xs text-muted-foreground">Scenario comparison</p>
              <div className="h-2 rounded-full bg-slate-100 w-full" />
              <div className="h-2 rounded-full bg-slate-100 w-4/5" />
              <div className="h-2 rounded-full bg-slate-100 w-3/5" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-1/3 flex flex-col items-center justify-end gap-2 bg-gradient-to-t from-white via-white/95 to-transparent pb-5 px-5">
            <Lock className="w-4 h-4 text-primary" />
            <p className="text-xs text-center text-muted-foreground max-w-xs">
              Unlock to read your full brief and download it with the report
            </p>
            <Button size="sm" className="btn-gold" onClick={() => navigate("/unlock")} data-testid="button-unlock-personal-brief">
              Unlock full report — £{RUNWAY_REPORT_PRICE_GBP}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
