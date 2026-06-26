import { useMemo } from "react";
import type { RunwayInputs } from "@shared/schema";
import type { BriefDocument } from "@/lib/private-runway-brief/briefDocumentTypes";
import { buildPositionEnhancementData } from "@/lib/position-enhancement/buildPositionEnhancementData";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import {
  POSITION_ENHANCEMENT_DISCLAIMER,
  ROLE_PROTECTION_DISCLAIMER,
  SELECTION_CRITERIA_DISCLAIMER,
  EMAIL_TEMPLATE_DISCLAIMER,
} from "@shared/complianceCopy";
import {
  PACKAGE_VERIFICATION_CHECKLIST,
  POSITION_PLAYBOOK_INTRO,
  POSITION_SITUATION_FOCUS,
} from "@shared/briefCopy";
import {
  EVIDENCE_PACK_ITEMS,
  ROLE_PROTECTION_SECTIONS,
  SELECTION_CRITERIA,
  ALTERNATIVE_ROLE_QUESTIONS,
  ALTERNATIVE_ROLE_CHECKLIST,
  PACKAGE_CLARIFICATION_EMAIL,
} from "@shared/positionEnhancementCopy";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatGBP } from "@/lib/engine";
import { BriefConsultationPlaybook } from "./BriefConsultationPlaybook";
import { BriefReportLayer } from "./BriefReportLayer";
import { BriefProtectionMeasuresPanel } from "./BriefProtectionMeasuresPanel";

interface BriefPositionPlaybookProps {
  inputs: RunwayInputs;
  document: BriefDocument;
}

const MAXIMISER_BUCKET_LABELS: Record<string, string> = {
  alreadyIncluded: "Already included in your model",
  notYetIncluded: "Not yet included — could affect the total",
  couldIncreaseTotal: "Could increase the package total if confirmed",
  needsChecking: "Needs checking with HR or payroll",
  highValueToClarify: "High-value lines to clarify",
};

export function BriefPositionPlaybook({ inputs, document }: BriefPositionPlaybookProps) {
  const data = useMemo(() => buildPositionEnhancementData(inputs), [inputs]);
  const focusAreas = POSITION_SITUATION_FOCUS[document.situationType];
  const missingKeys = new Set(data.missingMoney.map((m) => m.itemKey));

  const flaggedChecklist = PACKAGE_VERIFICATION_CHECKLIST.map((item) => {
    const flagged =
      missingKeys.has(item.itemKey) ||
      missingKeys.has(item.itemKey === "wages" ? "wages" : item.itemKey) ||
      data.briefSummary.missingMoneyKeys.some((k) => item.itemKey.includes(k) || k.includes(item.itemKey));
    return { ...item, flagged };
  });

  return (
    <div className="space-y-4" data-testid="brief-position-playbook">
      <BriefReportLayer
        layerId="position-focus"
        title="Your position focus areas"
        subtitle="Priorities for your situation — preparation support, not advice."
        priority="high"
        defaultOpen={document.situationType === "at_risk"}
        testId="brief-position-focus"
      >
        <ul className="space-y-2">
          {focusAreas.map((area) => (
            <li key={area} className="text-sm text-foreground/85 leading-relaxed flex gap-2">
              <span className="text-gold shrink-0">▸</span>
              {area}
            </li>
          ))}
        </ul>
      </BriefReportLayer>

      <BriefProtectionMeasuresPanel inputs={inputs} document={document} />

      <BriefReportLayer
        layerId="package-verification"
        title="Package verification checklist"
        subtitle={POSITION_PLAYBOOK_INTRO.package}
        testId="brief-package-verification"
        priority="reference"
        badge={`${flaggedChecklist.filter((i) => i.flagged).length} flagged`}
        footer={POSITION_ENHANCEMENT_DISCLAIMER}
      >
        <div className="space-y-3">
          {flaggedChecklist.map((item) => (
            <div
              key={item.itemKey}
              className={`rounded-lg border px-4 py-3 text-xs ${
                item.flagged ? "border-amber-300/80 bg-amber-50/50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-primary">{item.label}</p>
                {item.flagged && (
                  <span className="text-[10px] uppercase tracking-wide text-amber-800 shrink-0">Flagged in model</span>
                )}
              </div>
              <p className="text-foreground/85 leading-relaxed mb-1">{item.whatToConfirm}</p>
              <p className="text-muted-foreground text-[10px]">Where to check: {item.whereToCheck}</p>
            </div>
          ))}
        </div>
      </BriefReportLayer>

      <BriefReportLayer
        layerId="maximiser-components"
        title="Component breakdown"
        subtitle="What's included, what could increase the total, and what needs checking."
        priority="normal"
        defaultOpen={false}
        testId="brief-maximiser-full"
      >
        <div className="space-y-5">
          {Object.entries(data.maximiser).map(([bucket, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={bucket}>
                <p className="text-xs font-semibold text-primary mb-2">
                  {MAXIMISER_BUCKET_LABELS[bucket] ?? bucket}
                </p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.itemKey} className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs">
                      <div className="flex justify-between gap-2 mb-0.5">
                        <span className="font-medium">{item.label}</span>
                        {item.amount != null && item.amount > 0 && (
                          <span className="tabular-nums font-semibold shrink-0">{formatGBP(item.amount)}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </BriefReportLayer>

      {data.missingMoney.filter((m) => m.status === "missing" || m.status === "unclear").length > 0 && (
        <BriefReportLayer layerId="missing-money" title="Missing money checklist" subtitle="Items to confirm against payroll and HR." priority="normal" defaultOpen={false}>
          <ul className="space-y-2">
            {data.missingMoney.map((item) => (
              <li
                key={item.itemKey}
                className={`rounded-lg border px-3 py-2.5 text-xs ${
                  item.status === "included"
                    ? "border-emerald-200/70 bg-emerald-50/40"
                    : item.status === "not_applicable"
                      ? "border-slate-200 bg-slate-50/50 opacity-75"
                      : "border-amber-200/70 bg-amber-50/40"
                }`}
              >
                <p className="font-medium text-foreground">
                  {item.label}{" "}
                  <span className="font-normal text-muted-foreground capitalize">({item.status.replace("_", " ")})</span>
                </p>
                <p className="text-muted-foreground mt-1 leading-relaxed">{item.whyItMatters}</p>
                <p className="text-[10px] text-muted-foreground/80 mt-1">Where to check: {item.whereToCheck}</p>
              </li>
            ))}
          </ul>
        </BriefReportLayer>
      )}

      {document.position.showConsultation && (
        <>
          <DashboardPanel
            title="Role protection planner"
            subtitle={POSITION_PLAYBOOK_INTRO.roleProtection}
            footer={ROLE_PROTECTION_DISCLAIMER}
            testId="brief-role-protection"
          >
            <Accordion type="multiple" className="space-y-2">
              {ROLE_PROTECTION_SECTIONS.map((section) => (
                <AccordionItem key={section.sectionKey} value={section.sectionKey} className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3 hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-2">
                      {section.actions.map((action) => (
                        <li key={action} className="text-xs text-foreground/85 pl-3 border-l-2 border-gold/30 leading-relaxed">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DashboardPanel>

          <DashboardPanel
            title="Evidence pack checklist"
            subtitle="Documents and notes that may support consultation preparation."
            testId="brief-evidence-pack"
          >
            <ul className="grid sm:grid-cols-2 gap-2">
              {EVIDENCE_PACK_ITEMS.map((item) => (
                <li key={item} className="text-xs text-foreground/85 flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </DashboardPanel>

          <DashboardPanel
            title="Selection criteria preparation"
            subtitle={POSITION_PLAYBOOK_INTRO.selection}
            footer={SELECTION_CRITERIA_DISCLAIMER}
            testId="brief-selection-criteria"
          >
            <div className="space-y-3">
              {SELECTION_CRITERIA.map((c) => (
                <div key={c.criteriaKey} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs">
                  <p className="font-semibold text-primary mb-1">{c.label}</p>
                  <p className="text-muted-foreground mb-2 leading-relaxed">{c.evidence}</p>
                  <p className="text-foreground/85 italic border-l-2 border-gold/30 pl-3">{c.question}</p>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Alternative role finder" subtitle="Redeployment and internal mobility preparation.">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-primary mb-2">Questions to ask</p>
                <ul className="space-y-2">
                  {ALTERNATIVE_ROLE_QUESTIONS.map((q) => (
                    <li key={q} className="text-xs text-foreground/85 pl-3 border-l-2 border-gold/30 leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary mb-2">Checklist</p>
                <ul className="space-y-2">
                  {ALTERNATIVE_ROLE_CHECKLIST.map((item) => (
                    <li key={item} className="text-xs text-foreground/85 flex gap-2">
                      <span className="text-gold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DashboardPanel>

          <BriefConsultationPlaybook document={document} />
        </>
      )}

      <DashboardPanel
        title="Email templates"
        subtitle="Draft wording for HR — edit before sending."
        footer={EMAIL_TEMPLATE_DISCLAIMER}
        testId="brief-email-templates"
      >
        <div className="space-y-4">
          {(["package", "consultation"] as const)
            .filter((key) => key !== "consultation" || document.position.showConsultation)
            .map((key) => (
              <div key={key} className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold text-primary mb-2">{PACKAGE_CLARIFICATION_EMAIL[key].subject}</p>
                <pre className="text-[11px] text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">
                  {PACKAGE_CLARIFICATION_EMAIL[key].body}
                </pre>
              </div>
            ))}
        </div>
      </DashboardPanel>
    </div>
  );
}
