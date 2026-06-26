import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";

import { SITE_URL, SUPPORT_EMAIL } from "@shared/site";

const CANONICAL = `${SITE_URL}/contact`;

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us — RedundancyCalculatorUK</title>
        <meta
          name="description"
          content="Contact RedundancyCalculatorUK for product support. Operated by Ianson Systems Limited. Email support@redundancycalculatoruk.co.uk"
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="Contact Us — RedundancyCalculatorUK" />
        <meta property="og:description" content="Get in touch with RedundancyCalculatorUK support." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us — RedundancyCalculatorUK" />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo showTagline />
            <Link href="/wizard">
              <Button size="sm" className="btn-gold rounded-full px-5" data-testid="button-header-cta">
                Build my report
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section
            className="py-16 px-6"
            style={{ background: "linear-gradient(135deg, hsl(215 50% 8%) 0%, hsl(198 65% 14%) 100%)" }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">Contact</p>
              <h1 className="font-serif text-4xl font-bold text-white mb-4 leading-tight">Contact us</h1>
              <p className="text-white/70 leading-relaxed text-base">
                Questions about the calculator, your report, or account access? We&apos;re here to help.
              </p>
            </div>
          </section>

          <section className="py-14 px-6 bg-background">
            <div className="max-w-2xl mx-auto space-y-6">
              <Card data-testid="card-contact-email">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm mb-1">Email support</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        For product support, billing queries, or technical issues with the site.
                      </p>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-sm font-medium text-primary hover:underline break-all"
                        data-testid="link-support-email"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-contact-company">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Company</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        RedundancyCalculatorUK is operated by{" "}
                        <span className="font-medium text-foreground">Ianson Systems Limited</span>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-contact-privacy-brief">
                <CardContent className="pt-6 pb-6">
                  <p className="font-semibold text-sm mb-2">Private Runway Brief (optional)</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you purchase the Private Runway Report and choose to generate a Private Runway Brief, selected
                    de-identified model figures are securely transmitted to our server and forwarded to OpenAI for
                    processing. Only calculated numerical outputs are included — no names, contact details, addresses,
                    employer information or documents. This occurs only when you explicitly click &quot;Generate Private
                    Runway Brief&quot;. Any generated brief is stored locally in your browser only.
                  </p>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground leading-relaxed text-center px-2">
                This tool does not provide financial, legal, tax, employment, debt, or benefits advice. For regulated
                advice on your personal circumstances, please consult a qualified professional.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
