import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight, Calculator, ExternalLink, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@shared/site";
import { UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import {
  AI_CLUSTER_HUB_LINKS,
  AI_CORE_REDUNDANCY_LINKS,
  AI_CTA_PRESETS,
  AI_PAID_PREVIEW_CTA,
  AI_PAID_PREVIEW_HEADLINE,
  AI_PAID_PREVIEW_MODULES,
  AI_PAID_PREVIEW_SUBCOPY,
  AI_PAID_PREVIEW_SUPPORTING,
  AI_REDUNDANCY_SEO_DISCLAIMER,
  type AiCtaPreset,
} from "@shared/aiRedundancySeo";
import { RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import type { AiRedundancySeoPage, AiResearchStat } from "@/pages/seo/ai-redundancy-page-types";

interface AiRedundancySeoLayoutProps {
  page: AiRedundancySeoPage;
  children: ReactNode;
}

function AiSeoJsonLd({ page }: { page: AiRedundancySeoPage }) {
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI redundancy", item: `${SITE_URL}/ai-redundancy-calculator` },
      { "@type": "ListItem", position: 3, name: page.h1, item: pageUrl },
    ],
  };
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.metaTitle,
    url: pageUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    description: page.metaDescription,
    publisher: { "@type": "Organization", name: "RedundancyCalculatorUK", url: SITE_URL },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      <script type="application/ld+json">{JSON.stringify(app)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </>
  );
}

export function AiRedundancySeoLayout({ page, children }: AiRedundancySeoLayoutProps) {
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const primary = page.primaryCta ?? AI_CTA_PRESETS[page.ctaPreset].primary;
  const secondary = page.secondaryCta ?? AI_CTA_PRESETS[page.ctaPreset].secondary;

  return (
    <>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.metaTitle} />
        <meta name="twitter:description" content={page.metaDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <AiSeoJsonLd page={page} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href={primary.href}>
              <Button size="sm" className="h-auto min-h-9 max-w-[200px] whitespace-normal text-right sm:max-w-none" data-testid="ai-seo-header-cta">
                {primary.label}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
              </Button>
            </Link>
          </div>
        </header>
        {children}
        <Footer />
      </div>
    </>
  );
}

function AiStatGrid({ stats, testId }: { stats: AiResearchStat[]; testId?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${stats.length === 3 ? "sm:grid-cols-3" : ""}`} data-testid={testId}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-white/20 bg-white/10 p-3 text-center">
          <p className="text-xl sm:text-2xl font-bold tabular-nums">{stat.value}</p>
          <p className="text-[10px] text-primary-foreground/70 leading-snug mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function AiSectionStatGrid({ stats }: { stats: AiResearchStat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-primary/15 bg-primary/5 p-3 text-center">
          <p className="text-xl font-bold text-primary tabular-nums">{stat.value}</p>
          <p className="text-[10px] text-muted-foreground leading-snug mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export function AiRiskHero({ page }: { page: AiRedundancySeoPage }) {
  const primary = page.primaryCta ?? AI_CTA_PRESETS[page.ctaPreset].primary;
  const secondary = page.secondaryCta ?? AI_CTA_PRESETS[page.ctaPreset].secondary;

  return (
    <section className="bg-primary text-primary-foreground px-6 py-12" data-testid="ai-seo-hero">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div>
          <Badge className="mb-4 bg-white/15 text-primary-foreground border-white/20 text-xs">{page.badge}</Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4">{page.h1}</h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg leading-relaxed max-w-2xl">{page.intro}</p>
          {page.anxietyNote && (
            <p className="mt-3 text-sm text-teal-100/90 leading-relaxed max-w-2xl italic">{page.anxietyNote}</p>
          )}
          {page.positioning && (
            <p className="mt-4 text-sm text-teal-100/90 leading-relaxed max-w-2xl border-l-2 border-teal-300/40 pl-4">
              {page.positioning}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link href={primary.href}>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold w-full sm:w-auto">
                {primary.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={secondary.href}>
              <Button variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/15 w-full sm:w-auto">
                {secondary.label}
              </Button>
            </Link>
          </div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/15 p-4 space-y-3">
          {page.heroStats && page.heroStats.length > 0 ? (
            <>
              <p className="text-sm font-semibold">UK research snapshot</p>
              <AiStatGrid stats={page.heroStats} testId="ai-hero-stats" />
              <p className="text-[10px] text-primary-foreground/50">Sources listed at the foot of this page. Not predictions for your role.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">Modelling boundary</p>
              <ul className="text-xs text-primary-foreground/75 space-y-2 leading-relaxed">
                <li>Does not predict whether AI will replace your role.</li>
                <li>Prepares questions, evidence and runway scenarios.</li>
                <li>Not legal, employment or career advice.</li>
              </ul>
            </>
          )}
          <p className="text-[10px] text-primary-foreground/50 pt-1">Last checked: {UK_STATUTORY_REDUNDANCY.lastChecked}</p>
        </div>
      </div>
    </section>
  );
}

interface AiCtaCardProps {
  title: string;
  body: string;
  href: string;
  label: string;
  variant?: "gold" | "outline";
  testId?: string;
}

function AiCtaCard({ title, body, href, label, variant = "gold", testId }: AiCtaCardProps) {
  return (
    <Card className="border-gold/25 bg-gradient-to-br from-amber-50/40 to-white" data-testid={testId}>
      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary mb-1">{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
        </div>
        <Link href={href} className="shrink-0">
          <Button className={variant === "gold" ? "btn-gold" : ""} variant={variant === "outline" ? "outline" : "default"}>
            {label}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function AiReadinessCta({ compact }: { compact?: boolean }) {
  const preset = AI_CTA_PRESETS.readiness;
  return (
    <AiCtaCard
      title="AI redundancy readiness check"
      body="Model package assumptions, household runway and preparation gaps from your figures — without predicting job loss."
      href={preset.primary.href}
      label={preset.primary.label}
      testId={compact ? "ai-cta-readiness-compact" : "ai-cta-readiness"}
    />
  );
}

export function AiRoleProtectionCta() {
  const preset = AI_CTA_PRESETS.protection;
  return (
    <AiCtaCard
      title="Role Protection Planner"
      body="Document role value, identify tasks AI may absorb, prepare alternative-role options and organise evidence before decisions are final."
      href={preset.primary.href}
      label={preset.primary.label}
      testId="ai-cta-role-protection"
    />
  );
}

export function AiConsultationCta() {
  const preset = AI_CTA_PRESETS.consultation;
  return (
    <AiCtaCard
      title="Consultation Defence Pack"
      body="Prepare business-reason questions, selection criteria clarifications, alternative-role queries and package checks — preparation only."
      href={preset.primary.href}
      label={preset.primary.label}
      testId="ai-cta-consultation"
    />
  );
}

export function AiPaidReportPreview() {
  return (
    <section className="px-6 py-10 bg-surface border-y" data-testid="ai-paid-report-preview">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">Private report</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">{AI_PAID_PREVIEW_HEADLINE}</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">{AI_PAID_PREVIEW_SUBCOPY}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {AI_PAID_PREVIEW_MODULES.map((module) => (
            <div key={module} className="rounded-xl border border-slate-200 bg-white p-4 relative overflow-hidden">
              <p className="text-sm font-medium text-primary pr-6">{module}</p>
              <Lock className="w-3.5 h-3.5 text-amber-600 absolute top-4 right-4" />
              <p className="text-[10px] text-muted-foreground mt-2">Included in the £{RUNWAY_REPORT_PRICE_GBP} report</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/unlock">
            <Button className="btn-gold" data-testid="ai-paid-preview-unlock">
              {AI_PAID_PREVIEW_CTA}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">{AI_PAID_PREVIEW_SUPPORTING}</p>
        </div>
      </div>
    </section>
  );
}

export function AiClusterRelatedLinks({ currentSlug }: { currentSlug: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4">Related AI redundancy pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_CLUSTER_HUB_LINKS.filter((l) => l.href !== `/${currentSlug}`).map((link) => (
            <Link key={link.href} href={link.href} data-testid={`ai-cluster-${link.href.slice(1)}`}>
              <div className="rounded-xl border p-4 hover:border-primary/40 hover:bg-muted/20 transition-colors h-full">
                <p className="text-sm font-medium mb-1">{link.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{link.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-serif text-2xl font-bold mb-4">Core redundancy preparation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_CORE_REDUNDANCY_LINKS.slice(0, 6).map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="rounded-xl border p-4 hover:border-primary/40 hover:bg-muted/20 transition-colors h-full">
                <p className="text-sm font-medium mb-1">{link.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{link.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AiFaqBlock({ faqs }: { faqs: AiRedundancySeoPage["faqs"] }) {
  return (
    <div data-testid="ai-faq-block">
      <h2 className="font-serif text-2xl font-bold mb-4">Frequently asked questions</h2>
      <div className="space-y-3">
        {faqs.map((item) => (
          <div key={item.question} className="rounded-xl border bg-card p-4">
            <h3 className="font-medium text-sm mb-1.5">{item.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AiDisclaimerBox() {
  return (
    <Card className="border-amber-200/70 bg-amber-50/30" data-testid="ai-disclaimer-box">
      <CardContent className="p-5 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">{AI_REDUNDANCY_SEO_DISCLAIMER}</p>
      </CardContent>
    </Card>
  );
}

export function AiContentSections({
  page,
  midCta,
}: {
  page: AiRedundancySeoPage;
  midCta?: ReactNode;
}) {
  return (
    <article className="space-y-8">
      {page.sections.map((section, index) => (
        <div key={section.title}>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3">{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-muted-foreground leading-relaxed mb-3 text-sm sm:text-base">
              {p}
            </p>
          ))}
          {section.stats && section.stats.length > 0 && <AiSectionStatGrid stats={section.stats} />}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {section.bullets.map((b) => (
                <li key={b} className="leading-relaxed">
                  {b}
                </li>
              ))}
            </ul>
          )}
          {index === 3 && midCta}
        </div>
      ))}
    </article>
  );
}

export function AiFinalCta({ page }: { page: AiRedundancySeoPage }) {
  const primary = page.primaryCta ?? AI_CTA_PRESETS[page.ctaPreset].primary;
  const secondary = page.secondaryCta ?? AI_CTA_PRESETS[page.ctaPreset].secondary;

  return (
    <Card className="bg-primary text-primary-foreground" data-testid="ai-final-cta">
      <CardContent className="p-7 text-center">
        <Calculator className="w-8 h-8 mx-auto mb-4 opacity-85" />
        <h2 className="font-serif text-2xl font-bold mb-2">Take the next practical step</h2>
        <p className="text-sm text-primary-foreground/75 max-w-xl mx-auto mb-5">
          Model your readiness from your own assumptions. The paid report adds role protection, consultation prep and runway dashboards.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={primary.href}>
            <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
              {primary.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href={secondary.href}>
            <Button variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/15">
              {secondary.label}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function AiResearchBibliography({ sources }: { sources: NonNullable<AiRedundancySeoPage["researchSources"]> }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-5" data-testid="ai-research-bibliography">
      <h2 className="font-serif text-lg font-bold mb-3">Research sources</h2>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        Figures on this page are drawn from the sources below. They describe trends and survey findings — not predictions for your individual role or employer.
      </p>
      <ul className="space-y-2">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              {source.label}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AiOfficialSourcesNote() {
  return (
    <p className="text-xs text-muted-foreground leading-relaxed">
      For official UK redundancy process context, see{" "}
      <a href="https://www.gov.uk/redundancy-your-rights" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
        GOV.UK redundancy rights <ExternalLink className="w-3 h-3" />
      </a>{" "}
      and{" "}
      <a href="https://www.acas.org.uk/redundancy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
        ACAS redundancy guidance <ExternalLink className="w-3 h-3" />
      </a>
      . This site does not interpret those sources for your situation.
    </p>
  );
}

export function resolveMidCta(preset: AiCtaPreset, page: AiRedundancySeoPage): ReactNode {
  if (page.midCta === "consultation") return <AiConsultationCta />;
  if (page.midCta === "protection") return <AiRoleProtectionCta />;
  if (page.midCta === "readiness") return <AiReadinessCta compact />;
  if (preset === "consultation") return <AiConsultationCta />;
  if (preset === "protection") return <AiRoleProtectionCta />;
  return <AiReadinessCta compact />;
}
