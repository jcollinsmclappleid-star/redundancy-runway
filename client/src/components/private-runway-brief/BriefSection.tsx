import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BriefSectionProps {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function BriefSection({ id, number, title, subtitle, children, className }: BriefSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28 break-inside-avoid", className)}
      data-testid={`brief-section-${id}`}
    >
      <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gold/25">
        <span className="shrink-0 w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold font-display">
          {number}
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-primary leading-snug">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
