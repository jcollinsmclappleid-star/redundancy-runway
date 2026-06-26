import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@shared/site";

interface LegalDocLayoutProps {
  title: string;
  metaDescription: string;
  canonicalPath: string;
  heroLabel: string;
  heroTitle: string;
  heroSubtitle?: string;
  children: React.ReactNode;
}

export function LegalDocLayout({
  title,
  metaDescription,
  canonicalPath,
  heroLabel,
  heroTitle,
  heroSubtitle,
  children,
}: LegalDocLayoutProps) {
  const canonical = `${SITE_URL}${canonicalPath}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo showTagline />
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1" data-testid="link-back-home">
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section
            className="py-12 px-6"
            style={{ background: "linear-gradient(135deg, hsl(215 50% 8%) 0%, hsl(198 65% 14%) 100%)" }}
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3">{heroLabel}</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">{heroTitle}</h1>
              {heroSubtitle && <p className="text-white/70 text-sm leading-relaxed max-w-2xl">{heroSubtitle}</p>}
            </div>
          </section>

          <section className="py-10 px-6 bg-background">
            <div className="max-w-3xl mx-auto prose prose-sm max-w-none text-muted-foreground space-y-6">
              {children}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
