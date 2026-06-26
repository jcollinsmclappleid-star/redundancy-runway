import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import type { BriefNarrativeLite } from "@/lib/private-runway-brief/briefDocumentTypes";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import { buildBriefDocument, legacyNarrativeToLite, buildTemplateNarrativeForPanels } from "@/lib/private-runway-brief/buildBriefDocument";
import { BRIEF_SECTION_IDS } from "@/lib/private-runway-brief/briefDocumentTypes";
import { useMemo } from "react";
import { PrintFriendlyBrief } from "./PrintFriendlyBrief";
import { RunwayBriefHero } from "./RunwayBriefHero";
import { BriefReportShell } from "./BriefReportShell";
import { BriefSection } from "./BriefSection";
import { StructuredExecutiveSummary } from "./StructuredExecutiveSummary";
import { BriefPackageGuidesPanel } from "./BriefPackageGuidesPanel";
import { BriefPositionPlaybook } from "./BriefPositionPlaybook";
import { BriefQuestionsForwardPanel } from "./BriefQuestionsForwardPanel";
import { BriefMaximiserPanel } from "./BriefMaximiserPanel";
import { BriefDemoLockedSections } from "./BriefDemoLockedSections";
import { RedundancyPackageDashboard } from "@/components/package-dashboard/RedundancyPackageDashboard";
import { RunwayBriefMetricGrid } from "./RunwayBriefMetricGrid";
import { BriefRunwayPathDashboard } from "./BriefRunwayPathDashboard";
import { ScenarioRangeDashboard } from "./ScenarioRangeDashboard";
import { MonthlyPressureMap } from "./MonthlyPressureMap";
import { SensitivityDriversPanel } from "./SensitivityDriversPanel";
import { AssumptionQualityPanel } from "./AssumptionQualityPanel";
import { BriefResetCta } from "./BriefResetCta";
import { RunwayReportBrand } from "@/components/RunwayReportBrand";
import { DashboardPanel } from "@/components/dashboards/dashboard-panel";
import { RUNWAY_BRIEF_NAME, SITE_URL, REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";
import { BRIEF_GLOSSARY, BRIEF_METHODOLOGY } from "@shared/briefCopy";
import { PRIVATE_RUNWAY_BRIEF_DISCLAIMER } from "@/lib/private-runway-brief/types";

interface StructuredBriefReportProps {
  inputs: RunwayInputs;
  narrative?: PrivateRunwayBriefNarrative | null;
  narrativeLite?: BriefNarrativeLite | null;
  reportId?: string;
  demoMode?: boolean;
}

function resolveNarrativeLite(
  narrative?: PrivateRunwayBriefNarrative | null,
  narrativeLite?: BriefNarrativeLite | null,
): BriefNarrativeLite | undefined {
  if (narrativeLite) return narrativeLite;
  if (narrative?.executiveSummary) return legacyNarrativeToLite(narrative);
  return undefined;
}

export function StructuredBriefReport({
  inputs,
  narrative,
  narrativeLite,
  reportId = "private-runway-brief-report",
  demoMode = false,
}: StructuredBriefReportProps) {
  const dashboard = buildBriefDashboardData(inputs);
  const lite = resolveNarrativeLite(narrative, narrativeLite);

  const document = useMemo(
    () =>
      buildBriefDocument(inputs, {
        narrativeLite: lite,
        generatedAt: narrative?.generatedAt ?? lite?.generatedAt,
      }),
    [inputs, lite, narrative?.generatedAt],
  );

  const panelNarrative = useMemo(() => {
    if (narrative?.runwayRangeCommentary?.scenarioComments?.length) return narrative;
    return buildTemplateNarrativeForPanels(inputs, document, dashboard);
  }, [narrative, inputs, document, dashboard]);

  return (
    <PrintFriendlyBrief narrative={panelNarrative}>
      <div
        id={reportId}
        className="rounded-xl overflow-hidden border border-gold/25 shadow-lg print:shadow-none print:border-0"
      >
        <RunwayBriefHero narrative={panelNarrative} dashboard={dashboard} />

        <div className="bg-[hsl(40_30%_98%)] rounded-b-xl px-4 sm:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            <BriefReportShell document={document} reportId={reportId} demoMode={demoMode}>
              <BriefSection
                id={BRIEF_SECTION_IDS.executive}
                number="1"
                title="Executive summary"
                subtitle="Key findings from your assumptions"
              >
                <StructuredExecutiveSummary document={document} dashboard={dashboard} inputs={inputs} />
              </BriefSection>

              <BriefSection
                id={BRIEF_SECTION_IDS.package}
                number="2"
                title="Your redundancy package"
                subtitle={`${REDUNDANCY_PAY_MAXIMISER_NAME}, breakdown and component guidance`}
              >
                <BriefMaximiserPanel inputs={inputs} locked={demoMode} />
                <RedundancyPackageDashboard inputs={inputs} compact />
                {!demoMode && <BriefPackageGuidesPanel document={document} />}
              </BriefSection>

              {demoMode ? (
                <BriefDemoLockedSections />
              ) : (
                <>
              <BriefSection
                id={BRIEF_SECTION_IDS.months}
                number="3"
                title="How long the money may last"
                subtitle="Months on household costs and capital path"
              >
                <RunwayBriefMetricGrid dashboard={dashboard} />
                <BriefRunwayPathDashboard
                  dashboard={dashboard}
                  commentary={document.scenarioReadingGuide}
                />
                <ScenarioRangeDashboard dashboard={dashboard} narrative={panelNarrative} />
                <MonthlyPressureMap dashboard={dashboard} narrative={panelNarrative} />
              </BriefSection>

              <BriefSection
                id={BRIEF_SECTION_IDS.position}
                number="4"
                title="Improve your position"
                subtitle="Protection measures, verification and preparation playbooks"
              >
                <BriefPositionPlaybook inputs={inputs} document={document} />
              </BriefSection>

              <BriefSection
                id={BRIEF_SECTION_IDS.sensitivity}
                number="5"
                title="Scenarios and sensitivities"
                subtitle="What changes the picture most in this model"
              >
                <SensitivityDriversPanel dashboard={dashboard} narrative={panelNarrative} />
              </BriefSection>

              <BriefSection
                id={BRIEF_SECTION_IDS.assumptions}
                number="6"
                title="Assumptions to verify"
                subtitle="Data quality and gaps in your inputs"
              >
                <AssumptionQualityPanel dashboard={dashboard} narrative={panelNarrative} />
                {document.assumptions.items.length > 0 && (
                  <DashboardPanel title="Priority verification items" testId="brief-assumption-priority">
                    <ul className="space-y-3">
                      {document.assumptions.items.map((item) => (
                        <li key={item.inputKey} className="rounded-lg border border-amber-200/70 bg-amber-50/40 px-3 py-2.5 text-xs">
                          <p className="font-medium text-foreground">
                            {item.label}{" "}
                            <span className="font-normal text-muted-foreground">({item.status})</span>
                          </p>
                          <p className="text-muted-foreground mt-1 leading-relaxed">{item.whyItMatters}</p>
                        </li>
                      ))}
                    </ul>
                  </DashboardPanel>
                )}
              </BriefSection>

              <BriefSection
                id={BRIEF_SECTION_IDS.questions}
                number="7"
                title="Questions to take forward"
                subtitle="Documents, HR questions and professional signposting"
              >
                <BriefQuestionsForwardPanel document={document} />
              </BriefSection>

              <BriefSection
                id={BRIEF_SECTION_IDS.appendix}
                number="A"
                title="Methodology and glossary"
                subtitle="How this report is built"
              >
                <DashboardPanel title="Methodology" testId="brief-methodology">
                  <p className="text-sm text-foreground/85 leading-relaxed">{BRIEF_METHODOLOGY}</p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{document.executive.methodologyNote}</p>
                </DashboardPanel>
                <DashboardPanel title="Glossary" testId="brief-glossary">
                  <dl className="space-y-3">
                    {BRIEF_GLOSSARY.map((entry) => (
                      <div key={entry.term}>
                        <dt className="text-sm font-semibold text-primary">{entry.term}</dt>
                        <dd className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{entry.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </DashboardPanel>
              </BriefSection>

              <BriefResetCta narrative={panelNarrative} />
                </>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gold/20">
                <RunwayReportBrand variant="dark" context="brief" showUrl />
                <p className="text-[10px] text-muted-foreground text-center sm:text-right">
                  {RUNWAY_BRIEF_NAME} v{document.version}
                  <br />
                  <span className="text-muted-foreground/70">{SITE_URL.replace(/^https?:\/\//, "")}</span>
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-4 leading-relaxed">
                {PRIVATE_RUNWAY_BRIEF_DISCLAIMER}
              </p>
            </BriefReportShell>
          </div>
        </div>
      </div>
    </PrintFriendlyBrief>
  );
}
