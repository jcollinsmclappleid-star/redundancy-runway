import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { ResultsPageContent } from "@/pages/results";
import { EXAMPLE_RUNWAY_INPUTS } from "@/lib/private-runway-brief/exampleInputs";
import { SAMPLE_PRIVATE_RUNWAY_NARRATIVE } from "@/lib/private-runway-brief/sampleBrief";
import { SAMPLE_EXAMPLE_LABEL } from "@/lib/private-runway-brief/sampleExample";
import { RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP, REDUNDANCY_PAY_MAXIMISER_NAME } from "@shared/product";
import { ArrowRight, FileText } from "lucide-react";

export default function ReportExamplePage() {
  return (
    <>
      <Helmet>
        <title>Example {RUNWAY_REPORT_FULL} — RedundancyCalculatorUK</title>
        <meta
          name="description"
          content={`Sample ${RUNWAY_REPORT_FULL} — interactive dashboards, improve-your-position tools and Private Brief. Illustrative only.`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <header className="border-b px-6 py-4 print:hidden">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <Logo showTagline />
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/brief-example">
                <Button variant="outline" size="sm">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Example brief only
                </Button>
              </Link>
              <Link href="/unlock">
                <Button size="sm" className="btn-gold">
                  Unlock with your figures — £{RUNWAY_REPORT_PRICE_GBP}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <p className="text-xs text-center text-amber-800 bg-amber-50 border-b border-amber-200 px-4 py-2 print:hidden">
          {SAMPLE_EXAMPLE_LABEL} Includes the {REDUNDANCY_PAY_MAXIMISER_NAME} in Improve your position — unlock full ranked opportunities and dashboards with your figures.
        </p>
        <div className="flex-1">
          <ResultsPageContent
            isDemo
            overrideInputs={EXAMPLE_RUNWAY_INPUTS}
            demoBriefNarrative={SAMPLE_PRIVATE_RUNWAY_NARRATIVE}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}
