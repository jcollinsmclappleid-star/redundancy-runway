import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BriefLayerPriority = "hero" | "high" | "normal" | "reference";

interface BriefReportLayerProps {
  layerId: string;
  title: string;
  subtitle?: string;
  badge?: string;
  priority?: BriefLayerPriority;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  footer?: string;
  testId?: string;
}

const PRIORITY_STYLES: Record<BriefLayerPriority, string> = {
  hero: "border-gold/40 bg-gradient-to-br from-white to-amber-50/40 shadow-sm",
  high: "border-gold/25 bg-white",
  normal: "border-slate-200 bg-white",
  reference: "border-slate-200/80 bg-slate-50/30",
};

export function BriefReportLayer({
  layerId,
  title,
  subtitle,
  badge,
  priority = "normal",
  defaultOpen = false,
  children,
  className,
  footer,
  testId,
}: BriefReportLayerProps) {
  if (priority === "hero") {
    return (
      <div
        className={cn("rounded-xl border px-4 sm:px-5 py-5", PRIORITY_STYLES.hero, className)}
        data-testid={testId ?? `brief-layer-${layerId}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-primary">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">{subtitle}</p>}
          </div>
          {badge && (
            <Badge variant="outline" className="text-[10px] shrink-0 bg-gold/10 text-primary border-gold/30">
              {badge}
            </Badge>
          )}
        </div>
        {children}
        {footer && <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed border-t border-gold/15 pt-3">{footer}</p>}
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? layerId : undefined}
      className={cn("brief-report-layer rounded-xl border overflow-hidden print:block", PRIORITY_STYLES[priority], className)}
      data-testid={testId ?? `brief-layer-${layerId}`}
    >
      <AccordionItem value={layerId} className="border-0">
        <AccordionTrigger className="px-4 sm:px-5 py-4 hover:no-underline hover:bg-black/[0.02] print:pointer-events-none [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-100">
          <div className="flex flex-1 items-start justify-between gap-3 text-left pr-2">
            <div>
              <h3 className="text-sm font-semibold text-primary">{title}</h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed font-normal">{subtitle}</p>
              )}
            </div>
            {badge && (
              <Badge variant="outline" className="text-[10px] shrink-0 font-normal">
                {badge}
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 sm:px-5 pb-5 print:block print:h-auto print:overflow-visible">
          {children}
          {footer && <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">{footer}</p>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
