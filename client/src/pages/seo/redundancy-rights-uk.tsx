import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Info, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";

export default function RedundancyRightsUKPage() {
  return (
    <>
      <Helmet>
        <title>Your UK Redundancy Rights Explained 2025 | RedundancyCalculatorUK</title>
        <meta name="description" content="A plain-language overview of UK redundancy rights — notice periods, consultation requirements, unfair dismissal protections and what to check before you sign. Not legal advice." />
        <link rel="canonical" href="https://redundancycalculatoruk.com/redundancy-rights-uk" />
        <meta property="og:title" content="Your UK Redundancy Rights Explained 2025" />
        <meta property="og:description" content="A plain-language overview of UK redundancy rights — notice periods, consultation requirements, unfair dismissal protections and what to check before you sign." />
        <meta property="og:url" content="https://redundancycalculatoruk.com/redundancy-rights-uk" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Your UK Redundancy Rights Explained 2025",
          "description": "A plain-language overview of UK redundancy rights — notice periods, consultation requirements, unfair dismissal protections and what to check before you sign.",
          "publisher": { "@type": "Organization", "name": "RedundancyCalculatorUK", "url": "https://redundancycalculatoruk.com" },
          "dateModified": "2025-04-01",
          "mainEntityOfPage": "https://redundancycalculatoruk.com/redundancy-rights-uk"
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href="/wizard">
              <Button size="sm" data-testid="button-header-cta">
                Build my report
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section className="py-14 px-6 bg-primary" data-testid="section-hero">
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-5 bg-white/15 text-primary-foreground border-white/20 text-xs">UK Redundancy Guide</Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
                Your UK Redundancy Rights Explained 2025
              </h1>
              <p className="text-primary-foreground/75 text-base leading-relaxed max-w-2xl">
                A plain-language overview of the key rights workers in the UK have when facing redundancy — from the consultation process to notice periods, and what to look out for before accepting a package.
              </p>
              <p className="text-primary-foreground/50 text-xs mt-4">
                This is contextual information only. It is not legal advice. For advice on your individual situation, consult an employment solicitor or ACAS.
              </p>
            </div>
          </section>

          <Card className="mx-6 max-w-3xl mt-6 lg:mx-auto bg-amber-50/70 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800" data-testid="card-disclaimer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Important: </span>
                  Employment law is complex and changes over time. This page provides general contextual information only, last reviewed April 2025. It does not constitute legal advice. For guidance specific to your circumstances, consult an employment solicitor, the ACAS helpline (0300 123 1100), or Citizens Advice.
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="py-12 px-6" data-testid="section-content">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">What counts as redundancy?</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Under UK law, redundancy broadly covers three situations:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {[
                    "The employer's business is closing entirely or closing the site where you work.",
                    "The employer needs fewer employees to do a particular kind of work.",
                    "The work you do has diminished or ceased.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  If your role is made redundant but you are replaced by someone doing the same job under a different title, you may have grounds to challenge the redundancy. This is an employment law question — ACAS or a solicitor can advise.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Consultation requirements</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Employers are legally required to consult with employees before making them redundant. The minimum consultation requirements under UK law depend on the number of redundancies:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse" data-testid="table-consultation">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium border-b">Number of redundancies at one establishment</th>
                        <th className="text-left p-3 font-medium border-b">Minimum consultation period</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Fewer than 20</td>
                        <td className="p-3">No fixed minimum — must be meaningful and adequate</td>
                      </tr>
                      <tr className="border-b bg-muted/20">
                        <td className="p-3">20–99</td>
                        <td className="p-3">At least 30 days before the first dismissal</td>
                      </tr>
                      <tr>
                        <td className="p-3">100 or more</td>
                        <td className="p-3">At least 45 days before the first dismissal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Source: GOV.UK. Last checked April 2025. Consultation requirements may vary — seek employment advice for your situation.</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Notice periods</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You are entitled to a minimum statutory notice period based on your length of service. Your contract may provide for a longer notice period, in which case the contractual period applies if it is longer than statutory minimum:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse" data-testid="table-notice">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium border-b">Continuous service</th>
                        <th className="text-left p-3 font-medium border-b">Minimum statutory notice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1 month to 2 years", "1 week"],
                        ["2 years", "2 weeks"],
                        ["3 years", "3 weeks"],
                        ["4–12 years", "1 week per year of service"],
                        ["12 years or more", "12 weeks (maximum statutory)"],
                      ].map(([service, notice], i) => (
                        <tr key={i} className={`border-b ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                          <td className="p-3">{service}</td>
                          <td className="p-3">{notice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Statutory minimum only. Always check your employment contract. Source: GOV.UK, last checked April 2025.</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Unfair dismissal and redundancy</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  A redundancy dismissal can be unfair if:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "The selection process was not fair or objective (e.g. discriminatory criteria were used).",
                    "Suitable alternative employment was available but not offered.",
                    "The statutory consultation process was not followed.",
                    "The redundancy was not genuine (e.g. the role was immediately re-filled).",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                  If you believe your redundancy was unfair, you generally have 3 months minus 1 day from the date of dismissal to bring an Employment Tribunal claim. ACAS early conciliation is usually required before a claim is submitted.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Before you sign a settlement agreement</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  If you are offered a settlement agreement (sometimes called a compromise agreement), be aware that:
                </p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  {[
                    "You must receive independent legal advice before signing — this is a legal requirement for the agreement to be valid.",
                    "Employers typically contribute to the cost of that legal advice.",
                    "Signing waives your right to bring Employment Tribunal claims covered by the agreement.",
                    "You can negotiate the terms before signing.",
                    "The financial modelling tool on this site can help you understand the runway implications of different package amounts before you decide.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">Voluntary redundancy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Voluntary redundancy (VR) is where you agree to leave in exchange for a package, usually when an employer is seeking to reduce headcount. You still receive statutory redundancy pay (or enhanced, if offered), and the same tax treatment applies. The key difference from compulsory redundancy is that you are choosing to take the package — which means you should consider the financial runway implications carefully before accepting. RedundancyCalculatorUK includes a voluntary redundancy comparison in the full private report, showing how the offered VR package compares to your statutory entitlement and how each affects the runway under your assumptions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Card className="bg-muted/30 border-muted" data-testid="card-acas">
                  <CardContent className="pt-4 pb-4">
                    <Shield className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Need employment advice?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ACAS (Advisory, Conciliation and Arbitration Service) provides free and impartial information and advice on employment rights and disputes.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Helpline: 0300 123 1100 (Mon–Fri, 8am–6pm)</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground" data-testid="card-calculator-cta">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-medium mb-1">Model your financial runway</p>
                    <p className="text-xs text-primary-foreground/75 leading-relaxed mb-3">
                      Before making decisions, see how long your money may last under different assumptions.
                    </p>
                    <Link href="/wizard">
                      <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-semibold w-full" data-testid="button-cta-calculator">
                        Free runway calculator
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
