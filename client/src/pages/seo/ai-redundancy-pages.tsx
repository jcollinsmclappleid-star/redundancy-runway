import {
  AiClusterRelatedLinks,
  AiContentSections,
  AiDisclaimerBox,
  AiFaqBlock,
  AiFinalCta,
  AiOfficialSourcesNote,
  AiPaidReportPreview,
  AiRedundancySeoLayout,
  AiResearchBibliography,
  AiRiskHero,
  resolveMidCta,
} from "@/components/seo/ai-cluster";
import { AiReadinessEmbed } from "@/components/seo/ai-cluster/AiReadinessEmbed";
import { aiRedundancyPagesPart1 } from "./ai-redundancy-page-content-part1";
import { aiRedundancyPagesPart2 } from "./ai-redundancy-page-content-part2";
import type { AiRedundancySeoPage } from "./ai-redundancy-page-types";

export const aiRedundancySeoPages: AiRedundancySeoPage[] = [
  ...aiRedundancyPagesPart1,
  ...aiRedundancyPagesPart2,
];

export function getAiRedundancyPage(slug: string): AiRedundancySeoPage {
  const page = aiRedundancySeoPages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown AI redundancy SEO page: ${slug}`);
  return page;
}

export function AiRedundancySeoPageView({ slug }: { slug: string }) {
  const page = getAiRedundancyPage(slug);

  return (
    <AiRedundancySeoLayout page={page}>
      <main className="flex-1">
        <AiRiskHero page={page} />

        {page.showRunwayEmbed && <AiReadinessEmbed />}

        <AiPaidReportPreview />

        <section className="px-6 py-12" data-testid="ai-seo-content">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10">
            <div className="space-y-10">
              <AiContentSections page={page} midCta={resolveMidCta(page.ctaPreset, page)} />
              <AiFaqBlock faqs={page.faqs} />
              {page.researchSources && page.researchSources.length > 0 && (
                <AiResearchBibliography sources={page.researchSources} />
              )}
              <AiClusterRelatedLinks currentSlug={page.slug} />
              <AiFinalCta page={page} />
              <AiDisclaimerBox />
              <AiOfficialSourcesNote />
            </div>
            <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
              {resolveMidCta(page.ctaPreset, page)}
              <AiDisclaimerBox />
            </aside>
          </div>
        </section>
      </main>
    </AiRedundancySeoLayout>
  );
}

export function createAiRedundancySeoPage(slug: string) {
  return function GeneratedAiRedundancyPage() {
    return <AiRedundancySeoPageView slug={slug} />;
  };
}

/** Re-export for sitemap — slugs also in shared/aiRedundancySeo.ts */
export { aiRedundancySeoPages as AI_REDUNDANCY_PAGE_CONFIGS };
