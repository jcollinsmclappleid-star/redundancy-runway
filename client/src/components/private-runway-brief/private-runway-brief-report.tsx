import type { RunwayInputs } from "@shared/schema";
import type { PrivateRunwayBriefNarrative } from "@/lib/private-runway-brief/types";
import { buildBriefDashboardData } from "@/lib/private-runway-brief/buildBriefDashboardData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RunwayBriefHero } from "./RunwayBriefHero";
import { RunwayBriefMetricGrid } from "./RunwayBriefMetricGrid";
import { BriefRunwayPathDashboard } from "./BriefRunwayPathDashboard";
import { ExecutiveSummaryPanel } from "./ExecutiveSummaryPanel";
import { ScenarioRangeDashboard } from "./ScenarioRangeDashboard";
import { CapitalCompositionDashboard } from "./CapitalCompositionDashboard";
import { MonthlyPressureMap } from "./MonthlyPressureMap";
import { SensitivityDriversPanel } from "./SensitivityDriversPanel";
import { AssumptionQualityPanel } from "./AssumptionQualityPanel";
import { ProfessionalQuestionsPanel } from "./ProfessionalQuestionsPanel";
import { BriefResetCta } from "./BriefResetCta";
import { PrintFriendlyBrief } from "./PrintFriendlyBrief";
import { RunwayReportBrand } from "@/components/RunwayReportBrand";
import { RedundancyPackageDashboard } from "@/components/package-dashboard/RedundancyPackageDashboard";
import { PackageCompletenessScore } from "@/components/package-dashboard/PackageCompletenessScore";
import { RedundancyOfferComparisonDashboard } from "@/components/package-dashboard/RedundancyOfferComparisonDashboard";
import { TaxSensitiveComponentsDashboard } from "@/components/package-dashboard/TaxSensitiveComponentsDashboard";
import { PackageChecksDashboard } from "@/components/package-dashboard/PackageChecksDashboard";
import { PackageCommentaryPanel } from "./PackageCommentaryPanel";
import { RUNWAY_BRIEF_NAME, SITE_URL } from "@shared/product";

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-6" />;
}

interface PrivateRunwayBriefReportProps {
  inputs: RunwayInputs;
  narrative: PrivateRunwayBriefNarrative;
  reportId?: string;
}

export function PrivateRunwayBriefReport({
  inputs,
  narrative,
  reportId = "private-runway-brief-report",
}: PrivateRunwayBriefReportProps) {
  const dashboard = buildBriefDashboardData(inputs);

  const detailSections = (
    <>
      <ScenarioRangeDashboard dashboard={dashboard} narrative={narrative} />
      <SectionDivider />
      <SensitivityDriversPanel dashboard={dashboard} narrative={narrative} />
      <SectionDivider />
      <AssumptionQualityPanel dashboard={dashboard} narrative={narrative} />
      <SectionDivider />
      <ProfessionalQuestionsPanel narrative={narrative} />
    </>
  );

  return (
    <PrintFriendlyBrief narrative={narrative}>
      <div
        id={reportId}
        className="rounded-xl overflow-hidden border border-gold/25 shadow-lg print:shadow-none print:border-0"
      >
        <RunwayBriefHero narrative={narrative} dashboard={dashboard} />

        <div className="bg-[hsl(40_30%_98%)] rounded-b-xl">
          <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto space-y-6">
            <section className="break-inside-avoid" data-testid="brief-section-package">
              <RedundancyPackageDashboard inputs={inputs} compact />
            </section>

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-completeness">
              <PackageCompletenessScore inputs={inputs} />
            </section>

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-package-commentary">
              <PackageCommentaryPanel inputs={inputs} narrative={narrative} />
            </section>

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-offer-comparison">
              <RedundancyOfferComparisonDashboard inputs={inputs} />
            </section>

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-tax-sensitive">
              <TaxSensitiveComponentsDashboard inputs={inputs} />
            </section>

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-package-checks">
              <PackageChecksDashboard inputs={inputs} />
            </section>

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-metrics">
              <RunwayBriefMetricGrid dashboard={dashboard} />
            </section>

            <SectionDivider />

            <CapitalCompositionDashboard dashboard={dashboard} narrative={narrative} />

            <SectionDivider />

            <ExecutiveSummaryPanel narrative={narrative} dashboard={dashboard} />

            <SectionDivider />

            <section className="break-inside-avoid" data-testid="brief-section-path-chart">
              <BriefRunwayPathDashboard
                dashboard={dashboard}
                commentary={narrative.runwayRangeCommentary.summary}
              />
            </section>

            <SectionDivider />

            <MonthlyPressureMap dashboard={dashboard} narrative={narrative} />

            <SectionDivider />

            {/* Desktop: remaining detail sections */}
            <div className="hidden md:block space-y-6">{detailSections}</div>

            {/* Mobile: accordions for longer sections */}
            <div className="md:hidden">
              <Accordion type="multiple" defaultValue={["scenarios", "sensitivity"]} className="space-y-2">
                <AccordionItem value="scenarios" className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3">
                    Stress scenarios
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ScenarioRangeDashboard dashboard={dashboard} narrative={narrative} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="capital" className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3">
                    Capital composition
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <CapitalCompositionDashboard dashboard={dashboard} narrative={narrative} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pressure" className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3">
                    Monthly pressure map
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <MonthlyPressureMap dashboard={dashboard} narrative={narrative} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sensitivity" className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3">
                    Sensitivity drivers
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <SensitivityDriversPanel dashboard={dashboard} narrative={narrative} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="assumptions" className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3">
                    Assumptions to verify
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <AssumptionQualityPanel dashboard={dashboard} narrative={narrative} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="questions" className="border border-gold/15 rounded-xl bg-white px-4">
                  <AccordionTrigger className="text-sm font-semibold text-primary py-3">
                    Questions to take forward
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ProfessionalQuestionsPanel narrative={narrative} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <SectionDivider />

            <BriefResetCta narrative={narrative} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gold/20">
              <RunwayReportBrand variant="dark" context="brief" showUrl />
              <p className="text-[10px] text-muted-foreground text-center sm:text-right">
                {RUNWAY_BRIEF_NAME}
                <br />
                <span className="text-muted-foreground/70">{SITE_URL.replace(/^https?:\/\//, "")}</span>
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-4 leading-relaxed">
              {narrative.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </PrintFriendlyBrief>
  );
}
