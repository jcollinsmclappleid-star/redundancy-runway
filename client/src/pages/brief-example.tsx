import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { PrivateRunwayBriefReport } from "@/components/private-runway-brief/private-runway-brief-report";
import { SAMPLE_PRIVATE_RUNWAY_NARRATIVE } from "@/lib/private-runway-brief/sampleBrief";
import { EXAMPLE_RUNWAY_INPUTS } from "@/lib/private-runway-brief/exampleInputs";
import { SAMPLE_EXAMPLE_LABEL } from "@/lib/private-runway-brief/sampleExample";
import { SITE_URL } from "@shared/site";
import { RUNWAY_BRIEF_NAME, RUNWAY_REPORT_FULL } from "@shared/product";
import { ArrowRight } from "lucide-react";

export default function BriefExamplePage() {
  return (
    <>
      <Helmet>
        <title>{RUNWAY_BRIEF_NAME} — Example | RedundancyCalculatorUK</title>
        <meta name="description" content={`Example ${RUNWAY_BRIEF_NAME} — plain-English report from the ${RUNWAY_REPORT_FULL}. Illustrative sample only.`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/brief-example`} />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <DisclaimerBanner />
        <header className="border-b px-6 py-4 print:hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <Logo showTagline />
            <Link href="/unlock">
              <Button size="sm" className="btn-gold">
                Unlock full report — £39
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 py-8 max-w-5xl mx-auto w-full">
          <p className="text-xs text-center text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4 print:hidden">
            {SAMPLE_EXAMPLE_LABEL} Included with the {RUNWAY_REPORT_FULL} (£39).
          </p>
          <p className="text-center text-sm text-muted-foreground mb-6 print:hidden">
            <a
              href="/example-private-runway-brief.txt"
              download
              className="text-primary underline font-medium"
            >
              Download example as plain text
            </a>
            {" · "}
            <a href="/example-private-runway-brief.json" download className="text-primary underline font-medium">
              JSON
            </a>
          </p>
          <PrivateRunwayBriefReport inputs={EXAMPLE_RUNWAY_INPUTS} narrative={SAMPLE_PRIVATE_RUNWAY_NARRATIVE} />
        </main>
        <Footer />
      </div>
    </>
  );
}
