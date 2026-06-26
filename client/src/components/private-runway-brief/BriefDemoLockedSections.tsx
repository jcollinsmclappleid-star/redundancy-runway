import { Link } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_COPY } from "@shared/product";

const LOCKED_SECTIONS = [
  {
    number: "3",
    title: "How long the money may last",
    teaser: "Runway months, capital path, slow and severe scenarios, and month-by-month pressure map.",
  },
    {
      number: "4",
      title: "Improve your position",
      teaser: "Protection measures playbook, package verification, consultation prep, evidence to gather, and email templates.",
    },
  {
    number: "5",
    title: "Scenarios and sensitivities",
    teaser: "What changes the picture most — income recovery, housing pressure and expense sensitivity.",
  },
  {
    number: "6",
    title: "Assumptions to verify",
    teaser: "Priority gaps in your inputs and what to confirm before relying on the model.",
  },
  {
    number: "7",
    title: "Questions to take forward",
    teaser: "Documents to request, HR question banks, and professional signposting for your situation.",
  },
  {
    number: "A",
    title: "Methodology and glossary",
    teaser: "How the report is built and plain-English definitions for every term used.",
  },
] as const;

interface BriefDemoLockedSectionsProps {
  unlockHref?: string;
}

export function BriefDemoLockedSections({ unlockHref = "/unlock" }: BriefDemoLockedSectionsProps) {
  return (
    <div
      id="brief-demo-locked-sections"
      className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white overflow-hidden"
      data-testid="brief-demo-locked-sections"
    >
      <div className="px-4 sm:px-5 py-5 border-b border-amber-100/80">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm font-semibold text-primary">Sections 3–7 included in your full report</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This example shows the executive summary and package snapshot. Unlock with your figures for runway
          dashboards, position playbooks, question banks and the exportable brief.
        </p>
      </div>

      <ul className="divide-y divide-amber-100/80">
        {LOCKED_SECTIONS.map((section) => (
          <li key={section.number} className="px-4 sm:px-5 py-3.5 flex items-start gap-3">
            <span className="text-[10px] font-bold text-amber-700/80 w-5 shrink-0 pt-0.5 tabular-nums">
              {section.number}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary/90">{section.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{section.teaser}</p>
            </div>
            <Lock className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-1" />
          </li>
        ))}
      </ul>

      <div className="px-4 sm:px-5 py-4 bg-white/60 border-t border-amber-100/80 flex flex-wrap items-center gap-3">
        <Link href={unlockHref}>
          <Button size="sm" className="btn-gold" data-testid="button-unlock-brief-sections">
            {PRODUCT_COPY.unlockCta}
          </Button>
        </Link>
        <p className="text-[10px] text-muted-foreground">{PRODUCT_COPY.unlockSupportingLine}</p>
      </div>
    </div>
  );
}
