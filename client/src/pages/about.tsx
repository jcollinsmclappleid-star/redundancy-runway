import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Calculator, Globe } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { PRIVACY_COPY } from "@shared/product";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About RedundancyCalculatorUK | Private UK Redundancy Runway Modelling</title>
        <meta name="description" content="RedundancyCalculatorUK is a private, non-advisory modelling tool for UK redundancy scenarios. Built for individuals who want to understand their financial runway before making decisions." />
        <link rel="canonical" href="https://www.redundancycalculatoruk.co.uk/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content="About RedundancyCalculatorUK" />
        <meta property="og:description" content="A private, non-advisory UK redundancy runway modelling tool. Built for individuals, not institutions." />
        <meta property="og:url" content="https://www.redundancycalculatoruk.co.uk/about" />
        <meta property="og:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About RedundancyCalculatorUK" />
        <meta name="twitter:description" content="A private, non-advisory UK redundancy runway modelling tool. Built for individuals, not institutions." />
        <meta name="twitter:image" content="https://www.redundancycalculatoruk.co.uk/og-image.png" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo showTagline />
            <Link href="/wizard">
              <Button size="sm" data-testid="button-header-cta" className="btn-gold rounded-full px-5">
                Build my report
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, hsl(215 50% 8%) 0%, hsl(198 65% 14%) 100%)" }}>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">About</p>
              <h1 className="font-serif text-4xl font-bold text-white mb-5 leading-tight">
                Built for the moment<br />redundancy becomes real.
              </h1>
              <p className="text-white/70 leading-relaxed text-base max-w-xl mx-auto">
                RedundancyCalculatorUK was built for people facing one of life's more disorienting moments — when a redundancy package lands and the question shifts from "what am I owed?" to "how long will this last?"
              </p>
            </div>
          </section>

          <section className="py-16 px-6 bg-background">
            <div className="max-w-2xl mx-auto space-y-10">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What this tool is</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  RedundancyCalculatorUK is a private, assumption-based financial runway modelling tool. It takes the inputs you provide — your redundancy package, savings, monthly costs, income assumptions — and shows you how long your capital may last under different scenarios.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Core calculations run in your browser and are stored locally on your device. Payment and access use our server; we do not store your financial figures there. The tool uses current UK statutory redundancy rules and historical labour market data as reference points — but every projection is based on your own assumptions.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What this tool is not</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This is not financial advice, legal advice, tax advice, employment advice, debt advice, benefits advice, or any form of professional advisory service. All outputs are illustrative estimates. They do not predict individual outcomes. RedundancyCalculatorUK is a planning model — it helps you think, not decide.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, title: "Private by design", body: PRIVACY_COPY.modellingLocal },
                  { icon: Calculator, title: "UK statutory rules", body: "Age-band multipliers, weekly pay caps and service limits — current rules built in." },
                  { icon: Globe, title: "Assumption-based", body: "Every output reflects your inputs. Change an assumption, the model updates." },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border bg-card p-5">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <p className="font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Who it is for</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Anyone in the UK facing redundancy — whether compulsory, voluntary, anticipated or unexpected — who wants to understand their financial position privately before speaking to an adviser, solicitor, or anyone else.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It is also useful for people considering whether to accept a voluntary redundancy offer, those facing mortgage or rent pressure during a job search, or households where one partner's income may need to cover both.
                </p>
              </div>

              <div className="rounded-xl border bg-muted/30 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Important</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  RedundancyCalculatorUK is not regulated by the Financial Conduct Authority. It does not provide regulated financial advice. If you need advice on your specific circumstances, please consult a qualified independent financial adviser, solicitor, or debt adviser. For employment rights, ACAS provides free guidance.
                </p>
              </div>

              <div className="text-center pt-4">
                <Link href="/wizard">
                  <Button size="lg" className="btn-gold rounded-full px-8" data-testid="button-about-cta">
                    Build my private report — Free preview
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-3">No account required. {PRIVACY_COPY.modellingLocal}</p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
