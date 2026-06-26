import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowRight, Calculator, CheckCircle2, ExternalLink, FileText, Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Footer } from "@/components/Footer";
import { LandingDashboardShowcase } from "@/components/landing-dashboard-showcase";
import { BriefExampleEmbed } from "@/components/private-runway-brief/BriefExampleEmbed";
import { computeRedundancyEstimate, computeRunway, formatGBP, formatMonths, UK_STATUTORY_REDUNDANCY } from "@/lib/engine";
import type { RedundancyPackageInputs, RunwayInputs } from "@shared/schema";

import { SITE_URL } from "@shared/site";
import { RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { TAX_SENSITIVE_DISCLAIMER } from "@shared/complianceCopy";
import { PayoutCtaLadder } from "@/components/seo/PayoutCtaLadder";
import { missingSeoPages } from "./missing-seo-page-content";

import type { PageVariant, SeoPageContent } from "./seo-page-types";

const PAID_REPORT_LABEL = `${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP})`;
const UNLOCK_REPORT_CTA = `Unlock full report — £${RUNWAY_REPORT_PRICE_GBP}`;

interface InternalLinkItem {
  href: string;
  label: string;
  body: string;
}

const baseAssumptions = [
  `Weekly pay is capped at ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)} for redundancies on or after ${UK_STATUTORY_REDUNDANCY.effectiveFrom}.`,
  `Only complete years of service count, up to ${UK_STATUTORY_REDUNDANCY.maxServiceYears} years.`,
  `You normally need at least ${UK_STATUTORY_REDUNDANCY.minServiceYears} years with the same employer for statutory redundancy pay.`,
  `Statutory redundancy pay under ${formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} is generally not taxable, while notice pay and holiday pay are treated differently.`,
];

const pages: SeoPageContent[] = [
  {
    slug: "free-redundancy-calculator",
    metaTitle: "Free Redundancy Calculator UK",
    metaDescription: "Use a free UK redundancy calculator to estimate statutory redundancy pay, then model how long the money may last under household and income assumptions.",
    h1: "Free redundancy calculator UK",
    primaryCta: "Start free redundancy calculator",
    secondaryCta: "Model how long the money may last",
    secondaryHref: "/how-long-will-my-redundancy-pay-last",
    badge: "Free UK calculator",
    intro: "Estimate statutory redundancy pay using age, weekly gross pay and years of service. Then move from the headline payment to the bigger household question: how long that money may last.",
    intent: "This page is for people looking for a free redundancy calculator before deciding whether they need a fuller private runway report.",
    helps: [
      "Estimate statutory redundancy pay from age, weekly pay and complete years of service.",
      "See whether the basic 2-year eligibility rule is met under your assumptions.",
      "Add notice pay, holiday pay or enhanced package figures when those are part of the offer.",
      "Continue into the private runway model once you have seen useful free output.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Example: checking the statutory baseline first",
      body: "A 44-year-old with 10 complete years of service and weekly pay above the statutory cap may use the cap in the statutory part of the calculation. The free estimate gives the baseline before notice pay, holiday pay, enhanced terms and household runway are modelled.",
    },
    faqs: [
      { question: "Is this redundancy calculator free?", answer: "Yes. The statutory estimate is free. The private runway report is optional and comes after you have entered useful assumptions." },
      { question: "What details do I need?", answer: "You need your age, complete years of service and gross weekly pay. Notice pay, holiday pay and enhanced package fields are optional." },
      { question: "Does this replace legal or financial advice?", answer: "No. It is an illustrative modelling tool and does not determine legal entitlement or provide financial advice." },
    ],
    variant: "core",
  },
  {
    slug: "redundancy-pay-calculator-uk",
    metaTitle: "Redundancy Pay Calculator UK",
    metaDescription: "Estimate UK statutory redundancy pay using age, weekly pay and years of service, then build a private runway report.",
    h1: "Redundancy pay calculator UK",
    primaryCta: "Calculate my redundancy pay",
    badge: "Statutory estimate",
    intro: "Use the calculator to estimate the UK statutory redundancy payment that may apply before you add notice pay, holiday pay, savings and monthly costs.",
    intent: "This is the main calculator page for people who want a direct redundancy pay estimate and then a private runway model.",
    helps: [
      "Calculate the statutory redundancy baseline.",
      "Understand why age bands and service years change the estimate.",
      "Separate redundancy pay from notice pay and holiday pay.",
      "Move into a full runway report when the statutory figure is not enough context.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Example: the statutory figure is only one part",
      body: "Two people can receive the same statutory redundancy estimate but have very different runway outcomes because mortgage, rent, savings and replacement income are different.",
    },
    faqs: [
      { question: "How is redundancy pay calculated in the UK?", answer: "The statutory formula uses age bands, complete years of service and weekly pay, subject to the statutory weekly cap and 20-year service limit." },
      { question: "Does weekly pay mean gross or net pay?", answer: "For this statutory estimate, use gross weekly pay before deductions." },
      { question: "Can I model more than statutory redundancy?", answer: "Yes. You can add enhanced package, notice pay and holiday pay assumptions before building the private report." },
    ],
    variant: "core",
  },
  {
    slug: "statutory-redundancy-pay-calculator",
    metaTitle: "Statutory Redundancy Pay Calculator UK",
    metaDescription: "Calculate statutory redundancy pay using UK age-band rules, weekly pay caps and service limits.",
    h1: "Statutory redundancy pay calculator",
    primaryCta: "Calculate statutory redundancy pay",
    badge: "Legal minimum estimate",
    intro: "Work out an illustrative statutory redundancy pay figure using the UK age-band formula, weekly pay cap and service limits.",
    intent: "This page is for users who specifically want the legal minimum estimate before looking at wider package or runway questions.",
    helps: [
      "Apply the under-22, 22-40 and 41-plus age bands.",
      "Use the current weekly pay cap from the calculator engine.",
      "Identify when fewer than 2 years of service means no statutory redundancy pay.",
      "Keep statutory redundancy separate from notice pay and holiday pay.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Example: older service years can count differently",
      body: "The formula looks at your age during each complete year of service. Years worked at age 41 or older use a higher multiplier than years worked from 22 to 40.",
    },
    faqs: [
      { question: "What is the current statutory weekly pay cap?", answer: `The calculator uses ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)} for redundancies on or after ${UK_STATUTORY_REDUNDANCY.effectiveFrom}, last checked ${UK_STATUTORY_REDUNDANCY.lastChecked}.` },
      { question: "What is the maximum service counted?", answer: `The statutory calculation counts up to ${UK_STATUTORY_REDUNDANCY.maxServiceYears} complete years of service.` },
      { question: "Is this a legal entitlement decision?", answer: "No. It is an illustrative estimate based on the information you enter." },
    ],
    variant: "core",
  },
  {
    slug: "redundancy-calculator-uk",
    metaTitle: "Redundancy Calculator UK",
    metaDescription: "Calculate redundancy pay and model how long your money may last after redundancy, restructuring or income disruption.",
    h1: "Redundancy calculator UK",
    primaryCta: "Start redundancy calculator",
    badge: "Pay and runway",
    intro: "Calculate an illustrative redundancy package and then model the household runway behind it: savings, mortgage or rent, costs and income recovery assumptions.",
    intent: "This page matches broad UK redundancy calculator searches where the user may need both pay and runway modelling.",
    helps: [
      "Estimate statutory redundancy pay quickly.",
      "Add package components such as notice pay and holiday pay.",
      "Prepare for a wider model of monthly costs and replacement income.",
      "Keep the experience B2C, private and non-advisory.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Example: from payment to runway",
      body: "A redundancy payment can look large in isolation. The runway model tests that payment against monthly essentials, savings and expected income gaps.",
    },
    faqs: [
      { question: "What does the redundancy calculator include?", answer: "The free estimate covers statutory redundancy, notice pay, holiday pay and optional enhanced package fields. The private report models household runway." },
      { question: "Is my data used for employer or HR purposes?", answer: "No. The tool is designed for individuals planning privately after redundancy, restructuring or income disruption." },
      { question: "Can renters use it?", answer: "Yes. Mortgage or rent can be entered as the monthly housing cost in the runway model." },
    ],
    variant: "core",
  },
  {
    slug: "redundancy-pay-calculator-2026",
    metaTitle: "Redundancy Pay Calculator 2026 UK",
    metaDescription: "Use current UK redundancy assumptions to estimate statutory redundancy pay for 2026 and model your financial runway.",
    h1: "Redundancy pay calculator 2026",
    primaryCta: "Calculate 2026 redundancy pay",
    badge: "2026 assumptions",
    intro: "Use the current 2026 statutory assumptions in the calculator engine to estimate redundancy pay and then test how long the money may last.",
    intent: "This page is for freshness searches where users want the current-year redundancy pay cap and formula.",
    helps: [
      "Use 2026 statutory assumptions rather than historic weekly caps.",
      "Check the statutory payment before adding package extras.",
      "Understand why the date of redundancy matters for caps.",
      "Continue into runway modelling after the estimate.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Example: why the year matters",
      body: "The weekly pay cap can change by statutory year. This page uses the current project constants and shows the last checked date so users are not shown historic caps as current figures.",
    },
    faqs: [
      { question: "Which 2026 cap does this use?", answer: `It uses ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)} for redundancies on or after ${UK_STATUTORY_REDUNDANCY.effectiveFrom}.` },
      { question: "When was this checked?", answer: `The statutory assumptions were last checked on ${UK_STATUTORY_REDUNDANCY.lastChecked}.` },
      { question: "Can I use it for a previous tax year?", answer: "This page is for current assumptions. Historic caps should only be used where the redundancy date falls in that earlier statutory year." },
    ],
    variant: "core",
  },
  {
    slug: "how-much-redundancy-pay-will-i-get",
    metaTitle: "How Much Redundancy Pay Will I Get?",
    metaDescription: "Find out what affects redundancy pay in the UK and use the calculator to estimate your statutory payment.",
    h1: "How much redundancy pay will I get?",
    primaryCta: "Estimate my redundancy pay",
    badge: "Question answered",
    intro: "The amount depends on age, complete years of service, gross weekly pay and whether your employer offers anything above the statutory minimum.",
    intent: "This page answers the question directly, then gives the user the calculator rather than a long generic article.",
    helps: [
      "See the main inputs that affect redundancy pay.",
      "Understand the 2-year eligibility rule.",
      "Recognise package elements that are separate from statutory redundancy.",
      "Move from the estimate to a household runway model.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Example: one missing year can matter",
      body: "Because the statutory formula uses complete years of service, a partial year usually does not increase the statutory redundancy estimate.",
    },
    faqs: [
      { question: "What affects how much redundancy pay I get?", answer: "Age during each year of service, complete years of service, gross weekly pay and any enhanced employer terms are the main factors." },
      { question: "Will I get statutory redundancy pay with less than 2 years' service?", answer: "Normally no, but notice pay, holiday pay or employer-specific payments may still be relevant." },
      { question: "What should I do after estimating the payment?", answer: "Model how the payment interacts with savings, housing costs, monthly spending and replacement income assumptions." },
    ],
    variant: "question",
  },
  {
    slug: "how-does-redundancy-pay-work",
    metaTitle: "How Does Redundancy Pay Work in the UK?",
    metaDescription: "Understand how UK redundancy pay is calculated using age, length of service and weekly pay, then estimate your payment.",
    h1: "How does redundancy pay work?",
    primaryCta: "Use the redundancy pay calculator",
    secondaryCta: "Check the maximum statutory amount",
    secondaryHref: "/maximum-redundancy-pay-uk",
    badge: "Plain-English explainer",
    intro: "UK statutory redundancy pay uses a formula based on age, complete years of service and gross weekly pay, subject to statutory limits. The calculator turns those assumptions into an illustrative estimate.",
    intent: "This page is for users who want to understand the formula before entering their own details into the calculator.",
    helps: [
      "Understand the three main statutory inputs: age, complete service years and weekly pay.",
      "See why age bands can change the number of weeks counted.",
      "Keep statutory redundancy separate from notice pay, holiday pay and unpaid wages.",
      "Move from the explanation into a private runway model once the payment estimate is clear.",
    ],
    assumptions: [
      ...baseAssumptions,
      "The calculation is an estimate based on the assumptions entered and does not decide entitlement.",
    ],
    example: {
      title: "Example: how the formula is built",
      body: "Example only: someone with complete years of service across different age bands may have those years counted at different week multipliers. The calculator applies the age-band logic to the details entered rather than treating every year the same.",
    },
    faqs: [
      { question: "What are the main redundancy pay inputs?", answer: "The statutory estimate uses age, complete years of service and gross weekly pay, subject to the weekly pay cap and service limit." },
      { question: "Does redundancy pay include notice pay?", answer: "Statutory redundancy pay is separate from notice pay, holiday pay and unpaid wages. Those amounts may still matter for a package and runway model." },
      { question: "Can this page tell me what I am entitled to?", answer: "No. It explains the model and provides an illustrative estimate only. It does not provide legal or employment advice." },
    ],
    variant: "question",
  },
  {
    slug: "maximum-redundancy-pay-uk",
    metaTitle: "Maximum Redundancy Pay UK",
    metaDescription: "Understand the maximum statutory redundancy payment in the UK and estimate your payment using current assumptions.",
    h1: "Maximum redundancy pay UK",
    primaryCta: "Check my redundancy pay estimate",
    secondaryCta: "See how redundancy pay works",
    secondaryHref: "/how-does-redundancy-pay-work",
    badge: "Cap-focused estimate",
    intro: "The maximum statutory redundancy payment depends on the current weekly pay cap, the 20-year service limit and the age-band multiplier. Most people need a calculator because the maximum is not the same as every individual estimate.",
    intent: "This page is for users searching for the statutory maximum or trying to understand why their estimate may be capped.",
    helps: [
      "Understand the weekly pay cap used by the current calculator.",
      "See why only up to 20 complete years of service are counted.",
      "Recognise that the maximum statutory amount is not the same as an enhanced employer package.",
      "Model wider runway assumptions after the capped statutory estimate is clear.",
    ],
    assumptions: [
      `The current weekly pay cap in the calculator is ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}, last checked ${UK_STATUTORY_REDUNDANCY.lastChecked}.`,
      `The statutory service limit is ${UK_STATUTORY_REDUNDANCY.maxServiceYears} complete years.`,
      "Enhanced or contractual redundancy payments can be higher than the statutory estimate, depending on employer terms.",
      "This page does not determine legal entitlement or provide financial, legal, tax or employment advice.",
    ],
    example: {
      title: "Example: why high pay may still be capped",
      body: "Example only: if someone's gross weekly pay is above the statutory cap, the statutory part of the calculation uses the capped weekly amount. Any enhanced package should be modelled separately from the statutory estimate.",
    },
    faqs: [
      { question: "What limits statutory redundancy pay?", answer: `The statutory estimate is limited by the weekly pay cap, the ${UK_STATUTORY_REDUNDANCY.maxServiceYears}-year service limit and the age-band rules.` },
      { question: "Can enhanced redundancy be above the statutory maximum?", answer: "It may be, depending on employer policy, contract or agreement. Enhanced amounts should be entered separately as assumptions." },
      { question: "Does the maximum include notice pay or holiday pay?", answer: "No. The statutory redundancy maximum is separate from notice pay, holiday pay, unpaid wages and other final pay components." },
    ],
    variant: "core",
  },
  {
    slug: "redundancy-package-calculator",
    metaTitle: "Redundancy Package Calculator UK",
    metaDescription: "Estimate statutory redundancy, enhanced redundancy, notice pay, holiday pay and final pay assumptions in one package view.",
    h1: "Redundancy package calculator",
    primaryCta: "Model my redundancy package",
    secondaryCta: UNLOCK_REPORT_CTA,
    secondaryHref: "/wizard",
    badge: "Package breakdown",
    intro: "A redundancy package can include several different payments. Estimate the statutory baseline, add enhanced package assumptions, and keep notice, PILON, holiday pay and final pay separate.",
    intent: "This page is for users who have a package figure or offer and want to understand the moving parts before modelling household runway.",
    helps: [
      "Separate statutory redundancy pay from enhanced or manual package assumptions.",
      "Add notice pay, PILON-style notice assumptions and accrued holiday pay.",
      "Treat unpaid wages and final payroll items as separate from statutory redundancy.",
      `Move from a package estimate into the ${PAID_REPORT_LABEL}.`,
    ],
    assumptions: [
      ...baseAssumptions,
      "Notice pay, holiday pay, unpaid wages, bonuses and other payroll items may be treated differently from statutory redundancy pay.",
      "Enhanced or contractual redundancy amounts depend on employer policy, contract or agreement.",
    ],
    example: {
      title: "Example: one package, several components",
      body: "A written package might include statutory redundancy, PILON, accrued holiday and a final salary payment. Modelling those separately helps avoid treating every pound as the same kind of payment.",
    },
    faqs: [
      { question: "What does a redundancy package include?", answer: "It may include statutory redundancy, enhanced redundancy, notice or PILON, holiday pay, unpaid wages and other final payroll items." },
      { question: "Is final pay the same as redundancy pay?", answer: "No. Final pay can include wages, notice, holiday and other items that are separate from statutory redundancy pay." },
      { question: "Can I use this before my employer confirms figures?", answer: "Yes. Use it as a scenario estimate, then update the figures when a written breakdown is available." },
    ],
    variant: "package",
  },
  {
    slug: "enhanced-redundancy-calculator",
    metaTitle: "Enhanced Redundancy Calculator UK",
    metaDescription: "Compare statutory redundancy pay with enhanced or contractual redundancy package assumptions.",
    h1: "Enhanced redundancy calculator",
    primaryCta: "Compare enhanced package",
    badge: "Package comparison",
    intro: "Compare the statutory baseline with an enhanced or contractual redundancy amount, then decide whether the offer changes your household runway.",
    intent: "This page is for users whose employer has offered more than the statutory minimum and who need to compare the numbers calmly.",
    helps: [
      "Estimate the statutory baseline first.",
      "Enter an enhanced redundancy amount as a package assumption.",
      "Keep notice pay and holiday pay separate from genuine redundancy payment assumptions.",
      "Link the bigger package to runway, not just headline value.",
    ],
    assumptions: [...baseAssumptions, "Enhanced employer terms depend on your contract, policy, consultation outcome or settlement terms."],
    example: {
      title: "Example: enhanced pay can change the runway",
      body: "An enhanced package might double the statutory element, but the useful question is how many additional months it buys under your household burn rate.",
    },
    faqs: [
      { question: "What is enhanced redundancy pay?", answer: "It is an employer or contract-based payment above the statutory minimum. The exact terms depend on your situation." },
      { question: "Does enhanced redundancy replace statutory redundancy?", answer: "In this calculator, an enhanced amount can be entered as the redundancy element for package modelling, while notice and holiday pay remain separate." },
      { question: "Should I get advice before accepting enhanced terms?", answer: "Yes where terms are complex, settlement-related or legally significant. This calculator is non-advisory." },
    ],
    variant: "package",
  },
  {
    slug: "voluntary-redundancy-calculator",
    metaTitle: "Voluntary Redundancy Calculator UK",
    metaDescription: "Model a voluntary redundancy package and compare it with statutory redundancy assumptions and household runway.",
    h1: "Voluntary redundancy calculator",
    primaryCta: "Model voluntary redundancy",
    badge: "Voluntary redundancy",
    intro: "Model a voluntary redundancy offer against the statutory baseline, then think about how long the package may last under realistic household assumptions.",
    intent: "This page is for employees considering a voluntary redundancy offer and wanting a private financial model before deciding next steps.",
    helps: [
      "Compare a voluntary redundancy offer with the statutory baseline.",
      "Include notice pay and holiday pay where they are part of the package.",
      "Keep tax, legal and employment advice separate from the calculator output.",
      "Prepare a fuller private runway report before accepting anything.",
    ],
    assumptions: [...baseAssumptions, "Voluntary redundancy offers can involve settlement terms, so professional advice may be important."],
    example: {
      title: "Example: attractive offer, uncertain gap",
      body: "A voluntary redundancy package may look generous but still create pressure if re-employment takes longer than expected or household costs are high.",
    },
    faqs: [
      { question: "Can this tell me whether to accept voluntary redundancy?", answer: "No. It can model package assumptions, but the decision may involve legal, employment, tax and personal factors." },
      { question: "What should I compare first?", answer: "Start with the statutory baseline, then compare the voluntary offer and the months of runway each assumption creates." },
      { question: "Does the tool contact my employer?", answer: "No. It is a private modelling tool for individuals." },
    ],
    variant: "package",
  },
  {
    slug: "redundancy-tax-calculator",
    metaTitle: "Redundancy Tax Calculator UK",
    metaDescription: "Understand how redundancy payments, notice pay and holiday pay may be treated differently for tax purposes.",
    h1: "Redundancy tax calculator",
    primaryCta: "Estimate package components",
    badge: "Tax treatment estimate",
    intro: "Separate genuine redundancy payment assumptions from notice pay and holiday pay, and understand why other payroll items such as unpaid wages may need separate tax treatment.",
    intent: "This page is for users asking what they may actually keep, without pretending to provide personalised tax advice.",
    helps: [
      "Show gross statutory redundancy, notice pay and holiday pay separately.",
      "Flag the general tax-free treatment of statutory redundancy pay under the threshold.",
      "Prompt you to check any unpaid wages, bonuses or benefits separately.",
      "Avoid estimating personal income tax bands or individual liability.",
    ],
    assumptions: [...baseAssumptions, "This calculator does not calculate personal income tax, National Insurance, pension effects or settlement-agreement tax treatment."],
    example: {
      title: "Example: not every package pound is treated the same",
      body: "A termination payment may include statutory redundancy, PILON, holiday pay, unpaid wages, bonuses or benefits. Those components can be treated differently, so separating the main package items and checking payroll details matters.",
    },
    faqs: [
      { question: "Is redundancy pay tax-free?", answer: `GOV.UK says statutory redundancy pay under ${formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} is not taxable, but other termination payment components can be taxed differently.` },
      { question: "Does this calculate my exact tax bill?", answer: "No. It separates gross components and gives general information only. Use HMRC guidance or professional advice for your personal position." },
      { question: "Are notice pay and holiday pay different?", answer: "Yes. Notice pay and holiday pay are generally treated as taxable employment income." },
    ],
    variant: "tax",
  },
  {
    slug: "redundancy-pay-after-tax-calculator",
    metaTitle: "Redundancy Pay After Tax Calculator UK",
    metaDescription: "Estimate how different parts of a redundancy package may be treated for tax and how much may support your runway.",
    h1: "Redundancy pay after tax calculator",
    primaryCta: "Model after-tax assumptions",
    secondaryCta: UNLOCK_REPORT_CTA,
    secondaryHref: "/wizard",
    badge: "Tax boundary estimate",
    intro: "Redundancy pay, notice pay, holiday pay and unpaid wages can sit in different tax categories. Use this page to separate the components before modelling how much may support your household runway.",
    intent: "This page is for users trying to understand redundancy pay after tax without relying on a personalised tax calculation.",
    helps: [
      "Separate genuine redundancy payment assumptions from notice and holiday pay.",
      "Understand why the tax-free threshold does not apply to every final payment.",
      "Keep payroll items such as unpaid wages and bonuses separate.",
      `Use the package estimate as an input to the ${RUNWAY_REPORT_FULL}.`,
    ],
    assumptions: [
      `Statutory redundancy pay under ${formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} is generally not taxable, but other payments can be treated differently.`,
      "This page does not calculate personal income tax, National Insurance, pension effects or settlement-agreement tax treatment.",
      "Use HMRC guidance, payroll information or professional tax support for your personal position.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: after-tax assumptions need separation",
      body: "If a package includes redundancy pay plus PILON and accrued holiday, the redundancy element may be considered differently from the notice and holiday elements. The calculator keeps those components visible.",
    },
    faqs: [
      { question: "Is all redundancy pay tax-free?", answer: "No. Genuine redundancy payment may be tax-free up to the threshold, but notice pay, holiday pay, wages and some other components can be taxable." },
      { question: "Does this calculate my exact take-home amount?", answer: "No. It is a component model and explainer, not a personal tax calculator or tax advice." },
      { question: "Why does after-tax runway matter?", answer: "Household runway depends on usable capital, so separating components helps you avoid overstating the money available under your assumptions." },
    ],
    variant: "tax",
  },
  {
    slug: "redundancy-notice-pay-calculator",
    metaTitle: "Redundancy Notice Pay Calculator UK",
    metaDescription: "Estimate notice pay alongside redundancy pay and understand how it affects your overall package assumptions.",
    h1: "Redundancy notice pay calculator",
    primaryCta: "Estimate notice pay",
    badge: "Notice pay",
    intro: "Estimate notice pay alongside statutory redundancy pay so your package assumptions reflect more than the redundancy element alone.",
    intent: "This page is for users searching notice pay in a redundancy context and trying to understand the total package.",
    helps: [
      "Add notice weeks to the statutory redundancy estimate.",
      "Keep notice pay separate from statutory redundancy pay.",
      "Understand that notice pay is usually treated differently for tax purposes.",
      "Move the gross package into a wider runway model.",
    ],
    assumptions: [...baseAssumptions, "Notice entitlement depends on contract, statutory minimums and whether notice is worked or paid in lieu."],
    example: {
      title: "Example: notice pay can be a major package component",
      body: "Someone with a 12-week notice period may have a materially different starting capital assumption from someone with only statutory minimum notice.",
    },
    faqs: [
      { question: "What is redundancy notice pay?", answer: "It is pay for the notice period owed when employment ends, depending on contract and statutory rules." },
      { question: "Is notice pay the same as redundancy pay?", answer: "No. Notice pay is separate from statutory redundancy pay and usually has different tax treatment." },
      { question: "Can I include notice pay in the runway model?", answer: "Yes. The calculator can include notice pay as part of the gross package assumptions." },
    ],
    variant: "notice",
  },
  {
    slug: "pilon-calculator-redundancy",
    metaTitle: "PILON Calculator for Redundancy UK",
    metaDescription: "Estimate payment in lieu of notice as part of a redundancy package and understand how it differs from redundancy pay.",
    h1: "PILON calculator for redundancy",
    primaryCta: "Estimate PILON",
    badge: "Payment in lieu",
    intro: "Estimate payment in lieu of notice as part of a redundancy package and keep it separate from the statutory redundancy element.",
    intent: "This page is for PILON-specific searches where users need to model notice paid as cash rather than worked notice.",
    helps: [
      "Estimate gross PILON from weekly pay and notice weeks.",
      "Compare PILON with the statutory redundancy element.",
      "Avoid treating PILON as a tax-free redundancy payment.",
      "Use the total package assumption in runway modelling.",
    ],
    assumptions: [...baseAssumptions, "PILON terms depend on your contract and how your employer handles termination payments."],
    example: {
      title: "Example: paid notice changes cash timing",
      body: "If notice is paid in lieu rather than worked, the cash may arrive with the package, but it should still be modelled separately from statutory redundancy pay.",
    },
    faqs: [
      { question: "What does PILON mean?", answer: "PILON means payment in lieu of notice: money paid instead of requiring you to work your notice period." },
      { question: "Is PILON tax-free?", answer: "PILON is generally treated as taxable employment income, unlike statutory redundancy pay under the tax-free threshold." },
      { question: "Should PILON be included in my runway?", answer: "Yes if you expect to receive it, but keep it separate from genuine redundancy pay in your assumptions." },
    ],
    variant: "notice",
  },
  {
    slug: "holiday-pay-redundancy-calculator",
    metaTitle: "Holiday Pay Redundancy Calculator UK",
    metaDescription: "Estimate accrued holiday pay as part of a redundancy package and see how it fits into your runway assumptions.",
    h1: "Holiday pay redundancy calculator",
    primaryCta: "Estimate holiday pay",
    badge: "Accrued holiday",
    intro: "Estimate accrued holiday pay in a redundancy package and see how it sits alongside statutory redundancy and notice pay assumptions.",
    intent: "This page is for users asking whether untaken holiday affects the redundancy package they can model.",
    helps: [
      "Estimate gross accrued holiday pay from weekly pay and holiday weeks.",
      "Keep holiday pay separate from statutory redundancy pay.",
      "Understand that holiday pay is generally taxable employment income.",
      "Include the gross package in a private runway model.",
    ],
    assumptions: [...baseAssumptions, "Actual holiday pay depends on accrued entitlement, contract, working pattern and employer payroll calculation."],
    example: {
      title: "Example: small component, useful cashflow",
      body: "Accrued holiday pay may be smaller than redundancy or notice pay, but it can still affect the first few months of runway when cashflow is tight.",
    },
    faqs: [
      { question: "Do I get holiday pay when made redundant?", answer: "You may be paid for accrued but untaken holiday, subject to your entitlement and employer calculation." },
      { question: "Is holiday pay part of statutory redundancy pay?", answer: "No. It is a separate employment payment and usually has different tax treatment." },
      { question: "Can I enter holiday pay here?", answer: "Yes. Enter accrued holiday in weeks and the calculator estimates the gross holiday pay component." },
    ],
    variant: "holiday",
  },
  {
    slug: "redundancy-final-pay-calculator",
    metaTitle: "Redundancy Final Pay Calculator UK",
    metaDescription: "Estimate final pay elements after redundancy, including redundancy pay, notice pay, holiday pay and unpaid wages.",
    h1: "Redundancy final pay calculator",
    primaryCta: "Model final pay assumptions",
    secondaryCta: UNLOCK_REPORT_CTA,
    secondaryHref: "/wizard",
    badge: "Final pay breakdown",
    intro: "Final pay after redundancy may include more than redundancy pay. Use this calculator to separate redundancy, notice, holiday and unpaid wage assumptions before modelling the household impact.",
    intent: "This page supports users who want to check a final pay breakdown before putting the figures into a runway model.",
    helps: [
      "Estimate statutory redundancy pay as one part of final pay.",
      "Add notice and accrued holiday assumptions where relevant.",
      "Keep unpaid wages, bonuses and final payroll items separate from redundancy pay.",
      "Move the final pay view into a private runway report.",
    ],
    assumptions: [
      "Final pay should be checked against the employer's written breakdown and final payslip.",
      "Unpaid wages, notice pay and holiday pay are not the same as statutory redundancy pay.",
      "This page does not decide whether an employer's final pay calculation is correct.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: checking the final payslip shape",
      body: "A final payslip might show salary to leaving date, notice, holiday, statutory redundancy and deductions. Separating those items can make the runway model more realistic.",
    },
    faqs: [
      { question: "What is final pay after redundancy?", answer: "It is the final payroll settlement, which may include wages, redundancy pay, notice, holiday pay and other items." },
      { question: "Can this check whether my employer is correct?", answer: "No. It helps organise assumptions. Ask for a written breakdown and use official or professional support for disputes." },
      { question: "Should final pay go into the runway report?", answer: "Yes, once you have a reasonable estimate. It affects starting capital and how long money may last." },
    ],
    variant: "package",
  },
  {
    slug: "redundancy-payout-calculator",
    metaTitle: "Redundancy Payout Calculator UK",
    metaDescription: "Estimate a redundancy payout and model how it may support your household runway under different assumptions.",
    h1: "Redundancy payout calculator",
    primaryCta: "Estimate my redundancy payout",
    secondaryCta: UNLOCK_REPORT_CTA,
    secondaryHref: "/wizard",
    badge: "Payout estimate",
    intro: "Estimate a redundancy payout using statutory, enhanced, notice and holiday assumptions, then test what that payout may mean for monthly household runway.",
    intent: "This page is for users searching for the overall payout figure rather than a single statutory redundancy amount.",
    helps: [
      "Estimate the gross payout from statutory or enhanced redundancy assumptions.",
      "Add notice and holiday pay as separate package components.",
      "Compare the payout with a simple monthly burn rate.",
      `Continue into the ${RUNWAY_REPORT_FULL} for detailed scenarios.`,
    ],
    assumptions: [
      "A redundancy payout can combine payments with different tax and payroll treatment.",
      "The gross payout shown here is not the same as a confirmed take-home amount.",
      "The runway model uses assumptions and does not predict employment outcomes.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: payout versus runway",
      body: "A £24,000 payout may feel large, but the useful planning question is how it interacts with mortgage or rent, essential costs, savings and expected income gaps.",
    },
    faqs: [
      { question: "What is a redundancy payout?", answer: "It is the total amount expected from redundancy-related payments, which may include redundancy pay, notice, holiday and other final pay components." },
      { question: "Is the payout shown after tax?", answer: "No. This page focuses on gross assumptions and component separation. Tax treatment can vary by component." },
      { question: "Can I model how long the payout may last?", answer: "Yes. Use the private runway report to model payout, savings, housing costs, spending and income recovery assumptions." },
    ],
    variant: "package",
  },
  {
    slug: "how-long-will-my-redundancy-pay-last",
    metaTitle: "How Long Will My Redundancy Pay Last?",
    metaDescription: "Model how long redundancy pay, savings and household income may last under different monthly cost assumptions.",
    h1: "How long will my redundancy pay last?",
    primaryCta: "Model how long my redundancy pay may last",
    secondaryCta: "Start free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Runway modelling",
    intro: "A redundancy payment is only useful once you test it against monthly spending, savings, housing costs and realistic income recovery assumptions.",
    intent: "This page is for users who already have, or expect, a redundancy figure and want to understand how many months of financial runway it may create.",
    helps: [
      "Combine redundancy pay with cash savings and other accessible capital.",
      "Compare capital with essential monthly costs such as housing, utilities, food, transport and debt repayments.",
      "Test replacement income assumptions without treating them as predictions.",
      "Decide whether a private runway report would add useful detail after the free estimate.",
    ],
    assumptions: [
      "Runway depends on monthly cash burn, not just the redundancy payment.",
      "The estimate is sensitive to mortgage or rent, partner income, debt repayments and how quickly income restarts.",
      "Replacement income and job-search timing are scenario assumptions, not forecasts.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: the same payment can buy different time",
      body: "A £20,000 package may cover eight months at a £2,500 monthly gap, but only four months at a £5,000 monthly gap. That is why the runway model starts with household costs rather than the package alone.",
    },
    faqs: [
      { question: "How do I work out how long redundancy pay will last?", answer: "Start with redundancy pay plus accessible savings, then divide by the monthly gap between essential spending and reliable income. The runway calculator models this with more detail." },
      { question: "Should I include partner income?", answer: "Only include partner income if it is reliable under the scenario you are modelling. You can test household and single-income assumptions separately." },
      { question: "Does this predict when I will get a new job?", answer: "No. It lets you test different income recovery timings, but it does not predict employment outcomes." },
    ],
    variant: "runway",
  },
  {
    slug: "how-long-will-my-savings-last-after-redundancy",
    metaTitle: "How Long Will My Savings Last After Redundancy?",
    metaDescription: "Model savings, redundancy pay, essential costs and replacement income assumptions after redundancy.",
    h1: "How long will my savings last after redundancy?",
    primaryCta: "Model my savings runway",
    secondaryCta: "Estimate redundancy pay first",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Savings runway",
    intro: "Savings after redundancy are easier to understand when they are modelled alongside redundancy pay, essential monthly costs and realistic income-gap assumptions.",
    intent: "This page is for users who want to know how long savings may last after redundancy, rather than only how much redundancy pay they may receive.",
    helps: [
      "Combine cash savings with redundancy pay and other accessible capital.",
      "Compare savings with essential monthly costs and housing commitments.",
      "Test income recovery assumptions without treating them as predictions.",
      `Use the ${PAID_REPORT_LABEL} for a fuller month-by-month view.`,
    ],
    assumptions: [
      "Savings runway depends on monthly burn, not only the savings balance.",
      "Essential costs, debt repayments and housing usually change the estimate more than small spending items.",
      "Replacement income timing is a scenario assumption, not an employment forecast.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: savings plus package",
      body: "A household with £12,000 savings and a £15,000 package starts with more runway than savings alone suggest, but monthly housing and essential costs still shape the result.",
    },
    faqs: [
      { question: "How do I estimate how long savings may last after redundancy?", answer: "Start with accessible savings, add expected redundancy and final pay assumptions, then compare that capital with monthly costs and reliable income." },
      { question: "Should I model savings separately from redundancy pay?", answer: "Yes. Separating savings from package assumptions makes it easier to update the model when final figures arrive." },
      { question: "Does this replace budgeting or debt advice?", answer: "No. It is a private scenario model and does not provide financial, debt, benefits, tax or legal advice." },
    ],
    variant: "runway",
  },
  {
    slug: "redundancy-runway-calculator",
    metaTitle: "Redundancy Runway Calculator UK",
    metaDescription: "Model your redundancy payment, savings, mortgage or rent and household costs to estimate your financial runway.",
    h1: "Redundancy runway calculator",
    primaryCta: "Build my private runway report",
    secondaryCta: "Estimate redundancy pay first",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Private runway report",
    intro: "Build a clearer picture of how redundancy pay, savings, housing costs and replacement income assumptions interact month by month.",
    intent: "This page is for users who want the product's core differentiation: private financial runway modelling rather than only a statutory pay estimate.",
    helps: [
      "Turn package and savings assumptions into an estimated runway period.",
      "Show how essential and flexible spending affect the capital path.",
      "Model mortgage, rent, partner income and replacement income assumptions in one place.",
      "Use the free estimate first, then unlock more detailed scenario comparisons if useful.",
    ],
    assumptions: [
      "The runway calculation is a scenario model based on the figures you enter.",
      "Essential costs and income assumptions usually affect runway more than small changes in the statutory estimate.",
      "The private report is designed for individual household planning, not employer or HR decision-making.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: statutory pay plus savings",
      body: "Someone with £12,000 statutory redundancy pay and £10,000 savings starts with £22,000 of capital before adding notice pay, holiday pay or other one-off income. The model then tests that capital against monthly burn.",
    },
    faqs: [
      { question: "What is a redundancy runway?", answer: "It is an estimate of how long your available capital may last while income is reduced or interrupted after redundancy." },
      { question: "Is this different from a redundancy pay calculator?", answer: "Yes. A redundancy pay calculator estimates the payment. A runway calculator tests how long the payment and savings may last." },
      { question: "Can I model cautious and optimistic scenarios?", answer: "Yes. The wider report lets you compare different income recovery and spending assumptions." },
    ],
    variant: "runway",
  },
  {
    slug: "income-loss-calculator-uk",
    metaTitle: "Income Loss Calculator UK",
    metaDescription: "Model how long savings and redundancy payments may last after job loss, reduced income or work disruption.",
    h1: "Income loss calculator UK",
    primaryCta: "Model income loss runway",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Income loss runway",
    intro: "Model a temporary income loss scenario using savings, redundancy payments, household costs and replacement income assumptions.",
    intent: "This page supports users facing redundancy, reduced income or job disruption who need a private runway model rather than only a redundancy pay estimate.",
    helps: [
      "Estimate how long accessible capital may last during reduced income.",
      "Model redundancy pay, savings and other one-off income together.",
      "Compare current costs with expected income during the gap.",
      `Unlock the ${RUNWAY_REPORT_FULL} for scenario comparisons and export.`,
    ],
    assumptions: [
      "Income loss can be partial or complete, so model more than one scenario if useful.",
      "This calculator does not predict job outcomes or replacement income timing.",
      "Benefits, tax, debt and employment questions may need official or professional sources.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: reduced income scenario",
      body: "A person moving from full salary to temporary part-time income can model the monthly gap rather than assuming income has fallen to zero.",
    },
    faqs: [
      { question: "What is an income loss calculator?", answer: "It models how savings, redundancy pay and other capital may interact with lower income and monthly spending under chosen assumptions." },
      { question: "Can I model reduced income rather than no income?", answer: "Yes. Use replacement income assumptions to test a lower-income period." },
      { question: "Is this a forecast?", answer: "No. It is scenario modelling only and does not predict employment or income outcomes." },
    ],
    variant: "runway",
  },
  {
    slug: "emergency-fund-runway-calculator",
    metaTitle: "Emergency Fund Runway Calculator UK",
    metaDescription: "Estimate how long your emergency fund may last under income loss, essential expenses and household commitments.",
    h1: "Emergency fund runway calculator",
    primaryCta: "Model my emergency fund runway",
    secondaryCta: "Estimate redundancy pay",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Emergency fund runway",
    intro: "An emergency fund is most useful when it is tested against actual household costs, housing commitments and possible income-gap assumptions.",
    intent: "This page is for users who want to model an emergency fund in a redundancy or income disruption context.",
    helps: [
      "Estimate how long an emergency fund may last under essential spending assumptions.",
      "Add redundancy pay or one-off income if those figures are relevant.",
      "Compare essential-only and wider household spending assumptions.",
      "Use the full report for pressure points, dashboard views and written output.",
    ],
    assumptions: [
      "Emergency fund runway changes when housing, debt, childcare or transport assumptions change.",
      "The model does not recommend how large an emergency fund needs to be.",
      "This page provides private modelling only, not financial planning advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: emergency fund under essential costs",
      body: "A £10,000 emergency fund may last very differently under £1,600 of monthly essentials compared with £3,000 of monthly essentials.",
    },
    faqs: [
      { question: "How do I calculate emergency fund runway?", answer: "Compare accessible emergency savings with the monthly gap between essential spending and reliable income under the scenario you choose." },
      { question: "Can I include redundancy pay?", answer: "Yes. Add redundancy pay as a separate package assumption when it is relevant." },
      { question: "Does this tell me how much emergency fund I need?", answer: "No. It models scenarios from figures you enter and does not provide personalised financial advice." },
    ],
    variant: "runway",
  },
  {
    slug: "mortgage-redundancy-calculator",
    metaTitle: "Mortgage Redundancy Calculator UK",
    metaDescription: "Model how mortgage or rent payments may affect your financial runway after redundancy or income disruption.",
    h1: "Mortgage redundancy calculator",
    primaryCta: "Model mortgage pressure",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Housing cost pressure",
    intro: "Model how a mortgage or rent payment affects financial runway after redundancy, restructuring or temporary income disruption.",
    intent: "This page is for homeowners and renters whose first concern is whether housing costs make the redundancy period harder to absorb.",
    helps: [
      "Put mortgage or rent into the monthly burn calculation.",
      "See how housing cost pressure affects estimated runway.",
      "Model income recovery assumptions before speaking to a lender or landlord.",
      "Separate mortgage planning from legal, tax or regulated mortgage advice.",
    ],
    assumptions: [
      "Housing costs are usually one of the largest fixed monthly expenses in a redundancy scenario.",
      "Mortgage options vary by lender and product; speak to your lender before missing a payment.",
      "This page models cashflow pressure only and does not provide regulated mortgage advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: housing cost sensitivity",
      body: "A household with a £1,600 mortgage and £900 of other essentials has a very different monthly burn from one with a £700 rent payment. The redundancy package may be identical, but the runway is not.",
    },
    faqs: [
      { question: "Can redundancy affect my mortgage?", answer: "It can affect affordability and cashflow. Lender options vary, so speak to your lender early if you may struggle to pay." },
      { question: "Does this calculate mortgage advice?", answer: "No. It models monthly cashflow pressure only and is not mortgage advice." },
      { question: "Can renters use this page?", answer: "Yes. Enter rent as the housing cost when modelling runway." },
    ],
    variant: "mortgage",
  },
  {
    slug: "redundancy-and-mortgage-payments",
    metaTitle: "Redundancy and Mortgage Payments",
    metaDescription: "Understand how redundancy may affect mortgage payment pressure and model your household runway privately.",
    h1: "Redundancy and mortgage payments",
    primaryCta: "Model mortgage payment pressure",
    secondaryCta: "Calculate redundancy pay",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Guide and calculator",
    intro: "Redundancy does not automatically mean a missed mortgage payment, but it can make monthly cashflow tighter. Start by modelling the payment pressure before making decisions.",
    intent: "This guide page supports users searching for practical mortgage-payment context, with a calculator CTA rather than regulated mortgage advice.",
    helps: [
      "Understand why mortgage payments dominate many redundancy runway models.",
      "Model the payment alongside redundancy pay, savings and household income.",
      "Prepare better questions before contacting your lender.",
      "Avoid relying on generic averages when your household numbers matter more.",
    ],
    assumptions: [
      "Always speak to your lender before missing or reducing a mortgage payment.",
      "Payment holidays, forbearance and product options depend on lender policy and your circumstances.",
      "This page gives general cashflow context and does not recommend mortgage actions.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: before calling the lender",
      body: "If your model shows six months of runway at current payments but only three months after a rate change or income delay, you can have a more specific conversation about options and timing.",
    },
    faqs: [
      { question: "What should I do first if redundancy affects mortgage payments?", answer: "Model your cashflow, gather your mortgage details and speak to your lender before missing any payment." },
      { question: "Can this tell me whether to take a payment holiday?", answer: "No. It can show cashflow pressure, but payment holidays and lender options need lender-specific guidance." },
      { question: "Should mortgage payments be treated as essential spending?", answer: "For most households, yes. The runway model treats housing as an essential monthly cost." },
    ],
    variant: "mortgage",
  },
  {
    slug: "one-income-household-calculator",
    metaTitle: "One-Income Household Calculator UK",
    metaDescription: "Model household finances if one income stops temporarily after redundancy, restructuring or job uncertainty.",
    h1: "One-income household calculator",
    primaryCta: "Model one-income household pressure",
    secondaryCta: "Start free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Household income gap",
    intro: "Model what happens if one income stops temporarily and the household needs to rely on partner income, savings, redundancy pay or reduced spending.",
    intent: "This page is for couples and families trying to understand household pressure when one person's income stops after redundancy or job uncertainty.",
    helps: [
      "Compare household costs with one reliable income instead of two.",
      "Add redundancy pay and savings to estimate the gap period.",
      "Test whether essential-only spending changes the runway.",
      "Keep household modelling private and assumption-based.",
    ],
    assumptions: [
      "Partner income should be included only if it is reliable under the scenario.",
      "Childcare, transport, debt repayments and housing can change the household runway materially.",
      "This calculator does not assess benefit entitlement or make employment predictions.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: one income carrying essentials",
      body: "If one partner's income covers most essentials, the redundancy package may mainly cover the remaining monthly gap. If one income covers only part of essentials, savings may run down faster.",
    },
    faqs: [
      { question: "How do I model a one-income household?", answer: "Enter the reliable income that remains, add redundancy pay and savings, then compare those resources with essential monthly costs." },
      { question: "Should I remove the lost salary entirely?", answer: "For a cautious scenario, yes. Then add only income you realistically expect during the gap period." },
      { question: "Can this model families with children?", answer: "Yes. Include childcare, food, transport, housing and other essential household costs in the runway model." },
    ],
    variant: "household",
  },
  {
    slug: "redundancy-budget-calculator",
    metaTitle: "Redundancy Budget Calculator UK",
    metaDescription: "Model essential and flexible monthly costs after redundancy and see how they affect your financial runway.",
    h1: "Redundancy budget calculator",
    primaryCta: "Model redundancy budget assumptions",
    secondaryCta: "Build my private runway report",
    secondaryHref: "/wizard",
    badge: "Budget runway",
    intro: "A redundancy budget is not just a list of cuts. It is a scenario model that separates essential costs, flexible costs, housing and income assumptions.",
    intent: "This page is for users who want to understand how monthly costs affect runway after redundancy or income disruption.",
    helps: [
      "Separate essential spending from flexible monthly costs.",
      "See how housing, debt, childcare and transport affect runway.",
      "Test spending assumptions alongside redundancy pay and savings.",
      `Use the ${RUNWAY_REPORT_FULL} to see expense sensitivity and capital path.`,
    ],
    assumptions: [
      "Budget modelling is assumption-based and changes when costs or income assumptions change.",
      "This page does not provide debt, benefits, mortgage or financial advice.",
      "Use professional or official support where individual budgeting decisions involve regulated advice or debt support.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: budget sensitivity",
      body: "Reducing flexible spending may add runway, but fixed costs such as housing and debt repayments can still dominate the monthly burn rate.",
    },
    faqs: [
      { question: "What should a redundancy budget include?", answer: "It usually includes housing, utilities, food, transport, insurance, debt repayments, childcare and flexible spending assumptions." },
      { question: "Can I compare essential-only spending?", answer: "Yes. The full report helps compare baseline assumptions with more cautious spending scenarios." },
      { question: "Is this budgeting advice?", answer: "No. It is an assumption-based modelling tool and does not provide financial or debt advice." },
    ],
    variant: "runway",
  },
  {
    slug: "job-loss-calculator-uk",
    metaTitle: "Job Loss Calculator UK",
    metaDescription: "Model how long savings may last after job loss, redundancy, reduced income or household income disruption.",
    h1: "Job loss calculator UK",
    primaryCta: "Model job loss runway",
    secondaryCta: "Use the redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Job loss runway",
    intro: "Model a job loss or income disruption scenario using savings, redundancy pay, household costs and replacement income assumptions.",
    intent: "This page captures broader job-loss searches while keeping the product focused on private household runway modelling.",
    helps: [
      "Estimate runway if income stops or reduces temporarily.",
      "Add redundancy pay where job loss is redundancy-related.",
      "Model savings, monthly costs and income recovery assumptions together.",
      `Use the ${PAID_REPORT_LABEL} for detailed scenario comparisons.`,
    ],
    assumptions: [
      "This page does not predict job loss, re-employment timing or income recovery.",
      "Use redundancy pay fields only when redundancy is part of the scenario being modelled.",
      "The calculator is B2C private modelling only, not employer or HR tooling.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: job loss runway",
      body: "A person with savings, a redundancy package and some expected replacement income can model the monthly gap rather than relying on a single headline payout figure.",
    },
    faqs: [
      { question: "Can this model job loss that is not redundancy?", answer: "Yes. You can model income disruption using savings, costs and replacement income assumptions, with redundancy pay set to zero if it does not apply." },
      { question: "Does this predict how long I will be out of work?", answer: "No. It lets you choose income recovery assumptions and compare the effects." },
      { question: "Can I use this with a redundancy package?", answer: "Yes. Add statutory, enhanced, notice or holiday assumptions where they are relevant to the scenario." },
    ],
    variant: "runway",
  },
  {
    slug: "at-risk-of-redundancy-what-to-do",
    metaTitle: "At Risk of Redundancy: What to Do Next",
    metaDescription: "A calm guide to what to organise if your role is at risk, including pay assumptions, consultation questions and next-step planning.",
    h1: "At risk of redundancy: what to do next",
    primaryCta: "Start a 7-Day Redundancy Reset",
    primaryHref: "/redundancy-reset",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "At-risk next steps",
    intro: "If your role is at risk, the useful first move is to organise facts: dates, pay assumptions, consultation questions, household costs and what you can control this week.",
    intent: "This page supports people who have been told their role may be at risk and need a practical first checklist before making financial decisions.",
    helps: [
      "List the documents and dates to gather before consultation meetings.",
      "Clarify statutory, notice, holiday and enhanced package assumptions.",
      "Prepare calm questions about selection, timing, alternatives and support.",
      "Move from uncertainty into either the free calculator or the 7-Day Redundancy Reset.",
    ],
    assumptions: [
      "Being at risk is not the same as being dismissed; consultation and alternatives may still matter.",
      "Package assumptions should be checked against written employer information before relying on them.",
      "This page is general information only and is not legal, employment or financial advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: organise before you react",
      body: "Before accepting verbal figures, gather your start date, gross weekly pay, notice period, holiday balance and any written redundancy policy. Those details make the calculator and consultation questions much more useful.",
    },
    faqs: [
      { question: "What should I do first if I am at risk of redundancy?", answer: "Collect written information, confirm key dates, estimate the package, list consultation questions and model household cashflow before making major decisions." },
      { question: "Should I use the calculator before consultation ends?", answer: "Yes, as a scenario estimate. Update it when your employer confirms exact figures." },
      { question: "Can the 7-Day Reset give legal advice?", answer: "No. It is practical written support and organisation, not legal or financial advice." },
    ],
    variant: "reset",
  },
  {
    slug: "made-redundant-what-next",
    metaTitle: "Made Redundant: What Next?",
    metaDescription: "Organise your first steps after redundancy, including money, documents, job search, household pressure and next-step planning.",
    h1: "Made redundant: what next?",
    primaryCta: "Start a 7-Day Redundancy Reset",
    primaryHref: "/redundancy-reset",
    secondaryCta: "Calculate redundancy pay",
    secondaryHref: "/free-redundancy-calculator",
    badge: "After redundancy",
    intro: "After redundancy, the priority is not to solve everything at once. Start with paperwork, cashflow, benefits signposting, job-search structure and household pressure.",
    intent: "This page is for people who have already been made redundant and need a practical next-step sequence rather than a generic rights article.",
    helps: [
      "Sort final pay, redundancy pay, notice pay, holiday pay and unpaid wage assumptions.",
      "Build a first cashflow view using savings, package and essential costs.",
      "Create a short job-search and admin plan for the first few weeks.",
      "Choose between the free calculator and a structured 7-Day Reset.",
    ],
    assumptions: [
      "Final pay can include several components that may be taxed differently.",
      "The first household runway estimate should be updated when final payslips and package details arrive.",
      "Official benefits calculators and professional advice may be needed for personal entitlement questions.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: first practical sequence",
      body: "Confirm the termination date and final pay date, estimate the package, list essential monthly costs, note priority payments, then set a job-search routine that feels manageable.",
    },
    faqs: [
      { question: "What should I do after being made redundant?", answer: "Check documents, estimate your package, protect essential payments, update your CV and job-search plan, and model how long your money may last." },
      { question: "Should I claim benefits after redundancy?", answer: "You may need to check official guidance or benefits calculators. This site does not calculate benefit entitlement." },
      { question: "What if my final pay looks wrong?", answer: "Ask your employer for a written breakdown and consider ACAS, Citizens Advice or professional advice if the issue is not resolved." },
    ],
    variant: "reset",
  },
  {
    slug: "first-week-after-redundancy",
    metaTitle: "First Week After Redundancy: Practical Next Steps",
    metaDescription: "A calm first-week guide after redundancy, including money, paperwork, household costs and next-step planning.",
    h1: "First week after redundancy",
    primaryCta: "Start a 7-Day Redundancy Reset",
    primaryHref: "/redundancy-reset",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "First-week plan",
    intro: "The first week after redundancy is for stabilising: paperwork, money, household basics, job-search setup and deciding what needs attention now versus later.",
    intent: "This page gives a seven-day shape to a stressful first week, with a clear path into the paid Reset product after useful free guidance.",
    helps: [
      "Break the first week into manageable admin, money and job-search tasks.",
      "Estimate package and runway without needing perfect information.",
      "Identify payment pressure points before they become urgent.",
      "Use the 7-Day Reset for structured support if the list feels too heavy.",
    ],
    assumptions: [
      "You do not need perfect figures to start a first scenario model.",
      "Priority payments, final payslip checks and job-search setup can run in parallel.",
      "This page is practical organisation only, not advice on employment claims or investments.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: a calmer first week",
      body: "Day one might be documents and dates. Day two can be package estimation. Day three can be essential costs. By the end of the week, the aim is a clearer runway model and a short list of follow-ups.",
    },
    faqs: [
      { question: "What should I prioritise in the first week after redundancy?", answer: "Documents, money dates, essential costs, benefit or support signposting, job-search setup and any urgent household payments." },
      { question: "Do I need exact figures before using the calculator?", answer: "No. Use best estimates first and update them when confirmed figures arrive." },
      { question: "What is the 7-Day Redundancy Reset?", answer: "It is a structured paid support product for organising next steps after redundancy. It is not legal or financial advice." },
    ],
    variant: "reset",
  },
  {
    slug: "redundancy-action-plan",
    metaTitle: "Redundancy Action Plan UK",
    metaDescription: "Create a practical redundancy action plan and model your runway using a private UK redundancy calculator.",
    h1: "Redundancy action plan",
    primaryCta: "Start a 7-Day Redundancy Reset",
    primaryHref: "/redundancy-reset",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Action plan",
    intro: "A useful redundancy action plan connects three things: package assumptions, household runway and the next practical steps you can take this week.",
    intent: "This page is for users who want a structured plan rather than scattered articles, with a natural bridge to Reset and the calculator.",
    helps: [
      "Turn uncertainty into a short written plan for money, documents and job search.",
      "Estimate redundancy pay and runway before committing to bigger decisions.",
      "Separate urgent tasks from useful-but-later tasks.",
      "Use Reset for a guided seven-day structure if you want written support.",
    ],
    assumptions: [
      "A plan should be updated as employer figures, final pay and income assumptions change.",
      "The calculator gives scenario modelling, not a guarantee of entitlement or outcomes.",
      "Legal, tax, mortgage and benefits questions may require specialist or official sources.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: three-part plan",
      body: "Your plan might include a package checklist, a 3-month cashflow view and a job-search routine. Keeping those together helps you avoid solving the same problem from scratch every day.",
    },
    faqs: [
      { question: "What should a redundancy action plan include?", answer: "Package details, money dates, essential costs, runway estimate, job-search actions, support contacts and follow-up questions." },
      { question: "Can I make a plan before I know the final package?", answer: "Yes. Start with scenarios and update the plan when confirmed numbers arrive." },
      { question: "Is the action plan financial advice?", answer: "No. It is an organisation tool and modelling framework, not regulated advice." },
    ],
    variant: "reset",
  },
  {
    slug: "redundancy-consultation-questions",
    metaTitle: "Redundancy Consultation Questions to Ask",
    metaDescription: "Prepare questions for a redundancy consultation and understand what assumptions to clarify before modelling your package.",
    h1: "Redundancy consultation questions",
    primaryCta: "Build my private report",
    primaryHref: "/wizard",
    secondaryCta: "Start a 7-Day Redundancy Reset",
    secondaryHref: "/redundancy-reset",
    badge: "Consultation prep",
    intro: "A redundancy consultation is easier to navigate when you know what to clarify: selection, timing, alternatives, package assumptions, notice, holiday and support.",
    intent: "This page helps users prepare calm, practical questions for a redundancy consultation before modelling package and runway assumptions.",
    helps: [
      "Prepare questions about selection criteria, scoring and alternative roles.",
      "Clarify package components before relying on calculator outputs.",
      "Ask about timing, notice, holiday, final pay and support.",
      "Move consultation answers into a private runway report.",
    ],
    assumptions: [
      "Consultation rules and rights depend on circumstances, so use this as a preparation checklist only.",
      "Ask for written figures where possible before modelling exact package assumptions.",
      "This page is general information only and is not employment law advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: questions that improve the model",
      body: "Ask when employment would end, whether notice is worked or paid, how holiday is calculated, whether enhanced terms apply and when payment is expected. Those answers directly change your runway assumptions.",
    },
    faqs: [
      { question: "What questions should I ask in redundancy consultation?", answer: "Ask about selection criteria, scoring, alternatives, timing, package components, notice, holiday, final pay and support." },
      { question: "Can I ask for redundancy figures in writing?", answer: "Yes, asking for written assumptions can help you check figures and model your position more accurately." },
      { question: "Does this page give legal advice?", answer: "No. It is a general preparation checklist. Consider ACAS or legal advice for your specific rights." },
    ],
    variant: "consultation",
  },
  {
    slug: "questions-to-ask-in-redundancy-consultation",
    metaTitle: "Questions to Ask in a Redundancy Consultation",
    metaDescription: "A practical checklist of questions to ask during redundancy consultation, with links to calculator and next-step planning.",
    h1: "Questions to ask in a redundancy consultation",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Start a 7-Day Redundancy Reset",
    secondaryHref: "/redundancy-reset",
    badge: "Deeper checklist",
    intro: "Use this deeper checklist to prepare consultation questions by theme: role selection, alternatives, pay, timing, documents and support.",
    intent: "This page is intentionally a deeper checklist than the shorter consultation guide, so it has its own canonical URL rather than duplicating the other page.",
    helps: [
      "Group questions by consultation topic so the meeting is easier to follow.",
      "Identify the answers that affect redundancy pay and runway modelling.",
      "Prepare follow-up questions for unclear package or payment details.",
      "Link consultation answers to the free calculator and Reset support.",
    ],
    assumptions: [
      "Use these questions as prompts, not as a script or legal advice.",
      "Write down answers and ask for documents where figures or dates affect your money plan.",
      "Different employers and redundancy exercises may require different follow-up questions.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: checklist by theme",
      body: "Start with why your role is at risk, then ask how selection works, what alternatives exist, what package assumptions apply, when payments happen and what support is available.",
    },
    faqs: [
      { question: "Should I bring written questions to consultation?", answer: "Yes. Written questions make it easier to stay calm and capture answers accurately." },
      { question: "Which consultation answers affect the calculator?", answer: "Termination date, weekly pay, years of service, notice treatment, holiday balance, enhanced terms and payment timing can all affect modelling." },
      { question: "Is this the same as the redundancy consultation questions page?", answer: "No. This page is a deeper checklist organised by theme; the other page is a shorter preparation guide." },
    ],
    variant: "consultation",
  },
  {
    slug: "what-to-do-before-redundancy-consultation",
    metaTitle: "What to Do Before a Redundancy Consultation",
    metaDescription: "Prepare for redundancy consultation by organising documents, pay assumptions, questions and household runway figures.",
    h1: "What to do before a redundancy consultation",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Start a 7-Day Redundancy Reset",
    secondaryHref: "/redundancy-reset",
    badge: "Before consultation",
    intro: "Before a redundancy consultation, it helps to organise the facts that affect both the meeting and your money model: dates, documents, package assumptions and questions.",
    intent: "This page is for users preparing for consultation who need a calm pre-meeting checklist rather than legal advice.",
    helps: [
      "List the documents, dates and pay details to gather before the meeting.",
      "Identify which answers may affect redundancy pay, notice, holiday and final pay.",
      "Prepare practical questions about selection, alternatives, timing and support.",
      "Move from consultation preparation into calculator or Reset support.",
    ],
    assumptions: [
      "Consultation rights and employer process depend on circumstances, so this is a preparation guide only.",
      "Ask for written figures where possible before relying on package assumptions.",
      "This page does not provide legal, employment, financial, tax or benefits advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: useful pre-meeting notes",
      body: "A simple prep note might include start date, weekly pay, notice period, holiday balance, proposed leaving date, selection questions and any alternative-role questions.",
    },
    faqs: [
      { question: "What can I prepare before redundancy consultation?", answer: "Prepare key dates, documents, pay details, consultation questions and any package assumptions that affect your calculator inputs." },
      { question: "Can I use the calculator before consultation?", answer: "Yes. Treat it as scenario modelling and update it when written figures or dates are confirmed." },
      { question: "Does this page explain consultation law?", answer: "No. It is a practical checklist. Use ACAS, Citizens Advice or professional support for individual rights questions." },
    ],
    variant: "consultation",
  },
  {
    slug: "worried-about-losing-your-job",
    metaTitle: "Worried About Losing Your Job?",
    metaDescription: "Model your financial runway and organise your next steps if you are worried about redundancy, restructuring or income disruption.",
    h1: "Worried about losing your job?",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Start a 7-Day Redundancy Reset",
    secondaryHref: "/redundancy-reset",
    badge: "Job uncertainty planning",
    intro: "If work feels uncertain, the aim is to reduce noise: model a few practical money scenarios, gather facts, and decide what needs attention this week.",
    intent: "This page supports people who are anxious about possible job loss but do not yet have confirmed redundancy details.",
    helps: [
      "Model a cautious income disruption scenario without predicting job loss.",
      "Estimate possible redundancy pay if redundancy becomes relevant.",
      "Separate facts from assumptions so the next steps feel more contained.",
      "Use the 7-Day Reset if a written plan would help organise the week.",
    ],
    assumptions: [
      "This page does not predict redundancy, dismissal, restructuring outcomes or income recovery.",
      "Scenario modelling can be useful even when figures are still uncertain.",
      "Use confirmed employer information where available and update assumptions when facts change.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: three calm scenarios",
      body: "You might model no income change, a three-month income gap and a reduced-income period. Those scenarios do not say what will happen; they show what different assumptions could mean.",
    },
    faqs: [
      { question: "Can I use this before redundancy is confirmed?", answer: "Yes. Use it for scenario planning only, then update the model if your employer confirms details." },
      { question: "Does the calculator predict job loss?", answer: "No. It models money assumptions and does not predict employment outcomes." },
      { question: "What if I want help organising next steps?", answer: "The 7-Day Redundancy Reset is a private written support product for organising practical next steps. It is not advice." },
    ],
    variant: "reset",
  },
  {
    slug: "my-job-is-at-risk-what-should-i-do",
    metaTitle: "My Job Is at Risk: What Should I Do?",
    metaDescription: "A calm planning guide for job uncertainty, including redundancy pay, runway modelling and next-step support.",
    h1: "My job is at risk: what should I do?",
    primaryCta: "Start a 7-Day Redundancy Reset",
    primaryHref: "/redundancy-reset",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "At-risk planning",
    intro: "When a job is at risk, the useful next move is usually organisation: written facts, pay assumptions, consultation questions and a realistic household runway model.",
    intent: "This page is for users searching in a stressful moment and needing a structured, non-alarmist next-step path.",
    helps: [
      "Organise what is known, unknown and worth clarifying.",
      "Estimate redundancy pay assumptions if role-risk becomes redundancy.",
      "Connect package assumptions to household runway and essential costs.",
      "Use Reset for a bounded written plan for the next seven days.",
    ],
    assumptions: [
      "Being at risk is not the same as a confirmed dismissal or confirmed redundancy payment.",
      "The calculator is useful for scenarios but does not decide entitlement or outcomes.",
      "Legal, employment, benefits, tax, debt and mortgage questions may need official or professional support.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: organise the unknowns",
      body: "A role-risk note might include the consultation date, possible leaving date, pay details, notice period, household costs and three questions to clarify in writing.",
    },
    faqs: [
      { question: "What can I do if my job is at risk?", answer: "Gather written information, estimate package assumptions, model household runway and prepare practical questions for consultation." },
      { question: "Can Reset tell me what decision to make?", answer: "No. Reset provides practical written organisation and next-step structure, not financial, legal or employment advice." },
      { question: "Can I use the calculator with uncertain figures?", answer: "Yes. Start with scenarios and update the model when figures are confirmed." },
    ],
    variant: "reset",
  },
  {
    slug: "redundancy-next-steps",
    metaTitle: "Redundancy Next Steps UK",
    metaDescription: "Understand the next steps after redundancy or job uncertainty and create a practical 7-day reset plan.",
    h1: "Redundancy next steps",
    primaryCta: "Start a 7-Day Redundancy Reset",
    primaryHref: "/redundancy-reset",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Next-step plan",
    intro: "Redundancy next steps are easier to handle when they are grouped: documents, pay assumptions, household runway, support signposting and job-search structure.",
    intent: "This page is for users who want a practical next-step sequence and a bridge into the 7-Day Reset product.",
    helps: [
      "Turn redundancy or job uncertainty into a short next-step sequence.",
      "Connect documents and package figures to calculator assumptions.",
      "Model household runway before bigger decisions feel urgent.",
      "Use the 7-Day Reset for a tangible written plan by Day 7.",
    ],
    assumptions: [
      "A useful next-step plan should be updated when employer figures, final pay or income assumptions change.",
      "This page provides organisation and signposting only, not regulated or professional advice.",
      "The calculator and Reset do not predict employment outcomes or determine legal entitlement.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: next steps by theme",
      body: "A first plan might group tasks into money dates, package estimate, essential costs, consultation questions, benefits signposting and job-search setup.",
    },
    faqs: [
      { question: "What are useful redundancy next steps?", answer: "Organise documents, estimate pay assumptions, model runway, clarify consultation or final pay questions, and set a practical job-search routine." },
      { question: "How is this different from the calculator?", answer: "The calculator models numbers. The 7-Day Reset helps turn those numbers into a structured written next-step plan." },
      { question: "Is the 7-Day Reset live advice?", answer: "No. It is private written support and practical organisation only." },
    ],
    variant: "reset",
  },
  {
    slug: "redundancy-rights-uk",
    metaTitle: "Redundancy Rights UK",
    metaDescription: "Understand common UK redundancy rights and use the calculator to estimate statutory redundancy pay assumptions.",
    h1: "Redundancy rights UK",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Prepare consultation questions",
    secondaryHref: "/redundancy-consultation-questions",
    badge: "General rights guide",
    intro: "Understand the common redundancy rights people usually need to check first: redundancy pay, notice, consultation, alternative roles and time off to look for work.",
    intent: "This page captures broad redundancy rights searches while staying general and pointing users to official support for personal legal questions.",
    helps: [
      "Identify the main topics to check when redundancy is proposed.",
      "Understand which figures affect the statutory pay estimate.",
      "Prepare better questions about notice, consultation and final pay.",
      "Move from general rights context into calculator or Reset support.",
    ],
    assumptions: [
      "Redundancy rights depend on employment status, service, employer process and individual circumstances.",
      "GOV.UK and ACAS are the right starting points for official rights guidance.",
      "This page is general information only and is not employment law advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: rights topics to separate",
      body: "A person may need to check statutory redundancy pay, notice period, consultation process and final holiday pay separately. Those topics affect different parts of the money plan.",
    },
    faqs: [
      { question: "What redundancy rights should I check first?", answer: "Check redundancy pay eligibility, notice, consultation, selection process, alternative roles and final pay breakdown." },
      { question: "Can this page tell me if my redundancy is fair?", answer: "No. It provides general context only. Use ACAS, Citizens Advice or legal advice for your specific position." },
      { question: "Can I still use the calculator while checking rights?", answer: "Yes. Use it for scenario modelling, then update assumptions when your employer confirms figures." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/redundancy-your-rights", label: "GOV.UK redundancy rights" },
      { href: "https://www.acas.org.uk/redundancy", label: "ACAS redundancy guidance" },
    ],
    variant: "rights",
  },
  {
    slug: "benefits-after-redundancy",
    metaTitle: "Benefits After Redundancy UK",
    metaDescription: "Understand common benefit considerations after redundancy and model your household runway privately.",
    h1: "Benefits after redundancy",
    primaryCta: "Model household runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Benefits signposting",
    intro: "After redundancy, benefit questions can matter, but entitlement depends on household circumstances. Use official calculators for benefits and use this site to model private runway assumptions.",
    intent: "This page helps users understand where benefits fit after redundancy without pretending to calculate entitlement.",
    helps: [
      "Separate benefit entitlement questions from private cashflow modelling.",
      "Signpost official benefits calculators and Universal Credit guidance.",
      "Model savings, redundancy pay and household costs privately.",
      "Avoid relying on generic benefit figures that may not fit your household.",
    ],
    assumptions: [
      "This site does not calculate benefit entitlement or Universal Credit awards.",
      "Benefits can depend on savings, partner income, housing costs, children, health, existing benefits and location.",
      "Use official or independent benefits calculators for entitlement estimates.",
    ],
    example: {
      title: "Example: benefits and runway are different questions",
      body: "A benefits calculator may estimate possible support. The runway calculator models how your redundancy pay, savings and costs may last under the assumptions you choose.",
    },
    faqs: [
      { question: "Can I claim benefits after redundancy?", answer: "Possibly, but entitlement depends on your circumstances. Use official or independent benefits calculators to check." },
      { question: "Does this page calculate benefits?", answer: "No. It signposts official support and helps you model household runway separately." },
      { question: "What information do benefits calculators usually need?", answer: "They often need savings, income, partner income, existing benefits, housing costs, childcare and council tax details." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
      { href: "https://www.gov.uk/universal-credit", label: "GOV.UK Universal Credit" },
    ],
    variant: "benefits",
  },
  {
    slug: "claiming-universal-credit-after-redundancy",
    metaTitle: "Claiming Universal Credit After Redundancy",
    metaDescription: "Find official Universal Credit claim routes after redundancy and model household runway separately.",
    h1: "Claiming Universal Credit after redundancy",
    primaryCta: "Model household runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Universal Credit signposting",
    intro: "Universal Credit may be relevant after redundancy for some households, but entitlement and timing depend on personal circumstances. Use GOV.UK for claims and this calculator for runway scenarios.",
    intent: "This page is for users looking for claim-route signposting after redundancy while keeping the product boundary clear: no benefit entitlement calculation.",
    helps: [
      "Understand that Universal Credit is a separate entitlement question from redundancy pay.",
      "Signpost official GOV.UK Universal Credit guidance.",
      "Model a cautious household runway with zero or estimated support.",
      "Avoid treating benefit support as confirmed income until entitlement and payment amount are clear.",
    ],
    assumptions: [
      "This site does not assess Universal Credit eligibility or payment amounts.",
      "Universal Credit can depend on income, savings, partner circumstances, housing and existing benefits.",
      "Use GOV.UK and official claim routes for Universal Credit questions.",
    ],
    example: {
      title: "Example: cautious runway modelling",
      body: "If you are unsure whether Universal Credit applies, model one scenario with no benefit support and another with an estimated amount from an official benefits calculator.",
    },
    faqs: [
      { question: "Can I claim Universal Credit after redundancy?", answer: "You may be able to, depending on your circumstances. Check GOV.UK or an official benefits calculator." },
      { question: "Should I include Universal Credit in my runway?", answer: "Only include it as a scenario assumption until your entitlement and payment amount are confirmed." },
      { question: "Does redundancy pay affect Universal Credit?", answer: "It may affect means-tested support depending on savings and other circumstances. Check official guidance for your position." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/universal-credit", label: "GOV.UK Universal Credit" },
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
    ],
    variant: "benefits",
  },
  {
    slug: "universal-credit-after-redundancy",
    metaTitle: "Universal Credit After Redundancy Guide",
    metaDescription: "Understand Universal Credit after redundancy and use private runway modelling for household cashflow scenarios.",
    h1: "Universal Credit after redundancy guide",
    primaryCta: "Model household runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Universal Credit signposting",
    intro: "Universal Credit may be relevant after redundancy for some households. Entitlement depends on personal circumstances, so use official guidance for benefits and this site for private runway modelling.",
    intent: "This page supports Universal Credit after redundancy searches while keeping a clear boundary: RedundancyCalculatorUK does not assess benefit entitlement.",
    helps: [
      "Separate Universal Credit questions from redundancy pay and runway modelling.",
      "Signpost GOV.UK and official benefits calculators for entitlement checks.",
      "Model household runway with no support or with a cautious estimated support scenario.",
      "Keep redundancy pay, savings and monthly costs visible as separate assumptions.",
    ],
    assumptions: [
      "This site does not assess Universal Credit eligibility or payment amounts.",
      "GOV.UK says Universal Credit eligibility can depend on income, work status, age, residency and money, savings and investments.",
      "Use official benefits calculators or a local benefits adviser for entitlement questions.",
    ],
    example: {
      title: "Example: benefits check separate from runway",
      body: "A household might use an official benefits calculator for entitlement and separately model runway using savings, redundancy pay, housing costs and income assumptions.",
    },
    faqs: [
      { question: "Can I claim Universal Credit after redundancy?", answer: "Possibly, depending on your circumstances. Use GOV.UK or an official benefits calculator rather than this site for entitlement." },
      { question: "Should I include Universal Credit in my runway?", answer: "Only as a scenario assumption until entitlement and payment amount are confirmed." },
      { question: "Does this page calculate Universal Credit?", answer: "No. It signposts official support and helps you model household runway separately." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/universal-credit", label: "GOV.UK Universal Credit" },
      { href: "https://www.gov.uk/universal-credit/eligibility", label: "GOV.UK Universal Credit eligibility" },
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
    ],
    variant: "benefits",
  },
  {
    slug: "does-redundancy-pay-affect-universal-credit",
    metaTitle: "Does Redundancy Pay Affect Universal Credit?",
    metaDescription: "Understand how redundancy payments may interact with benefits and why package type and savings assumptions matter.",
    h1: "Does redundancy pay affect Universal Credit?",
    primaryCta: "Model household runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Benefits and capital",
    intro: "Redundancy pay can affect the wider household picture because benefits, savings, final pay and monthly costs are separate questions. Use official sources for Universal Credit and use the runway model for cashflow assumptions.",
    intent: "This page answers a common benefits question without calculating entitlement or implying how Universal Credit will treat a specific package.",
    helps: [
      "Separate redundancy payment, notice pay, holiday pay and savings assumptions.",
      "Understand why benefit entitlement questions need official calculators or advisers.",
      "Model runway with and without assumed benefit support.",
      "Avoid treating unconfirmed benefit support as available income.",
    ],
    assumptions: [
      "This page does not calculate Universal Credit entitlement or payment reductions.",
      "GOV.UK states Universal Credit has eligibility rules involving money, savings and investments.",
      "Redundancy packages can include components with different payroll and tax treatment.",
    ],
    example: {
      title: "Example: package and benefits are different models",
      body: "A person may have statutory redundancy pay, PILON, holiday pay and savings. Benefits entitlement should be checked officially, while the runway model can test household cashflow scenarios.",
    },
    faqs: [
      { question: "Does redundancy pay affect Universal Credit?", answer: "It may, depending on your circumstances and how the payment affects income, savings or capital. Use GOV.UK or an official benefits calculator." },
      { question: "Can this site tell me my Universal Credit amount?", answer: "No. It does not calculate benefits. It only models household runway assumptions." },
      { question: "How should I model benefit uncertainty?", answer: "Use cautious scenarios, such as no benefit support and an estimated amount from an official calculator, until figures are confirmed." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/universal-credit/eligibility", label: "GOV.UK Universal Credit eligibility" },
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
    ],
    variant: "benefits",
  },
  {
    slug: "redundancy-pay-and-benefits",
    metaTitle: "Redundancy Pay and Benefits UK",
    metaDescription: "Understand common benefit considerations after redundancy pay, notice pay and final pay.",
    h1: "Redundancy pay and benefits",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Benefits signposting",
    intro: "Redundancy pay and benefits should be kept as separate questions: one is a package and payroll model, the other is an entitlement question for official tools or advisers.",
    intent: "This page helps users understand where redundancy pay, notice pay, final pay and benefits fit without providing benefits advice.",
    helps: [
      "Separate statutory redundancy, notice pay, holiday pay and final pay assumptions.",
      "Signpost official benefits calculators for entitlement checks.",
      "Model household runway using confirmed package and savings assumptions.",
      "Keep benefit support as a scenario input until confirmed.",
    ],
    assumptions: [
      "This site does not assess benefit entitlement or Universal Credit awards.",
      "Benefits can depend on household income, savings, partner circumstances, housing, children and existing benefits.",
      "Use official or independent benefits calculators for entitlement estimates.",
    ],
    example: {
      title: "Example: two checks, one runway",
      body: "You might estimate the redundancy package here, check benefits using GOV.UK-listed calculators, then use the runway model to test the combined household assumptions.",
    },
    faqs: [
      { question: "Can redundancy pay affect benefits?", answer: "It may, depending on the benefit and your circumstances. Use official guidance or a benefits calculator for your position." },
      { question: "Does notice pay count the same as redundancy pay?", answer: "Not necessarily. Notice pay, holiday pay and wages should be separated from statutory redundancy pay." },
      { question: "Can I model benefits in the runway calculator?", answer: "Yes, as a scenario assumption, but this is not an entitlement calculation." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
      { href: "https://www.gov.uk/universal-credit", label: "GOV.UK Universal Credit" },
    ],
    variant: "benefits",
  },
  {
    slug: "can-i-claim-jsa-after-redundancy",
    metaTitle: "Can I Claim JSA After Redundancy?",
    metaDescription: "General information about JSA after redundancy and how to model your household runway while checking official guidance.",
    h1: "Can I claim JSA after redundancy?",
    primaryCta: "Model household runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "JSA signposting",
    intro: "New Style Jobseeker's Allowance may be relevant after redundancy for some people, but eligibility depends on official rules. Use GOV.UK for JSA and this site for private runway modelling.",
    intent: "This page captures JSA-after-redundancy searches while avoiding any eligibility decision or benefit calculation.",
    helps: [
      "Signpost GOV.UK New Style JSA eligibility guidance.",
      "Separate contribution-based JSA questions from Universal Credit questions.",
      "Model household runway while benefit support is being checked.",
      "Keep redundancy pay, savings and monthly costs as visible assumptions.",
    ],
    assumptions: [
      "This site does not assess JSA eligibility or payment amounts.",
      "GOV.UK says New Style JSA eligibility depends on employee work history and Class 1 National Insurance contributions, usually in the last 2 to 3 years.",
      "GOV.UK also says Universal Credit may be available at the same time or instead of New Style JSA.",
    ],
    example: {
      title: "Example: JSA check and runway model",
      body: "A person can check New Style JSA on GOV.UK and separately model how redundancy pay, savings and essential costs may last while income is reduced.",
    },
    faqs: [
      { question: "Can I claim JSA after redundancy?", answer: "Possibly, depending on New Style JSA eligibility rules. Check GOV.UK for your position." },
      { question: "Do savings affect New Style JSA?", answer: "GOV.UK states savings and a partner's savings will not affect a New Style JSA claim, but other rules still apply." },
      { question: "Can I claim Universal Credit as well?", answer: "GOV.UK says Universal Credit may be available at the same time or instead of New Style JSA, depending on circumstances." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/jobseekers-allowance", label: "GOV.UK Jobseeker's Allowance" },
      { href: "https://www.gov.uk/jobseekers-allowance/eligibility", label: "GOV.UK JSA eligibility" },
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
    ],
    variant: "benefits",
  },
  {
    slug: "redundancy-pay-and-savings-benefits",
    metaTitle: "Redundancy Pay, Savings and Benefits",
    metaDescription: "Understand why redundancy payments and savings can matter for benefits and household runway assumptions.",
    h1: "Redundancy pay, savings and benefits",
    primaryCta: "Model household runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Savings and benefits",
    intro: "Redundancy pay, savings and benefits interact differently depending on the benefit and household circumstances. Keep entitlement checks official and use this site for private runway assumptions.",
    intent: "This page helps users who are unsure how redundancy payments and savings fit into benefits and cashflow planning.",
    helps: [
      "Separate redundancy pay, savings and final pay assumptions.",
      "Signpost official calculators for benefit entitlement questions.",
      "Model runway using savings and package figures without predicting benefit outcomes.",
      "Create cautious scenarios while support amounts are unconfirmed.",
    ],
    assumptions: [
      "This page does not calculate benefits or decide entitlement.",
      "GOV.UK says Universal Credit eligibility includes money, savings and investments.",
      "Benefits calculators typically need savings, income, partner income, existing benefits and housing costs.",
    ],
    example: {
      title: "Example: savings in two models",
      body: "Savings can affect a runway model because they add starting capital. They may also matter for means-tested benefits, which should be checked using official or independent benefits calculators.",
    },
    faqs: [
      { question: "Do savings affect benefits after redundancy?", answer: "They may affect some benefits. Use GOV.UK or official benefits calculators to check your circumstances." },
      { question: "Should I include savings in the runway calculator?", answer: "Yes, if they are accessible and you want to model them as part of household capital." },
      { question: "Can this page tell me what to claim?", answer: "No. It provides general signposting and private modelling only." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/universal-credit/eligibility", label: "GOV.UK Universal Credit eligibility" },
      { href: "https://www.gov.uk/benefits-calculators", label: "GOV.UK benefits calculators" },
    ],
    variant: "benefits",
  },
  {
    slug: "employer-insolvent-redundancy-pay",
    metaTitle: "Employer Insolvent: Redundancy Pay",
    metaDescription: "General information on redundancy pay when an employer is insolvent and how to organise your runway assumptions.",
    h1: "Employer insolvent: redundancy pay",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Model my runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Insolvency signposting",
    intro: "If an employer is insolvent, redundancy pay and unpaid final-pay questions may need official routes. Use GOV.UK for claims and use this site to organise package and runway assumptions.",
    intent: "This page is for users whose employer may be insolvent and who need general signposting plus a private way to model household runway.",
    helps: [
      "Separate statutory redundancy pay from unpaid wages, holiday pay and notice pay.",
      "Signpost official GOV.UK information about insolvent employers.",
      "Model household runway while payment timing or claim details are uncertain.",
      "Keep claim questions separate from the private calculator output.",
    ],
    assumptions: [
      "This page does not decide whether an employer is insolvent or whether a claim will be accepted.",
      "GOV.UK says employer insolvency can include administration, liquidation, bankruptcy, receivership and other formal processes.",
      `Statutory redundancy pay and some insolvency-related payments are subject to caps; this calculator uses ${formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)} as the current weekly pay cap.`,
    ],
    example: {
      title: "Example: claim route and runway model",
      body: "A person may need to check the official claim route for redundancy pay while also modelling how savings and essential costs may last during a payment gap.",
    },
    faqs: [
      { question: "What if my employer is insolvent and I am owed redundancy pay?", answer: "Use GOV.UK and the Insolvency Service claim route for official claim questions. This page only helps organise modelling assumptions." },
      { question: "Can this calculator submit a claim?", answer: "No. It is separate from the government claim service and does not submit claims." },
      { question: "Can I still model runway while waiting?", answer: "Yes. Use cautious scenarios for payment timing and update the model when claim details are confirmed." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/your-rights-if-your-employer-is-insolvent", label: "GOV.UK employer insolvency rights" },
      { href: "https://www.gov.uk/claim-redundancy", label: "GOV.UK claim redundancy and other money owed" },
    ],
    variant: "rights",
  },
  {
    slug: "redundancy-payments-service-claim",
    metaTitle: "Redundancy Payments Service Claim",
    metaDescription: "General information on claiming redundancy-related payments when an employer is insolvent, with private runway modelling.",
    h1: "Redundancy Payments Service claim",
    primaryCta: "Model my runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Claim signposting",
    intro: "The Redundancy Payments Service claim route is separate from RedundancyCalculatorUK. Use official services for claims and this calculator to model household runway assumptions.",
    intent: "This page captures Redundancy Payments Service claim searches while keeping users pointed to GOV.UK for official action.",
    helps: [
      "Understand which money components may need to be listed separately.",
      "Signpost the GOV.UK claim service for redundancy and other money owed.",
      "Model cashflow while waiting for claim information or payment timing.",
      "Avoid mixing official claim status with private scenario modelling.",
    ],
    assumptions: [
      "This site is not the Redundancy Payments Service and cannot check or submit a claim.",
      "GOV.UK says the claim service may cover redundancy payment or other money like wages, holiday and commission where an employer cannot pay.",
      "Claim requirements, evidence and timing should be checked through GOV.UK or the Insolvency Service.",
    ],
    example: {
      title: "Example: information to keep separate",
      body: "A claim may ask for employment details and money owed, while the runway model needs package, savings, income and essential cost assumptions.",
    },
    faqs: [
      { question: "Is this the Redundancy Payments Service?", answer: "No. RedundancyCalculatorUK is a private modelling tool. Use GOV.UK for the official claim service." },
      { question: "What details may a claim need?", answer: "GOV.UK lists details such as a case reference, National Insurance number, employment details, bank details and money owed." },
      { question: "Why model runway during a claim?", answer: "Payment timing can affect household cashflow, so cautious runway scenarios can help organise assumptions while official steps continue." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/claim-redundancy", label: "GOV.UK claim redundancy and other money owed" },
      { href: "https://www.gov.uk/your-rights-if-your-employer-is-insolvent", label: "GOV.UK employer insolvency rights" },
    ],
    variant: "rights",
  },
  {
    slug: "employer-has-not-paid-redundancy",
    metaTitle: "Employer Has Not Paid Redundancy",
    metaDescription: "General information on unpaid redundancy pay and how to model your household runway while seeking appropriate support.",
    h1: "Employer has not paid redundancy",
    primaryCta: "Model my runway",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Unpaid redundancy",
    intro: "If redundancy pay has not been paid, separate the official support question from the household runway question. This page signposts official routes and helps organise modelling assumptions.",
    intent: "This page is for users searching because an expected redundancy payment has not arrived or an employer may be unable to pay.",
    helps: [
      "Separate redundancy pay from unpaid wages, holiday pay and notice pay.",
      "Signpost GOV.UK if the employer cannot pay because of insolvency.",
      "Model runway with delayed, partial or unconfirmed payment assumptions.",
      "Prepare figures before contacting official or professional support.",
    ],
    assumptions: [
      "This page does not decide whether money is legally owed or whether an employer is insolvent.",
      "If the employer cannot pay, GOV.UK provides an official claim route for redundancy and other money owed.",
      "Use written employer information, payslips and official claim updates when available.",
    ],
    example: {
      title: "Example: delayed payment scenario",
      body: "If a payment is expected but not confirmed, model one runway scenario without it and another with the payment arriving later, then update the figures when the position is clearer.",
    },
    faqs: [
      { question: "What if my employer has not paid redundancy?", answer: "Ask for written information and use GOV.UK or appropriate support if the employer cannot pay or is insolvent. This page is general signposting only." },
      { question: "Can this page tell me if my employer is wrong?", answer: "No. It does not provide legal or employment advice and does not decide entitlement." },
      { question: "Can I model delayed redundancy pay?", answer: "Yes. Use scenarios with and without the payment until the timing is confirmed." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/claim-redundancy", label: "GOV.UK claim redundancy and other money owed" },
      { href: "https://www.gov.uk/your-rights-if-your-employer-is-insolvent", label: "GOV.UK employer insolvency rights" },
      { href: "https://www.acas.org.uk/redundancy", label: "ACAS redundancy guidance" },
    ],
    variant: "rights",
  },
  {
    slug: "claim-redundancy-pay-from-government",
    metaTitle: "Claim Redundancy Pay From Government",
    metaDescription: "General information on when redundancy-related payments may be claimed from government-backed services.",
    h1: "Claim redundancy pay from government",
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Government claim route",
    intro: "Government-backed redundancy payment routes are official services, not part of this calculator. Use GOV.UK for claims and use this site for private package and runway modelling.",
    intent: "This page captures claim-redundancy-pay-from-government searches while routing users to official services and keeping the calculator boundary clear.",
    helps: [
      "Signpost the GOV.UK claim service for insolvent employer situations.",
      "Estimate statutory redundancy pay as a private scenario input.",
      "Separate claim questions from household runway modelling.",
      "Model payment timing uncertainty without treating outcomes as confirmed.",
    ],
    assumptions: [
      "This page does not submit or manage government claims.",
      "GOV.UK says the official claim service applies where an employer owes redundancy payment or other money and is unable to pay, for example because they are insolvent.",
      "Claim eligibility and evidence should be checked through GOV.UK or the Insolvency Service.",
    ],
    example: {
      title: "Example: official claim plus private estimate",
      body: "You might use GOV.UK for the claim itself and use the calculator here to estimate statutory redundancy pay and model household runway while payment timing is uncertain.",
    },
    faqs: [
      { question: "Can I claim redundancy pay from government?", answer: "Possibly in some insolvent-employer situations. Use GOV.UK for the official rules and claim service." },
      { question: "Does this site connect to the government claim service?", answer: "No. It is a separate private modelling tool." },
      { question: "Why use the calculator?", answer: "It can help estimate package and runway assumptions, but it does not decide or submit any claim." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/claim-redundancy", label: "GOV.UK claim redundancy and other money owed" },
      { href: "https://www.gov.uk/your-rights-if-your-employer-is-insolvent/what-you-can-get", label: "GOV.UK what you can get if employer is insolvent" },
    ],
    variant: "rights",
  },
  {
    slug: "unpaid-wages-redundancy",
    metaTitle: "Unpaid Wages After Redundancy",
    metaDescription: "General information on unpaid wages after redundancy and how to include final pay assumptions in your runway model.",
    h1: "Unpaid wages after redundancy",
    primaryCta: "Model final pay assumptions",
    primaryHref: "/redundancy-final-pay-calculator",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Unpaid wages",
    intro: "Unpaid wages after redundancy are different from statutory redundancy pay. Keep wages, holiday, notice and redundancy components separate before modelling the household runway.",
    intent: "This page helps users organise unpaid wage assumptions without presenting a legal claim decision.",
    helps: [
      "Separate unpaid wages from statutory redundancy pay.",
      "Include unpaid wages as a final-pay assumption in the wider runway model.",
      "Signpost GOV.UK where the employer is insolvent and unable to pay.",
      "Avoid treating gross unpaid wages as the same as tax-free redundancy pay.",
    ],
    assumptions: [
      "This page does not decide whether wages are owed or whether a claim will succeed.",
      "GOV.UK says unpaid wages and other money owed can be part of an insolvent-employer claim route, subject to official rules.",
      "Unpaid wages are generally different from statutory redundancy pay for tax and payroll treatment.",
    ],
    example: {
      title: "Example: final pay components",
      body: "A final-pay scenario might include statutory redundancy, unpaid wages, holiday pay and notice pay. Keeping them separate helps the runway model stay clearer.",
    },
    faqs: [
      { question: "Are unpaid wages the same as redundancy pay?", answer: "No. Wages are a separate final-pay component and should be modelled separately from statutory redundancy pay." },
      { question: "What if my employer is insolvent?", answer: "Use GOV.UK for official information about claims for money owed by an insolvent employer." },
      { question: "Can I include unpaid wages in runway?", answer: "Yes, as a scenario assumption, but update the model when payment details are confirmed." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/claim-redundancy", label: "GOV.UK claim redundancy and other money owed" },
      { href: "https://www.gov.uk/your-rights-if-your-employer-is-insolvent/what-you-can-get", label: "GOV.UK what you can get if employer is insolvent" },
    ],
    variant: "rights",
  },
  {
    slug: "holiday-pay-owed-after-redundancy",
    metaTitle: "Holiday Pay Owed After Redundancy",
    metaDescription: "Understand how accrued holiday pay may form part of final pay after redundancy and model your package assumptions.",
    h1: "Holiday pay owed after redundancy",
    primaryCta: "Estimate holiday pay assumptions",
    primaryHref: "/holiday-pay-redundancy-calculator",
    secondaryCta: "Model final pay assumptions",
    secondaryHref: "/redundancy-final-pay-calculator",
    badge: "Holiday pay signposting",
    intro: "Holiday pay owed after redundancy should be modelled separately from statutory redundancy pay. It may affect final pay and runway assumptions, but official guidance or support may be needed for disputes.",
    intent: "This page supports holiday-pay-after-redundancy searches while keeping the calculator focused on assumptions rather than entitlement decisions.",
    helps: [
      "Separate accrued holiday pay from redundancy pay and notice pay.",
      "Estimate holiday pay assumptions for the package model.",
      "Signpost GOV.UK holiday entitlement and insolvent-employer guidance.",
      "Move final-pay assumptions into household runway modelling.",
    ],
    assumptions: [
      "This page does not decide whether holiday pay is owed or calculate legal entitlement.",
      "GOV.UK says payment in lieu of untaken statutory leave happens when someone leaves a job.",
      "If an employer is insolvent, GOV.UK has separate guidance on holiday pay that may be claimed, subject to official rules and caps.",
    ],
    example: {
      title: "Example: holiday pay in final pay",
      body: "A person with untaken holiday may model holiday pay separately from redundancy pay, then include the combined final-pay estimate in the runway model.",
    },
    faqs: [
      { question: "Is holiday pay part of redundancy pay?", answer: "No. Holiday pay is a separate final-pay component and should be modelled separately." },
      { question: "Can I be paid for untaken holiday when leaving?", answer: "GOV.UK says payment in lieu of untaken statutory leave applies when someone leaves a job. Check official guidance for your circumstances." },
      { question: "Can the calculator decide my holiday entitlement?", answer: "No. It helps model assumptions only and does not provide employment law advice." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/holiday-entitlement-rights/taking-holiday-before-leaving-a-job", label: "GOV.UK holiday before leaving a job" },
      { href: "https://www.gov.uk/your-rights-if-your-employer-is-insolvent/what-you-can-get", label: "GOV.UK insolvent employer holiday pay" },
    ],
    variant: "rights",
  },
  {
    slug: "redundancy-pay-over-40",
    metaTitle: "Redundancy Pay Over 40 UK",
    metaDescription: "Estimate redundancy pay over 40 using UK age-band rules and service assumptions.",
    h1: "Redundancy pay over 40",
    primaryCta: "Estimate redundancy pay over 40",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Age-specific estimate",
    intro: "Redundancy pay over 40 can change once complete service years fall into the 41-plus age band. The estimate is still driven by age, weekly pay and complete years of service.",
    intent: "This page supports over-40 redundancy pay searches and then helps users move from the statutory estimate into runway planning.",
    helps: [
      "Estimate statutory redundancy pay using the age-band formula.",
      "Understand why complete years worked at 41 or older can use a higher multiplier.",
      "Keep statutory pay separate from notice, holiday and enhanced package assumptions.",
      "Move the estimate into a household runway view with savings and monthly costs.",
    ],
    assumptions: [
      "The statutory formula looks at your age during each complete year of service.",
      "Years worked at 41 or older use the 1.5-week multiplier.",
      "This is a planning estimate, not a decision on employment rights.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: crossing the 41-plus band",
      body: "A person aged 44 may have some complete service years counted at the 22-to-40 rate and later years counted at the 41-plus rate. The calculator keeps the age bands visible before runway planning.",
    },
    faqs: [
      { question: "Does redundancy pay increase after 40?", answer: "The statutory formula uses the 1.5-week multiplier for complete service years worked at age 41 or older, subject to the weekly pay cap and service limit." },
      { question: "Does every over-40 year use the higher rate?", answer: "No. The formula looks at your age during each complete year of service, so earlier years may use a different multiplier." },
      { question: "Can I model the package after the estimate?", answer: "Yes. You can add notice, holiday or enhanced assumptions and then model household runway." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", label: "GOV.UK statutory redundancy pay" },
      { href: "https://www.acas.org.uk/redundancy", label: "ACAS redundancy guidance" },
    ],
    variant: "age",
  },
  {
    slug: "redundancy-pay-after-5-years",
    metaTitle: "Redundancy Pay After 5 Years",
    metaDescription: "Estimate redundancy pay after 5 years of service and model how it may affect your runway.",
    h1: "Redundancy pay after 5 years",
    primaryCta: "Estimate pay after 5 years",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Service-year estimate",
    intro: "After 5 complete years of service, statutory redundancy pay depends on your age during those years and your weekly pay, with the statutory weekly cap applied where relevant.",
    intent: "This page targets users who know their service length and want a quick redundancy pay estimate before runway modelling.",
    helps: [
      "Start from a 5-year service assumption.",
      "Estimate the statutory baseline using age and weekly pay.",
      "Separate statutory redundancy from notice, holiday and enhanced package terms.",
      "Test what the estimated payment may mean for monthly household runway.",
    ],
    assumptions: [
      "This page starts with 5 complete years of service as a modelling assumption.",
      "Age during each complete year of service still affects the statutory multiplier.",
      "Employer-specific enhanced terms can change the total package.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: 5-year statutory baseline",
      body: "Someone with 5 complete years can estimate the statutory baseline first, then add notice pay, holiday pay or an enhanced amount if those are part of the employer package.",
    },
    faqs: [
      { question: "How is redundancy pay after 5 years calculated?", answer: "It uses complete years of service, age-band multipliers and weekly gross pay, with the statutory weekly cap applied where relevant." },
      { question: "Does 5 years always mean the same payment?", answer: "No. Age and weekly pay can change the statutory estimate, and enhanced employer terms can change the total package." },
      { question: "Why model runway after 5 years?", answer: "The pay estimate is only one part of the picture. Savings, spending and replacement income assumptions determine how long the money may last." },
    ],
    variant: "core",
  },
  {
    slug: "redundancy-pay-after-10-years",
    metaTitle: "Redundancy Pay After 10 Years",
    metaDescription: "Estimate redundancy pay after 10 years of service and model household runway assumptions.",
    h1: "Redundancy pay after 10 years",
    primaryCta: "Estimate pay after 10 years",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Service-year estimate",
    intro: "After 10 complete years of service, the statutory estimate can be meaningful enough to affect runway planning, especially when notice, holiday or enhanced terms are also involved.",
    intent: "This page supports users searching by a 10-year service point and connects the estimate to household runway planning.",
    helps: [
      "Start from a 10-year service assumption.",
      "Estimate statutory redundancy using age, pay and service.",
      "Add package components where an employer offer includes more than statutory redundancy.",
      "Model how the estimate interacts with mortgage, rent, bills and savings.",
    ],
    assumptions: [
      "This page starts with 10 complete years of service as a modelling assumption.",
      "Age-band multipliers may differ across the 10 years depending on your age during each service year.",
      "The statutory estimate is not the same as a full final-pay calculation.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: 10 years and monthly runway",
      body: "A 10-year service estimate may look useful on its own, but the planning value comes from comparing it with essential monthly costs and realistic income recovery assumptions.",
    },
    faqs: [
      { question: "How much redundancy pay after 10 years?", answer: "It depends on age, weekly gross pay and complete years of service. The calculator starts with 10 years so you can adjust the other assumptions." },
      { question: "Is there a maximum at 10 years?", answer: "The statutory cap applies to weekly pay, but the 20-year service cap is not reached on a 10-year assumption." },
      { question: "Can I include enhanced redundancy?", answer: "Yes. Use the package fields where your employer has provided an enhanced redundancy element." },
    ],
    variant: "core",
  },
  {
    slug: "redundancy-pay-after-20-years",
    metaTitle: "Redundancy Pay After 20 Years",
    metaDescription: "Estimate redundancy pay after 20 years of service and understand the service cap used in statutory calculations.",
    h1: "Redundancy pay after 20 years",
    primaryCta: "Estimate pay after 20 years",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Service cap estimate",
    intro: "After 20 complete years of service, the statutory service cap is reached. The calculator helps estimate the baseline before wider package and household runway assumptions.",
    intent: "This page supports long-service redundancy searches and explains the statutory service cap in a practical modelling context.",
    helps: [
      "Start from a 20-year service assumption.",
      "Understand that statutory service length is capped at 20 years.",
      "Separate the statutory cap from enhanced employer package terms.",
      "Model how a long-service payment may affect household runway.",
    ],
    assumptions: [
      "This page starts with 20 complete years of service as a modelling assumption.",
      "Statutory redundancy pay counts a maximum of 20 years of service.",
      "Enhanced employer terms may sit above the statutory baseline.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: long service and the cap",
      body: "Someone with 24 years of service may still have only 20 years counted for statutory redundancy pay. Enhanced package terms, if offered, should be modelled separately.",
    },
    faqs: [
      { question: "Is redundancy pay capped after 20 years?", answer: "Statutory redundancy pay only counts up to 20 years of service. Employer enhanced terms may use different rules." },
      { question: "Does age still matter after 20 years?", answer: "Yes. The statutory estimate still uses age-band multipliers for the complete service years that are counted." },
      { question: "Why model runway after long service?", answer: "A larger package can still be short or long depending on household costs, debts, savings and income recovery timing." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", label: "GOV.UK statutory redundancy pay" },
      { href: "https://www.acas.org.uk/redundancy", label: "ACAS redundancy guidance" },
    ],
    variant: "core",
  },
  {
    slug: "part-time-redundancy-pay-calculator",
    metaTitle: "Part-Time Redundancy Pay Calculator UK",
    metaDescription: "Estimate redundancy pay assumptions for part-time work using weekly pay and length of service.",
    h1: "Part-time redundancy pay calculator",
    primaryCta: "Estimate part-time redundancy pay",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Part-time estimate",
    intro: "For part-time work, the statutory redundancy estimate still starts with weekly pay, age and complete years of service. Use your normal gross weekly pay assumption, then model what the payment may mean for runway.",
    intent: "This page supports part-time redundancy calculator searches while keeping entitlement and dispute questions signposted to official guidance.",
    helps: [
      "Estimate redundancy pay using weekly pay from part-time work.",
      "Keep part-time pay assumptions separate from full-time comparisons.",
      "Add notice, holiday or enhanced package assumptions where relevant.",
      "Move the estimate into household runway planning.",
    ],
    assumptions: [
      "Use a realistic gross weekly pay assumption for the part-time role.",
      "The statutory formula still uses age, weekly pay and complete years of service.",
      "GOV.UK says part-time workers are protected from less favourable treatment because they are part time.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: part-time weekly pay",
      body: "A part-time employee can enter their gross weekly pay and complete years of service. If the employer offers notice, holiday or enhanced redundancy, those components can be modelled separately.",
    },
    faqs: [
      { question: "Can part-time workers get redundancy pay?", answer: "Part-time status alone does not remove redundancy pay planning. Eligibility depends on employment status, continuous service and the statutory rules." },
      { question: "What weekly pay should I enter?", answer: "Use the gross weekly pay assumption that reflects the part-time role, then update it if your employer confirms a different calculation." },
      { question: "Does this decide part-time rights?", answer: "No. It is a modelling tool only. Use official guidance or professional support for employment rights disputes." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/part-time-worker-rights", label: "GOV.UK part-time workers' rights" },
      { href: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", label: "GOV.UK statutory redundancy pay" },
    ],
    variant: "core",
  },
  {
    slug: "zero-hours-redundancy-pay-calculator",
    metaTitle: "Zero-Hours Redundancy Pay Calculator UK",
    metaDescription: "Estimate redundancy pay assumptions for variable-hours work and model how final pay may affect your runway.",
    h1: "Zero-hours redundancy pay calculator",
    primaryCta: "Estimate variable-hours pay",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Variable-hours estimate",
    intro: "Zero-hours and variable-hours situations often need careful weekly pay assumptions. Start with a cautious gross weekly pay figure, then update the model when the employer confirms the calculation.",
    intent: "This page supports zero-hours redundancy calculator searches while avoiding entitlement promises for variable-hours arrangements.",
    helps: [
      "Model a gross weekly pay assumption for variable-hours work.",
      "Separate redundancy, notice, holiday and final-pay components.",
      "Use scenario planning where hours or income have varied.",
      "Connect the estimate to runway planning for essential costs.",
    ],
    assumptions: [
      "Zero-hours contracts are also known as casual contracts in GOV.UK guidance.",
      "Use a cautious weekly pay assumption where hours have varied.",
      "Employment status and service questions may need official guidance or professional support.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: variable-hours scenario",
      body: "A zero-hours worker might model one weekly pay assumption based on recent normal earnings and another lower assumption as a sensitivity check before using the runway model.",
    },
    faqs: [
      { question: "Can zero-hours workers use this calculator?", answer: "Yes, for modelling assumptions. Eligibility and employment status questions may need official guidance or professional support." },
      { question: "What if my weekly pay changes a lot?", answer: "Model a cautious weekly pay assumption and update it when your employer confirms the calculation." },
      { question: "Does this provide employment law advice?", answer: "No. It helps organise numbers and runway assumptions only." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/contract-types-and-employer-responsibilities/zero-hour-contracts", label: "GOV.UK zero-hours contracts" },
      { href: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", label: "GOV.UK statutory redundancy pay" },
    ],
    variant: "core",
  },
  {
    slug: "fixed-term-contract-redundancy-pay",
    metaTitle: "Fixed-Term Contract Redundancy Pay UK",
    metaDescription: "General information on redundancy pay assumptions for fixed-term contracts and income disruption modelling.",
    h1: "Fixed-term contract redundancy pay",
    primaryCta: "Check redundancy assumptions",
    primaryHref: "/free-redundancy-calculator",
    secondaryCta: "Model income disruption",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Fixed-term signposting",
    intro: "Fixed-term contract redundancy pay depends on status, service and the reason the contract ends. This page helps organise assumptions and signposts official guidance before runway modelling.",
    intent: "This page supports fixed-term redundancy pay searches without deciding entitlement or employment law questions.",
    helps: [
      "Understand when fixed-term contract questions may need official guidance.",
      "Separate redundancy assumptions from normal contract end-date assumptions.",
      "Model pay, service and package assumptions where redundancy is relevant.",
      "Plan income disruption using household runway scenarios.",
    ],
    assumptions: [
      "This page does not decide whether a fixed-term contract ending is redundancy.",
      "GOV.UK says fixed-term employees with 2 years' continuous service have the same redundancy rights as permanent employees.",
      "GOV.UK says non-renewal may lead to statutory redundancy payments after 2 years' service if the reason is redundancy.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: contract ending versus redundancy",
      body: "A contract reaching its agreed end date is not the same planning question as a redundancy situation. If redundancy is relevant, model the pay assumptions and then test household runway.",
    },
    faqs: [
      { question: "Can fixed-term employees get redundancy pay?", answer: "GOV.UK says fixed-term employees with 2 years' continuous service have the same redundancy rights as permanent employees." },
      { question: "Is every fixed-term contract ending redundancy?", answer: "No. The reason for non-renewal matters. Use official guidance or professional support if the situation is unclear." },
      { question: "Can I model income disruption even if pay is uncertain?", answer: "Yes. You can model cautious scenarios for savings, monthly costs and income recovery while checking official guidance." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/fixed-term-contracts/employees-rights", label: "GOV.UK fixed-term employees' rights" },
      { href: "https://www.gov.uk/fixed-term-contracts/renewing-or-ending-a-fixedterm-contract", label: "GOV.UK renewing or ending fixed-term contracts" },
      { href: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", label: "GOV.UK statutory redundancy pay" },
    ],
    variant: "rights",
  },
  {
    slug: "redundancy-pay-over-50",
    metaTitle: "Redundancy Pay Over 50 UK",
    metaDescription: "Estimate redundancy pay over 50 and model how savings, mortgage costs and replacement income affect your runway.",
    h1: "Redundancy pay over 50",
    primaryCta: "Estimate redundancy pay over 50",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Age-specific estimate",
    intro: "Redundancy pay over 50 often reflects more years in the 41-plus age band, but the useful planning question is still how the package interacts with savings and household costs.",
    intent: "This page supports age-specific statutory multiplier searches for users over 50.",
    helps: [
      "Estimate the statutory redundancy baseline using age and complete years of service.",
      "Understand why years worked at 41 or older can use a higher multiplier.",
      "Add notice, holiday or enhanced assumptions where relevant.",
      "Move from the estimate into runway modelling.",
    ],
    assumptions: [
      "The statutory formula looks at your age during each complete year of service.",
      "Years worked at 41 or older use the 1.5-week multiplier.",
      "No pension, retirement or investment advice is provided here.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: higher age band, same weekly cap",
      body: "A person over 50 may have more service years counted at the 1.5-week multiplier, but weekly pay is still capped for statutory redundancy calculations.",
    },
    faqs: [
      { question: "Do people over 50 get more redundancy pay?", answer: "They may, because years worked at age 41 or older use a higher statutory multiplier, subject to the weekly pay cap and 20-year limit." },
      { question: "Does this include pension advice?", answer: "No. It estimates redundancy assumptions only and does not provide pension or retirement advice." },
      { question: "Should I model runway over 50?", answer: "Yes. Replacement income timing, mortgage costs and savings may matter as much as the statutory estimate." },
    ],
    variant: "age",
  },
  {
    slug: "redundancy-pay-over-60",
    metaTitle: "Redundancy Pay Over 60 UK",
    metaDescription: "Estimate redundancy pay over 60 and model household runway, pension-adjacent questions and income recovery assumptions.",
    h1: "Redundancy pay over 60",
    primaryCta: "Estimate redundancy pay over 60",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Age-specific estimate",
    intro: "Redundancy pay over 60 uses the same statutory formula, but planning may need extra care around income recovery, savings and household commitments.",
    intent: "This page supports over-60 redundancy pay searches while avoiding pension advice.",
    helps: [
      "Estimate statutory redundancy pay using age, pay and service.",
      "Understand the 41-plus age band and 20-year service cap.",
      "Keep redundancy pay separate from pension or retirement decisions.",
      "Model household runway under different income recovery assumptions.",
    ],
    assumptions: [
      "The statutory redundancy formula does not become a pension calculation because you are over 60.",
      "This page does not advise on pensions, retirement, drawdown, tax planning or investment decisions.",
      "Use specialist regulated advice for pension-adjacent decisions.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: redundancy and retirement are separate",
      body: "A statutory redundancy estimate may be straightforward, while pension or retirement choices can be complex. Keep the calculator output separate from regulated pension decisions.",
    },
    faqs: [
      { question: "Does redundancy pay over 60 use different rules?", answer: "The statutory age-band formula still applies, with the 41-plus multiplier, weekly pay cap and 20-year service limit." },
      { question: "Does this give pension advice?", answer: "No. It does not advise on pensions, retirement timing, drawdown, tax planning or investments." },
      { question: "Can I still model runway over 60?", answer: "Yes. You can model package, savings, household costs and replacement income assumptions privately." },
    ],
    variant: "age",
  },
  {
    slug: "redundancy-pay-less-than-2-years-service",
    metaTitle: "Redundancy Pay With Less Than 2 Years’ Service",
    metaDescription: "Understand redundancy pay eligibility with less than 2 years’ service and what other package assumptions may matter.",
    h1: "Redundancy pay with less than 2 years’ service",
    primaryCta: "Check package assumptions",
    secondaryCta: "Model household runway",
    secondaryHref: "/redundancy-runway-calculator",
    badge: "Eligibility question",
    intro: "With less than 2 years of continuous service, statutory redundancy pay is usually not available, but notice pay, holiday pay, unpaid wages or employer-specific terms may still matter.",
    intent: "This page addresses eligibility confusion for people with short service.",
    helps: [
      "Understand the basic 2-year statutory redundancy pay rule.",
      "Separate statutory redundancy from notice, holiday and final pay.",
      "Check whether employer-specific terms or settlement terms add anything.",
      "Model household runway even if statutory redundancy is zero.",
    ],
    assumptions: [
      "The calculator shows zero statutory redundancy when service is below 2 years.",
      "Notice pay, accrued holiday and unpaid wages can still be relevant.",
      "Short-service rights and dismissal questions may need ACAS, Citizens Advice or legal advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: zero statutory pay is not zero final pay",
      body: "Someone with 18 months of service may have no statutory redundancy pay, but still need to check notice pay, holiday pay and final wages.",
    },
    faqs: [
      { question: "Do I get redundancy pay with less than 2 years' service?", answer: "Normally you do not qualify for statutory redundancy pay with less than 2 years of continuous service." },
      { question: "Could I still receive other payments?", answer: "Yes. Notice pay, holiday pay, unpaid wages or employer-specific payments may still apply." },
      { question: "Should I still model runway?", answer: "Yes. Savings, notice pay, holiday pay and household costs still determine how much time you may have." },
    ],
    officialLinks: [
      { href: "https://www.gov.uk/redundancy-your-rights/redundancy-pay", label: "GOV.UK statutory redundancy pay" },
      { href: "https://www.acas.org.uk/redundancy", label: "ACAS redundancy guidance" },
    ],
    variant: "eligibility",
  },
  {
    slug: "ai-job-uncertainty-financial-planning",
    metaTitle: "AI Job Uncertainty Financial Planning Tool UK",
    metaDescription: "Model financial runway scenarios for AI, automation or structural job uncertainty without predicting job outcomes.",
    h1: "AI job uncertainty financial planning",
    primaryCta: "Model a job uncertainty scenario",
    primaryHref: "/redundancy-runway-calculator",
    secondaryCta: "Use the free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Scenario planning",
    intro: "If AI, automation or restructuring makes your work feel uncertain, model financial runway scenarios without assuming any specific job outcome will happen.",
    intent: "This page captures emerging AI job uncertainty searches while avoiding claims that a user's job is at risk.",
    helps: [
      "Model a cautious household runway scenario without predicting redundancy.",
      "Test savings, monthly costs and income-gap assumptions.",
      "Use scenario language rather than fear-based claims.",
      "Prepare calmly for uncertainty while keeping career outcomes separate.",
    ],
    assumptions: [
      "This page does not predict whether your job is at risk from AI or automation.",
      "Scenario modelling is a planning exercise, not a forecast.",
      "Use neutral assumptions and update them as real employment information changes.",
    ],
    example: {
      title: "Example: scenario without prediction",
      body: "You might model a 3-month income gap, a 6-month income gap and an essential-only spending scenario. None of those scenarios says your job will be lost; they simply show what your finances could look like if income changed.",
    },
    faqs: [
      { question: "Can this predict whether AI will affect my job?", answer: "No. It does not predict job outcomes, automation risk or redundancy likelihood." },
      { question: "Why model AI job uncertainty?", answer: "Scenario modelling can help you understand savings, costs and income gaps before any specific employment event occurs." },
      { question: "Should I use redundancy pay assumptions?", answer: "Only if redundancy is a realistic scenario you want to test. You can also model savings-only or income-gap scenarios." },
    ],
    variant: "ai",
  },
  {
    slug: "redundancy-entitlement-calculator",
    metaTitle: "Redundancy Entitlement Calculator UK",
    metaDescription: "Estimate statutory redundancy pay under UK age-band assumptions and model package components. Illustrative only — does not decide legal entitlement.",
    h1: "Redundancy entitlement calculator",
    primaryCta: "Calculate my redundancy pay",
    secondaryCta: "Model package components",
    secondaryHref: "/redundancy-package-calculator",
    badge: "Statutory estimate",
    intro: "Estimate statutory redundancy pay and model package assumptions from age, weekly pay and complete years of service. This does not decide legal entitlement.",
    intent: "This page is for users searching entitlement language who need a statutory estimate and clear non-advisory boundaries before modelling a wider package.",
    helps: [
      "Estimate statutory redundancy pay from the assumptions entered.",
      "Check whether the 2-year qualifying service rule is met under your inputs.",
      "Keep statutory redundancy separate from notice pay, holiday pay and enhanced terms.",
      "Move into package and runway modelling once the baseline estimate is clear.",
    ],
    assumptions: [
      ...baseAssumptions,
      "This calculator provides an illustrative estimate only and does not determine legal entitlement or employment rights.",
    ],
    example: {
      title: "Example: estimate before package extras",
      body: "Example only: someone with 8 complete years of service might use the statutory estimate as a baseline, then add notice pay, holiday pay or enhanced package figures separately when those assumptions are known.",
    },
    faqs: [
      { question: "Does this calculator decide legal entitlement?", answer: "No. It models statutory redundancy pay from the assumptions entered. Legal entitlement depends on individual circumstances and may require professional advice." },
      { question: "What inputs affect the statutory estimate?", answer: "Age during each complete year of service, complete years of service and gross weekly pay, subject to the statutory weekly cap and service limit." },
      { question: "Can I add notice pay or holiday pay?", answer: "Yes. Use the package calculator to model notice pay, holiday pay and enhanced terms alongside the statutory baseline." },
    ],
    variant: "eligibility",
  },
  {
    slug: "tax-free-redundancy-pay-calculator",
    metaTitle: "Tax-Free Redundancy Pay Calculator UK",
    metaDescription: "Estimate package components and separate tax-sensitive redundancy, notice and holiday pay assumptions. Illustrative only — not tax advice.",
    h1: "Tax-free redundancy pay calculator",
    primaryCta: "Estimate package components",
    secondaryCta: "See redundancy tax calculator",
    secondaryHref: "/redundancy-tax-calculator",
    badge: "Tax boundary estimate",
    intro: "Estimate package components and separate tax-sensitive assumptions for redundancy pay, notice pay and holiday pay. This is not tax advice.",
    intent: "This page is for users asking about tax-free redundancy treatment who need component separation rather than a personalised tax calculation.",
    helps: [
      "Separate genuine redundancy payment assumptions from notice pay and holiday pay.",
      "Show the general tax-free threshold used for statutory redundancy pay in the model.",
      "Keep unpaid wages, bonuses and other payroll items visible as separate assumptions.",
      "Use the estimate as an input to wider package and runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      `Statutory redundancy pay under ${formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} is generally not taxable, but other termination components can be treated differently.`,
      "This calculator does not calculate personal income tax, National Insurance or settlement-agreement tax treatment.",
    ],
    example: {
      title: "Example: not every component shares the same tax treatment",
      body: "Example only: a package might include statutory redundancy, PILON and accrued holiday. The calculator keeps those components separate so tax-sensitive assumptions are not merged into one headline figure.",
    },
    faqs: [
      { question: "Is all redundancy pay tax-free?", answer: "No. Genuine redundancy payment may fall within the general tax-free threshold, but notice pay, holiday pay, wages and some other components are usually treated as taxable employment income." },
      { question: "Does this calculate my exact tax bill?", answer: "No. It separates gross components and provides general information only. Use HMRC guidance or professional advice for your personal position." },
      { question: "Where can I model the full package?", answer: "Use the redundancy package calculator to bring statutory, notice, holiday and enhanced assumptions together." },
    ],
    variant: "tax",
  },
  {
    slug: "redundancy-pay-30000-tax-free",
    metaTitle: "Is Redundancy Pay £30,000 Tax-Free? UK Guide",
    metaDescription: "Understand how the £30,000 tax-free threshold may apply to redundancy payments in the UK and estimate package components under your assumptions.",
    h1: "Is redundancy pay £30,000 tax-free?",
    primaryCta: "Estimate my package components",
    secondaryCta: "Tax-free redundancy pay calculator",
    secondaryHref: "/tax-free-redundancy-pay-calculator",
    badge: "£30,000 threshold",
    intro: "Many people ask whether redundancy pay is tax-free up to £30,000. The answer depends on which payment components are included. Use this page to separate assumptions — not as tax advice.",
    intent: "This page answers the common £30,000 tax-free question while keeping notice pay, holiday pay and other payroll items separate from genuine redundancy payment assumptions.",
    helps: [
      "Explain the general £30,000 tax-free threshold context for genuine redundancy payments.",
      "Separate redundancy pay from notice pay, holiday pay and unpaid wages in the model.",
      "Avoid treating every termination pound as if it shares the same tax treatment.",
      "Move from component estimates into package and runway modelling.",
    ],
    assumptions: [
      `The calculator references the general ${formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)} tax-free threshold for genuine redundancy payments.`,
      "Notice pay, holiday pay, wages, bonuses and some settlement items may be taxed differently.",
      "This page does not provide tax advice or calculate personal liability.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: threshold vs package total",
      body: "Example only: a written package total might exceed £30,000 while only part of it relates to genuine redundancy payment. Separating components helps avoid overstating how much may be treated as tax-free under general rules.",
    },
    faqs: [
      { question: "Is redundancy pay always tax-free up to £30,000?", answer: "Genuine redundancy payment may fall within the general tax-free threshold, but the threshold does not automatically apply to every termination payment." },
      { question: "Does notice pay count towards the £30,000 threshold?", answer: "Notice pay is generally treated as taxable employment income and is usually modelled separately from genuine redundancy payment assumptions." },
      { question: "Can this tell me my personal tax position?", answer: "No. It is an illustrative component model only. Use payroll information, HMRC guidance or professional tax support for your situation." },
    ],
    variant: "tax",
  },
  {
    slug: "pilon-and-redundancy-pay-calculator",
    metaTitle: "PILON and Redundancy Pay Calculator UK",
    metaDescription: "Estimate payment in lieu of notice alongside statutory redundancy pay and keep PILON separate from the redundancy element.",
    h1: "PILON and redundancy pay calculator",
    primaryCta: "Estimate PILON and redundancy pay",
    secondaryCta: "PILON calculator",
    secondaryHref: "/pilon-calculator-redundancy",
    badge: "PILON + redundancy",
    intro: "Estimate payment in lieu of notice alongside statutory redundancy pay, keeping PILON separate from the redundancy element and from holiday pay assumptions.",
    intent: "This page is for users who need both PILON and redundancy pay modelled together before checking a written employer breakdown.",
    helps: [
      "Estimate gross PILON from weekly pay and notice weeks entered.",
      "Show statutory redundancy pay as a separate package component.",
      "Avoid treating PILON as a tax-free redundancy payment in assumptions.",
      "Use the combined package estimate in runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      "PILON terms depend on contract, employer policy and how notice is handled at termination.",
      "PILON is generally treated differently from genuine redundancy payment for tax purposes.",
    ],
    example: {
      title: "Example: two major package lines",
      body: "Example only: someone with 8 weeks' notice paid in lieu and a statutory redundancy estimate might have a materially different package total from redundancy pay alone. Modelling both lines separately keeps assumptions clearer.",
    },
    faqs: [
      { question: "Is PILON the same as redundancy pay?", answer: "No. PILON relates to notice that is paid rather than worked. Statutory redundancy pay is a separate element with its own calculation rules." },
      { question: "Can I include holiday pay too?", answer: "Yes. Use the package calculator to add accrued holiday pay alongside PILON and redundancy assumptions." },
      { question: "Does this decide what my employer owes?", answer: "No. It is an illustrative model based on the assumptions entered." },
    ],
    variant: "notice",
  },
  {
    slug: "redundancy-pay-notice-pay-holiday-pay",
    metaTitle: "Redundancy Pay, Notice Pay and Holiday Pay UK",
    metaDescription: "Estimate redundancy pay, notice pay and holiday pay as separate package components under the assumptions entered.",
    h1: "Redundancy pay, notice pay and holiday pay",
    primaryCta: "Model package components",
    secondaryCta: "Redundancy package calculator",
    secondaryHref: "/redundancy-package-calculator",
    badge: "Three-part package",
    intro: "A termination package often combines redundancy pay, notice pay and holiday pay. Estimate each component separately under the assumptions entered before modelling household runway.",
    intent: "This page is for users trying to understand how redundancy, notice and holiday pay fit together in a package estimate.",
    helps: [
      "Estimate statutory redundancy pay from age, service and weekly pay assumptions.",
      "Add notice weeks or PILON-style notice assumptions separately.",
      "Include accrued holiday pay as its own package line.",
      "Move the combined estimate into runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      "Notice pay, holiday pay and unpaid wages may be treated differently from statutory redundancy pay.",
      "Written employer breakdowns should be used to update assumptions when available.",
    ],
    example: {
      title: "Example: three lines, one package",
      body: "Example only: a written offer might list statutory redundancy, 12 weeks' notice and accrued holiday separately. Treating them as one lump sum can hide which parts affect tax treatment and runway assumptions.",
    },
    faqs: [
      { question: "Are redundancy pay, notice pay and holiday pay the same thing?", answer: "No. They are separate package components and are often treated differently for tax and payroll purposes." },
      { question: "Which component should I estimate first?", answer: "Start with the statutory redundancy baseline, then add notice and holiday assumptions when you have those figures or reasonable estimates." },
      { question: "Can this model enhanced redundancy too?", answer: "Yes. Use the package calculator to enter enhanced or manual redundancy amounts alongside notice and holiday assumptions." },
    ],
    variant: "package",
  },
  {
    slug: "redundancy-lump-sum-calculator",
    metaTitle: "Redundancy Lump Sum Calculator UK",
    metaDescription: "Estimate a redundancy lump sum from statutory, enhanced, notice and holiday assumptions, then model how long the money may last.",
    h1: "Redundancy lump sum calculator",
    primaryCta: "Estimate my lump sum",
    secondaryCta: "See how long it may last",
    secondaryHref: "/how-long-will-my-redundancy-pay-last",
    badge: "Total payout estimate",
    intro: "Estimate a redundancy lump sum from statutory redundancy, enhanced terms, notice pay and holiday pay assumptions — keeping each component visible rather than hiding them in one headline figure.",
    intent: "This page is for users who think in terms of a single lump sum but need the underlying package components separated first.",
    helps: [
      "Build a gross lump-sum estimate from separate package assumptions.",
      "Keep statutory redundancy visible even when an enhanced amount is entered.",
      "Add notice pay and holiday pay without merging them into the redundancy line.",
      "Link the lump-sum estimate to runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      "A headline lump sum may combine several payment types with different tax treatment.",
      "Payment timing assumptions may affect runway even when the gross total is the same.",
    ],
    example: {
      title: "Example: headline total vs components",
      body: "Example only: two people might receive the same lump-sum total, but one package could be mostly statutory redundancy while another is mostly notice pay and holiday. The runway impact can differ once tax and timing assumptions are considered.",
    },
    faqs: [
      { question: "Is a redundancy lump sum just statutory redundancy pay?", answer: "Not necessarily. A lump sum may include statutory redundancy, enhanced redundancy, notice pay, holiday pay and other final payroll items." },
      { question: "Should I enter a total or separate components?", answer: "Separate components usually give a clearer model. If you only have a total, treat it as a manual assumption and verify the breakdown when possible." },
      { question: "What should I do after estimating the lump sum?", answer: "Model how the payment may interact with savings, housing costs and income recovery assumptions." },
    ],
    variant: "package",
  },
  {
    slug: "redundancy-offer-calculator",
    metaTitle: "Redundancy Offer Calculator UK",
    metaDescription: "Model a written redundancy offer against statutory assumptions for redundancy pay, notice pay and holiday pay.",
    h1: "Redundancy offer calculator",
    primaryCta: "Model my redundancy offer",
    secondaryCta: "Compare enhanced offer",
    secondaryHref: "/enhanced-redundancy-offer-calculator",
    badge: "Offer modelling",
    intro: "Model a written redundancy offer against the statutory baseline, separating redundancy pay, notice pay, holiday pay and any enhanced terms under the assumptions entered.",
    intent: "This page is for users who have received or expect a redundancy offer and want to model the figures privately before deciding next steps.",
    helps: [
      "Compare an employer offer with the statutory redundancy baseline.",
      "Enter enhanced or manual redundancy amounts as package assumptions.",
      "Keep notice pay and holiday pay separate from the redundancy element.",
      "Move from the offer estimate into runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      "Offer terms depend on employer policy, contract, consultation outcome or agreement.",
      "This calculator does not provide employment law, tax or financial advice.",
    ],
    example: {
      title: "Example: offer vs statutory baseline",
      body: "Example only: an offer might match statutory redundancy on paper but include different notice or holiday assumptions. Modelling each line separately makes it easier to check the written breakdown.",
    },
    faqs: [
      { question: "Can this tell me whether to accept an offer?", answer: "No. It models package assumptions only. Decisions may involve legal, employment, tax and personal factors outside this tool." },
      { question: "What should I enter if I only have a headline figure?", answer: "Use a manual package assumption for now, then update the model when a written breakdown is available." },
      { question: "Does the tool contact my employer?", answer: "No. It is a private modelling tool for individuals." },
    ],
    variant: "package",
  },
  {
    slug: "enhanced-redundancy-offer-calculator",
    metaTitle: "Enhanced Redundancy Offer Calculator UK",
    metaDescription: "Compare an enhanced redundancy offer with the statutory baseline and model notice pay and holiday pay assumptions.",
    h1: "Enhanced redundancy offer calculator",
    primaryCta: "Compare enhanced offer",
    secondaryCta: "Voluntary redundancy offer",
    secondaryHref: "/voluntary-redundancy-offer-calculator",
    badge: "Enhanced offer",
    intro: "Compare an enhanced redundancy offer with the statutory baseline, then decide whether the additional amount changes your package and runway assumptions materially.",
    intent: "This page is for users whose employer has offered more than the statutory minimum and who want to model the enhanced terms calmly.",
    helps: [
      "Estimate the statutory redundancy baseline first.",
      "Enter an enhanced redundancy amount as a package assumption.",
      "Keep notice pay and holiday pay separate from the enhanced redundancy line.",
      "Link the bigger package to runway, not just headline value.",
    ],
    assumptions: [
      ...baseAssumptions,
      "Enhanced employer terms depend on contract, policy, consultation outcome or settlement terms.",
    ],
    example: {
      title: "Example: enhanced element vs runway",
      body: "Example only: an enhanced offer might add several thousand pounds to the redundancy line, but the useful question is how many additional months that buys under household burn-rate assumptions.",
    },
    faqs: [
      { question: "What is an enhanced redundancy offer?", answer: "It is an employer or contract-based payment above the statutory minimum. The exact terms depend on your situation." },
      { question: "Does enhanced redundancy replace statutory redundancy in the model?", answer: "An enhanced amount can be entered as the redundancy element for package modelling, while the statutory baseline remains useful as a reference." },
      { question: "Should I get advice before accepting enhanced terms?", answer: "Yes where terms are complex, settlement-related or legally significant. This calculator is non-advisory." },
    ],
    variant: "package",
  },
  {
    slug: "voluntary-redundancy-offer-calculator",
    metaTitle: "Voluntary Redundancy Offer Calculator UK",
    metaDescription: "Model a voluntary redundancy offer against statutory assumptions and estimate how the package may support household runway.",
    h1: "Voluntary redundancy offer calculator",
    primaryCta: "Model voluntary offer",
    secondaryCta: "Enhanced redundancy offer",
    secondaryHref: "/enhanced-redundancy-offer-calculator",
    badge: "Voluntary offer",
    intro: "Model a voluntary redundancy offer against the statutory baseline, including notice pay and holiday pay where those are part of the written assumptions.",
    intent: "This page is for employees considering a voluntary redundancy offer who want a private financial model before deciding next steps.",
    helps: [
      "Compare a voluntary redundancy offer with the statutory baseline.",
      "Include notice pay and holiday pay where they are part of the offer.",
      "Keep tax, legal and employment advice separate from calculator output.",
      "Prepare a fuller private runway report before accepting anything.",
    ],
    assumptions: [
      ...baseAssumptions,
      "Voluntary redundancy offers can involve settlement terms, so professional advice may be important.",
    ],
    example: {
      title: "Example: attractive offer, uncertain gap",
      body: "Example only: a voluntary redundancy offer may look generous but still create pressure if re-employment takes longer than expected or household costs are high.",
    },
    faqs: [
      { question: "Can this tell me whether to accept voluntary redundancy?", answer: "No. It can model package assumptions, but the decision may involve legal, employment, tax and personal factors." },
      { question: "What should I compare first?", answer: "Start with the statutory baseline, then compare the voluntary offer and the months of runway each assumption creates." },
      { question: "Does the tool contact my employer?", answer: "No. It is a private modelling tool for individuals." },
    ],
    variant: "package",
  },
  {
    slug: "redundancy-final-salary-calculator",
    metaTitle: "Redundancy Final Salary Calculator UK",
    metaDescription: "Estimate final salary payments alongside redundancy pay, notice pay and holiday pay assumptions in a termination package.",
    h1: "Redundancy final salary calculator",
    primaryCta: "Estimate final salary package",
    secondaryCta: "Final pay calculator",
    secondaryHref: "/redundancy-final-pay-calculator",
    badge: "Final salary",
    intro: "Final salary payments can sit alongside redundancy pay, notice pay and holiday pay in a termination package. Estimate each component separately under the assumptions entered.",
    intent: "This page is for users searching final salary in a redundancy context who need to separate payroll items from the redundancy element.",
    helps: [
      "Model redundancy pay separately from final salary and wages assumptions.",
      "Add notice pay and holiday pay without merging them into one line.",
      "Treat unpaid wages and bonuses as assumptions to verify separately.",
      "Use the package estimate as an input to runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      "Final salary, wages and bonuses may be treated differently from statutory redundancy pay.",
      "Use payroll documents or employer written figures to update assumptions when available.",
    ],
    example: {
      title: "Example: final salary is not redundancy pay",
      body: "Example only: a leaving payment might include final salary, accrued holiday, notice pay and statutory redundancy. Modelling only the headline total can hide which parts are redundancy and which are ordinary payroll.",
    },
    faqs: [
      { question: "Is final salary the same as redundancy pay?", answer: "No. Final salary and wages are separate from statutory redundancy pay and may have different tax treatment." },
      { question: "Can I model unpaid wages here?", answer: "Use package assumptions to note other payroll items, then verify figures against payslips or employer correspondence." },
      { question: "What should I do after estimating final pay?", answer: "Move into runway modelling to see how the combined package assumptions may interact with savings and monthly costs." },
    ],
    variant: "package",
  },
  {
    slug: "what-should-my-redundancy-package-include",
    metaTitle: "What Should My Redundancy Package Include? UK Guide",
    metaDescription: "See which components may appear in a UK redundancy package and model statutory, notice, holiday and enhanced assumptions separately.",
    h1: "What should my redundancy package include?",
    primaryCta: "Use the package calculator",
    primaryHref: "/redundancy-package-calculator",
    secondaryCta: "Package checklist",
    secondaryHref: "/redundancy-package-checklist",
    badge: "Package components",
    intro: "A redundancy package may include several different payments. Use this page to see which components are commonly modelled separately before entering your assumptions.",
    intent: "This page is for users who want a plain-English package checklist before using the calculator — not a legal entitlement decision.",
    helps: [
      "Identify common package components: statutory redundancy, enhanced terms, notice, holiday and final pay.",
      "Understand why each component is modelled separately.",
      "Prepare questions to verify written employer figures.",
      "Move from the checklist into the package calculator and runway model.",
    ],
    assumptions: [
      ...baseAssumptions,
      "Package contents depend on contract, employer policy and individual circumstances.",
      "This page provides general information only and does not determine what any employer must pay.",
    ],
    example: {
      title: "Example: checklist before modelling",
      body: "Example only: before entering figures, you might list statutory redundancy, notice treatment, holiday balance, enhanced terms, unpaid wages and payment timing. That list makes the calculator inputs easier to complete accurately.",
    },
    faqs: [
      { question: "What might a redundancy package include?", answer: "It may include statutory redundancy, enhanced redundancy, notice or PILON, holiday pay, unpaid wages and other final payroll items." },
      { question: "Should every component be added to the calculator?", answer: "Add the components you can estimate or verify. Missing items can be noted as assumptions to check rather than guessed as zero." },
      { question: "Does this page decide what I should receive?", answer: "No. It helps you organise assumptions and questions. Legal entitlement is outside this tool." },
    ],
    variant: "question",
  },
  {
    slug: "redundancy-package-checklist",
    metaTitle: "Redundancy Package Checklist UK",
    metaDescription: "A practical checklist of redundancy package components to verify before modelling pay and runway assumptions.",
    h1: "Redundancy package checklist",
    primaryCta: "Model my package",
    primaryHref: "/redundancy-package-calculator",
    secondaryCta: "Free redundancy calculator",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Verification checklist",
    intro: "Use this checklist to verify redundancy package components before modelling pay and runway assumptions. It is a preparation tool, not legal advice.",
    intent: "This page is for users who want a structured checklist of package lines to confirm before entering figures into the calculator.",
    helps: [
      "Check statutory redundancy assumptions against age, service and weekly pay inputs.",
      "Verify notice treatment, holiday balance and enhanced terms separately.",
      "Note payment timing, tax-sensitive components and items to confirm in writing.",
      "Move verified assumptions into the package calculator and private report.",
    ],
    assumptions: [
      "Use written employer figures where possible before relying on calculator outputs.",
      "Missing checklist items should be marked as assumptions to verify, not treated as zero by default.",
      "This checklist is general information only and is not employment law advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: checklist themes",
      body: "A practical checklist might cover redundancy pay, notice or PILON, holiday pay, unpaid wages, bonuses, payment date, pension references and any settlement wording — then map each confirmed figure into the calculator.",
    },
    faqs: [
      { question: "Why use a checklist before calculating?", answer: "Separating package components first reduces the risk of treating a headline total as if every pound is the same kind of payment." },
      { question: "Can I use this during consultation?", answer: "Yes, as a preparation aid. Ask for written figures where they affect your model." },
      { question: "Is this the same as the package calculator?", answer: "No. This page is a checklist. The package calculator turns your assumptions into estimates." },
    ],
    variant: "consultation",
  },
  {
    slug: "how-much-redundancy-pay-am-i-entitled-to",
    metaTitle: "How Much Redundancy Pay Am I Entitled To? UK Estimate",
    metaDescription: "Use this page to estimate statutory redundancy pay under the assumptions entered. Illustrative only — not employment law advice.",
    h1: "How much redundancy pay am I entitled to?",
    primaryCta: "Estimate my redundancy pay",
    secondaryCta: "How redundancy pay works",
    secondaryHref: "/how-does-redundancy-pay-work",
    badge: "Statutory estimate",
    intro: "Use this page to estimate statutory redundancy pay under the assumptions entered. It does not provide employment law advice or decide legal entitlement.",
    intent: "This page captures entitlement-style searches while keeping outputs firmly in estimate and modelling language.",
    helps: [
      "Estimate statutory redundancy pay from age, service and weekly pay assumptions.",
      "See why complete years of service and the weekly pay cap affect the model.",
      "Recognise package elements that are separate from statutory redundancy.",
      "Move from the estimate into package and runway modelling.",
    ],
    assumptions: [
      ...baseAssumptions,
      "This page provides an illustrative estimate only and does not determine legal entitlement.",
    ],
    example: {
      title: "Example: estimate depends on inputs",
      body: "Example only: two people with different ages, service years or weekly pay assumptions may see very different statutory estimates even when their situations feel similar.",
    },
    faqs: [
      { question: "Can this page tell me what I am entitled to?", answer: "No. It estimates statutory redundancy pay from the assumptions entered. Legal entitlement depends on individual circumstances." },
      { question: "What details do I need for the estimate?", answer: "Age, complete years of service and gross weekly pay are the core statutory inputs. Notice pay, holiday pay and enhanced terms are separate." },
      { question: "What should I do after the estimate?", answer: "Model the wider package and household runway, especially if notice pay, holiday pay or enhanced terms are involved." },
    ],
    variant: "question",
  },
  {
    slug: "what-redundancy-pay-am-i-entitled-to",
    metaTitle: "What Redundancy Pay Am I Entitled To? UK Guide",
    metaDescription: "Understand what may affect redundancy pay in the UK and estimate statutory pay under the assumptions entered. Not employment law advice.",
    h1: "What redundancy pay am I entitled to?",
    primaryCta: "Estimate statutory redundancy pay",
    secondaryCta: "Entitlement calculator",
    secondaryHref: "/redundancy-entitlement-calculator",
    badge: "Question guide",
    intro: "Redundancy pay questions often mix statutory redundancy, enhanced terms, notice pay and holiday pay. Use this page to separate those ideas and estimate statutory pay under the assumptions entered.",
    intent: "This page is for broad entitlement-style searches where users need component separation and a statutory estimate, not a legal answer.",
    helps: [
      "Explain the main statutory inputs: age, complete service years and weekly pay.",
      "Separate statutory redundancy from notice pay, holiday pay and enhanced package assumptions.",
      "Signpost when professional or official advice may be needed.",
      "Move from explanation into the calculator with your own assumptions.",
    ],
    assumptions: [
      ...baseAssumptions,
      "This page does not determine legal entitlement or provide employment law advice.",
    ],
    example: {
      title: "Example: different questions, different components",
      body: "Example only: someone asking about redundancy pay may actually need to model statutory redundancy, notice pay and holiday pay separately. The calculator keeps those lines visible.",
    },
    faqs: [
      { question: "Is redundancy pay only statutory redundancy?", answer: "Not always. A package may include statutory redundancy, enhanced redundancy, notice pay, holiday pay and other final payroll items." },
      { question: "Does this page provide legal advice?", answer: "No. It is general information and illustrative modelling only." },
      { question: "Where should I start?", answer: "Start with a statutory estimate, then add package components and runway assumptions." },
    ],
    variant: "question",
  },
  {
    slug: "is-my-redundancy-package-fair",
    metaTitle: "Is My Redundancy Package Fair? UK Comparison Guide",
    metaDescription: "This page cannot decide fairness or legal rights. Compare package assumptions and identify figures to verify before modelling runway.",
    h1: "Is my redundancy package fair?",
    primaryCta: "Model package assumptions",
    primaryHref: "/redundancy-package-calculator",
    secondaryCta: "Compare with statutory estimate",
    secondaryHref: "/free-redundancy-calculator",
    badge: "Comparison only",
    intro: "This page cannot decide fairness or legal rights. It helps you compare package assumptions and identify figures to verify before modelling runway.",
    intent: "This page is for users asking fairness questions who need comparison framing and strong non-advisory boundaries.",
    helps: [
      "Compare employer package assumptions with a statutory redundancy baseline.",
      "Identify which components are entered vs still missing.",
      "Prepare verification questions for written employer figures.",
      "Move from comparison into private runway modelling.",
    ],
    assumptions: [
      "Fairness and legal rights depend on individual circumstances and cannot be scored by this tool.",
      "Use written employer breakdowns and professional advice where terms are complex.",
      "This page is general information only and is not employment law advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: compare assumptions, not moral judgment",
      body: "Example only: you might compare statutory redundancy, notice pay and holiday assumptions against the written offer, then note which figures still need verification. That is comparison modelling, not a fairness verdict.",
    },
    faqs: [
      { question: "Can this tool say whether my package is fair?", answer: "No. It can help you compare assumptions and identify figures to verify, but it cannot decide fairness or legal rights." },
      { question: "What can I compare instead?", answer: "Compare statutory baseline assumptions, enhanced terms, notice pay, holiday pay and total package figures against written employer information." },
      { question: "Should I get advice?", answer: "Yes where terms are complex, settlement-related or legally significant. This calculator is non-advisory." },
    ],
    variant: "rights",
  },
  {
    slug: "can-i-negotiate-redundancy-pay",
    metaTitle: "Can I Negotiate Redundancy Pay? UK Information",
    metaDescription: "General information on redundancy pay negotiation contexts. Not employment law advice or negotiation advice.",
    h1: "Can I negotiate redundancy pay?",
    primaryCta: "Model package assumptions",
    primaryHref: "/redundancy-package-calculator",
    secondaryCta: "Settlement agreement calculator",
    secondaryHref: "/redundancy-settlement-agreement-calculator",
    badge: "General information",
    intro: "General information only. This is not employment law advice or negotiation advice. Use it to organise package assumptions before wider decisions.",
    intent: "This page captures negotiation searches with tight boundaries and signposting to professional support where relevant.",
    helps: [
      "Understand why package assumptions should be modelled before any discussion.",
      "Identify figures to verify in writing: redundancy, notice, holiday and enhanced terms.",
      "Separate financial modelling from legal or negotiation strategy.",
      "Use calculator outputs as private preparation, not as advice to an employer.",
    ],
    assumptions: [
      "Negotiation context depends on employer policy, contract, role selection and individual circumstances.",
      "This page does not provide negotiation tactics, legal advice or representation.",
      "Professional employment or legal advice may be appropriate where terms are significant.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: prepare figures first",
      body: "Example only: before any negotiation conversation, it may help to model statutory redundancy, notice pay and holiday assumptions so you know which figures are confirmed and which still need verification.",
    },
    faqs: [
      { question: "Does this page tell me how to negotiate?", answer: "No. It is general information only and does not provide negotiation advice or employment law advice." },
      { question: "Can I model different package scenarios?", answer: "Yes. Use the package calculator to model statutory, enhanced, notice and holiday assumptions privately." },
      { question: "When should I seek professional advice?", answer: "Where terms are complex, settlement-related, discriminatory or legally significant, consider ACAS, Citizens Advice or qualified professional support." },
    ],
    variant: "consultation",
  },
  {
    slug: "redundancy-settlement-agreement-calculator",
    metaTitle: "Redundancy Settlement Agreement Calculator UK",
    metaDescription: "Model settlement agreement payment assumptions alongside redundancy, notice and holiday components. Not legal advice — signpost to professional review.",
    h1: "Redundancy settlement agreement calculator",
    primaryCta: "Model package assumptions",
    secondaryCta: "Package checklist",
    secondaryHref: "/redundancy-package-checklist",
    badge: "High-risk area",
    intro: "Settlement agreements can combine several payment types with legal conditions attached. Model package assumptions here only — this is not legal advice. Consider professional review before signing.",
    intent: "This page is tightly bounded for settlement-agreement searches: component modelling only, with explicit legal signposting.",
    helps: [
      "Separate redundancy, notice, holiday and ex-gratia-style assumptions in the model.",
      "Avoid treating a settlement total as if every pound is redundancy pay.",
      "Identify figures to verify before relying on calculator output.",
      "Use the model as private preparation before professional review.",
    ],
    assumptions: [
      "Settlement agreements are legally binding documents with conditions that this tool does not review.",
      "Tax treatment, references, warranties and legal wording require professional advice.",
      "This calculator models payment assumptions only and does not provide legal advice.",
      ...baseAssumptions,
    ],
    example: {
      title: "Example: settlement total vs components",
      body: "Example only: a settlement agreement figure might include redundancy pay, notice, holiday, unpaid wages and an ex-gratia payment. Modelling components separately helps avoid confusing the headline total with statutory redundancy alone.",
    },
    faqs: [
      { question: "Can this tool review my settlement agreement?", answer: "No. It does not provide legal advice, review wording or assess whether you should sign." },
      { question: "Should I get legal advice before signing?", answer: "Yes. Settlement agreements are legally significant. Independent legal advice is often appropriate." },
      { question: "What can the calculator do?", answer: "It can model payment assumptions you enter for redundancy, notice, holiday and manual package lines as a private financial preparation step." },
    ],
    variant: "package",
  },
  ...missingSeoPages,
];

export const seoCalculatorPages = pages;

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createFallbackPage(slug: string): SeoPageContent {
  const title = slugToTitle(slug);
  return {
    slug,
    metaTitle: `${title} | RedundancyCalculatorUK`,
    metaDescription: `UK redundancy preparation and private financial modelling for ${title.toLowerCase()}. Not legal or financial advice.`,
    h1: title,
    primaryCta: "Use the free redundancy calculator",
    primaryHref: "/wizard",
    secondaryCta: "View guides",
    secondaryHref: "/",
    badge: "UK redundancy guide",
    intro: "Use the free calculator to estimate redundancy pay and baseline runway from your figures, then unlock the full private report for deeper preparation tools.",
    intent: "General redundancy preparation information.",
    helps: [
      "Estimate UK statutory redundancy pay from your assumptions.",
      "Model baseline runway months on household costs.",
      "Prepare consultation questions alongside the numbers.",
      "Unlock maximiser checks and plain-English brief in the full report.",
    ],
    assumptions: baseAssumptions,
    example: {
      title: "Start with your figures",
      body: "Enter age, weekly pay and service years for a statutory estimate, then add notice, holiday and costs for a fuller picture.",
    },
    faqs: [
      { question: "Is this financial advice?", answer: "No. Private modelling from your assumptions only." },
      { question: "Can I start free?", answer: "Yes. The wizard free preview requires no payment." },
      { question: "What does the paid report include?", answer: "Package maximiser, consultation prep, runway dashboards and exportable brief." },
    ],
    variant: "consultation",
  };
}

function getPage(slug: string): SeoPageContent {
  return pages.find((item) => item.slug === slug) ?? createFallbackPage(slug);
}

function NumberField({ id, label, value, min, max, step = 1, onChange }: {
  id: string;
  label: string;
  value: number;
  min: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="h-11"
      />
    </div>
  );
}

function getCalculatorCopy(page: SeoPageContent) {
  if (page.slug === "redundancy-package-calculator") {
    return {
      heading: "Package component estimate",
      deck: "Estimate statutory or enhanced redundancy, notice pay and holiday pay in one package view.",
      packageLabel: "Enhanced or manual package",
      packageHelp: "Use this when your employer has given a total redundancy element above the statutory baseline.",
    };
  }

  if (page.slug === "redundancy-pay-after-tax-calculator") {
    return {
      heading: "After-tax component check",
      deck: "Separate redundancy, notice and holiday assumptions before thinking about tax treatment.",
      packageLabel: "Enhanced redundancy element",
      packageHelp: "Use this for the redundancy element only, before notice, holiday or unpaid wages.",
    };
  }

  if (page.slug === "redundancy-final-pay-calculator") {
    return {
      heading: "Final pay component estimate",
      deck: "Model redundancy, notice and holiday assumptions before checking final payroll details.",
      packageLabel: "Redundancy element",
      packageHelp: "Enter an employer-provided redundancy element if you have one.",
    };
  }

  if (page.slug === "redundancy-payout-calculator") {
    return {
      heading: "Redundancy payout estimate",
      deck: "Estimate a gross payout and then test what it may mean for household runway.",
      packageLabel: "Expected payout element",
      packageHelp: "Use this for the redundancy element before adding notice and holiday pay.",
    };
  }

  if (page.slug === "enhanced-redundancy-calculator") {
    return {
      heading: "Enhanced package estimate",
      deck: "Compare the statutory baseline with an enhanced package amount, plus notice and holiday assumptions.",
      packageLabel: "Enhanced amount",
      packageHelp: "Use the total enhanced redundancy element offered, before adding notice or holiday pay.",
    };
  }

  if (page.slug === "voluntary-redundancy-calculator") {
    return {
      heading: "Voluntary offer estimate",
      deck: "Compare the statutory baseline with a voluntary redundancy offer, plus notice and holiday assumptions.",
      packageLabel: "Voluntary offer",
      packageHelp: "Use the voluntary redundancy offer amount before adding notice or holiday pay.",
    };
  }

  if (page.variant === "tax") {
    return {
      heading: "Gross package component estimate",
      deck: "Separate statutory redundancy, notice pay and holiday pay before thinking about tax treatment.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.variant === "notice") {
    return {
      heading: page.slug === "pilon-calculator-redundancy" ? "PILON estimate" : "Notice pay estimate",
      deck: "Estimate notice paid as cash alongside the statutory redundancy baseline.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.variant === "holiday") {
    return {
      heading: "Holiday pay estimate",
      deck: "Estimate accrued holiday pay alongside the statutory redundancy baseline.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.variant === "age") {
    return {
      heading: page.slug === "redundancy-pay-over-60"
        ? "Over-60 redundancy estimate"
        : page.slug === "redundancy-pay-over-50"
        ? "Over-50 redundancy estimate"
        : "Over-40 redundancy estimate",
      deck: "Estimate statutory redundancy pay using age-band rules, weekly pay and complete years of service.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.slug === "redundancy-pay-after-5-years" || page.slug === "redundancy-pay-after-10-years" || page.slug === "redundancy-pay-after-20-years") {
    return {
      heading: "Service-year redundancy estimate",
      deck: "Start with the service length for this page, then adjust age, pay and package assumptions.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.slug === "part-time-redundancy-pay-calculator") {
    return {
      heading: "Part-time redundancy estimate",
      deck: "Use the gross weekly pay assumption for your part-time role, then add package components if relevant.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.slug === "zero-hours-redundancy-pay-calculator") {
    return {
      heading: "Variable-hours redundancy estimate",
      deck: "Model a cautious gross weekly pay assumption and update it when your employer confirms the calculation.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  if (page.variant === "eligibility") {
    return {
      heading: "Short-service package check",
      deck: "Check why statutory redundancy pay may be zero while notice and holiday pay may still matter.",
      packageLabel: "Enhanced amount",
      packageHelp: "",
    };
  }

  return {
    heading: "Free statutory estimate",
    deck: "Age, weekly gross pay and years of service drive the statutory estimate.",
    packageLabel: "Enhanced amount",
    packageHelp: "",
  };
}

function EmbeddedRedundancyCalculator({ page }: { page: SeoPageContent }) {
  const copy = getCalculatorCopy(page);
  const packageOfferSlugs = [
    "enhanced-redundancy-calculator",
    "voluntary-redundancy-calculator",
    "redundancy-package-calculator",
    "redundancy-pay-after-tax-calculator",
    "redundancy-final-pay-calculator",
    "redundancy-payout-calculator",
  ];
  const isPackageOfferPage = packageOfferSlugs.includes(page.slug);
  const [pkg, setPkg] = useState<RedundancyPackageInputs>({
    age: page.slug === "redundancy-pay-over-60" ? 62 : page.slug === "redundancy-pay-over-50" ? 54 : page.slug === "redundancy-pay-over-40" ? 44 : 39,
    yearsOfService: page.slug === "redundancy-pay-after-5-years"
      ? 5
      : page.slug === "redundancy-pay-after-10-years"
      ? 10
      : page.slug === "redundancy-pay-after-20-years"
      ? 20
      : page.variant === "eligibility"
      ? 1
      : page.variant === "age"
      ? 14
      : 8,
    weeklyGrossPay: page.slug === "part-time-redundancy-pay-calculator" ? 420 : page.slug === "zero-hours-redundancy-pay-calculator" ? 520 : 850,
    noticeWeeks: page.variant === "notice" || page.variant === "eligibility" || page.variant === "package" || page.variant === "tax" ? 8 : 0,
    holidayWeeks: page.variant === "holiday" || page.variant === "eligibility" || page.variant === "package" || page.variant === "tax" ? 2 : 0,
    enhancedPackage: isPackageOfferPage,
    enhancedAmount: page.slug === "voluntary-redundancy-calculator" ? 22000 : isPackageOfferPage ? 18000 : 0,
    useManualOverride: false,
    manualOverrideAmount: 0,
  });

  const estimate = useMemo(() => computeRedundancyEstimate(pkg), [pkg]);
  const cappedWeeklyPay = Math.min(pkg.weeklyGrossPay, UK_STATUTORY_REDUNDANCY.weeklyPayCap);
  const showNotice = page.variant === "notice" || page.variant === "tax" || page.variant === "package" || page.variant === "eligibility";
  const showHoliday = page.variant === "holiday" || page.variant === "tax" || page.variant === "package" || page.variant === "eligibility";
  const showEnhanced = isPackageOfferPage;
  const estimatedRunwayMonths = Math.max(1, Math.floor(estimate.totalEstimated / 2500));

  const update = (field: keyof RedundancyPackageInputs, value: number | boolean) => {
    setPkg((current) => ({ ...current, [field]: value }));
  };

  return (
    <Card className="border-primary/20 shadow-sm" data-testid="embedded-redundancy-calculator">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-foreground">{copy.heading}</p>
            <p className="text-xs text-muted-foreground">{copy.deck}</p>
          </div>
          <Badge variant="outline" className="w-fit">Last checked {UK_STATUTORY_REDUNDANCY.lastChecked}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NumberField id="seo-age" label="Age" value={pkg.age} min={16} max={100} onChange={(value) => update("age", value)} />
          <NumberField id="seo-weekly-pay" label="Weekly gross pay" value={pkg.weeklyGrossPay} min={0} step={25} onChange={(value) => update("weeklyGrossPay", value)} />
          <NumberField id="seo-service" label="Years of service" value={pkg.yearsOfService} min={0} max={20} onChange={(value) => update("yearsOfService", value)} />
        </div>

        {(showNotice || showHoliday || showEnhanced) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {showNotice && <NumberField id="seo-notice" label="Notice weeks" value={pkg.noticeWeeks} min={0} max={52} onChange={(value) => update("noticeWeeks", value)} />}
            {showHoliday && <NumberField id="seo-holiday" label="Holiday weeks" value={pkg.holidayWeeks} min={0} max={10} step={0.5} onChange={(value) => update("holidayWeeks", value)} />}
            {showEnhanced && (
              <div>
                <NumberField id="seo-enhanced" label={copy.packageLabel} value={pkg.enhancedAmount} min={0} step={500} onChange={(value) => update("enhancedAmount", value)} />
                {copy.packageHelp && <p className="text-xs text-muted-foreground mt-1.5">{copy.packageHelp}</p>}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-md bg-primary text-primary-foreground p-4 sm:col-span-2">
            <p className="text-xs opacity-75 mb-1">Statutory estimate</p>
            <p className="text-2xl font-bold tabular-nums">{formatGBP(estimate.statutoryRedundancy)}</p>
            <p className="text-xs opacity-75 mt-2">
              {estimate.qualifyingServiceMet ? `Uses capped weekly pay of ${formatGBP(cappedWeeklyPay)}.` : "The basic 2-year service rule is not met."}
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Notice pay</p>
            <p className="text-lg font-semibold tabular-nums">{formatGBP(estimate.noticePay)}</p>
          </div>
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Holiday pay</p>
            <p className="text-lg font-semibold tabular-nums">{formatGBP(estimate.holidayPay)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-md border bg-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Estimated gross package: {formatGBP(estimate.totalEstimated)}</p>
              <p className="text-xs text-muted-foreground">
                At a simple {formatGBP(2500)}/month burn rate, that is about {estimatedRunwayMonths} month{estimatedRunwayMonths === 1 ? "" : "s"} before savings and other income.
              </p>
            </div>
            <Link href="/wizard">
              <Button data-testid="button-embedded-calculator-cta">
                {page.primaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {page.variant === "tax" ? `${TAX_SENSITIVE_DISCLAIMER} ` : ""}
          This is an illustrative gross estimate only. It is not legal, tax, mortgage or financial advice. The full {RUNWAY_REPORT_FULL} is £{RUNWAY_REPORT_PRICE_GBP}, one-off.
        </p>
      </CardContent>
    </Card>
  );
}

function PrivateReportPreview({ isRunwayPage }: { isRunwayPage: boolean }) {
  return (
    <section className="px-6 py-12 bg-surface border-y" data-testid="section-private-report-preview">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-7 items-start">
          <div>
            <Badge variant="outline" className="mb-4">{RUNWAY_REPORT_FULL}</Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">See the dashboard before you unlock the full report</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              The free calculator gives the first estimate. The full {RUNWAY_REPORT_FULL} turns your figures into dashboard views, scenario comparisons and an exportable written report.
            </p>
          </div>
          <Card className="border-primary/20 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Full report access</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold">£{RUNWAY_REPORT_PRICE_GBP}</span>
                <span className="text-sm text-muted-foreground">one-off</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">No subscription. Includes the Redundancy Runway Brief and exportable report access.</p>
              <Link href="/wizard">
                <Button className="w-full">
                  {isRunwayPage ? "Build my private runway report" : "Start free, unlock if useful"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <LandingDashboardShowcase />

        <BriefExampleEmbed
          primaryLabel={isRunwayPage ? "Build my private runway report" : "Start free, unlock if useful"}
        />
      </div>
    </section>
  );
}

function buildDefaultRunwayInputs(page: SeoPageContent): RunwayInputs {
  const mortgageOrRent = page.variant === "mortgage" ? 1600 : page.variant === "household" ? 1250 : 1100;
  const partnerMonthlyNetIncome = page.variant === "household" ? 2400 : 0;
  const includePartnerIncome = page.variant === "household";
  const isSavingsPage = page.slug === "how-long-will-my-savings-last-after-redundancy" || page.slug === "emergency-fund-runway-calculator";
  const isIncomeLossPage = page.slug === "income-loss-calculator-uk" || page.slug === "job-loss-calculator-uk";
  const isBudgetPage = page.slug === "redundancy-budget-calculator";

  return {
    context: {
      employmentStatus: "redundant",
      housingType: page.variant === "mortgage" ? "mortgage" : "renting",
      householdStructure: page.variant === "household" ? "couple" : "single",
      hasDependents: page.variant === "household",
      confidenceLevel: "uncertain",
    },
    redundancyPackage: {
      age: 42,
      yearsOfService: 9,
      weeklyGrossPay: 850,
      noticeWeeks: 0,
      holidayWeeks: 0,
      enhancedPackage: false,
      enhancedAmount: 0,
      useManualOverride: true,
      manualOverrideAmount: page.slug === "emergency-fund-runway-calculator" ? 0 : isSavingsPage ? 12000 : 18000,
    },
    cashSavings: page.slug === "emergency-fund-runway-calculator" ? 10000 : isSavingsPage ? 16000 : 9000,
    liquidInvestments: 0,
    otherOneOffIncome: 0,
    unpaidWages: 0,
    voluntaryRedundancyAmount: 0,
    currentMonthlyNetIncome: isIncomeLossPage ? 2800 : 3200,
    replacementMonthlyIncome: isIncomeLossPage ? 900 : 0,
    monthsUntilNewJob: isIncomeLossPage ? 6 : 4,
    benefitSupportEstimate: 0,
    partnerMonthlyNetIncome,
    includePartnerIncome,
    mortgageOrRent,
    utilities: isBudgetPage ? 240 : 280,
    food: page.variant === "household" ? 650 : isBudgetPage ? 380 : 420,
    councilTax: 180,
    insurance: 90,
    transport: isBudgetPage ? 180 : 260,
    debtRepayments: isBudgetPage ? 120 : 180,
    childcare: page.variant === "household" ? 450 : 0,
    otherEssential: 150,
    subscriptions: isBudgetPage ? 50 : 80,
    leisure: isBudgetPage ? 90 : 180,
    travel: isBudgetPage ? 40 : 80,
    discretionaryOther: isBudgetPage ? 60 : 120,
    retrainingMonthlyCost: 0,
    includeNonEssential: true,
    emergencyBuffer: 5000,
    sector: "all",
    mortgageSensitivityPercent: page.variant === "mortgage" ? 10 : 0,
  };
}

function EmbeddedRunwayCalculator({ page }: { page: SeoPageContent }) {
  const [inputs, setInputs] = useState<RunwayInputs>(() => buildDefaultRunwayInputs(page));
  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const startingCapital = inputs.redundancyPackage.manualOverrideAmount + inputs.cashSavings + inputs.liquidInvestments + inputs.otherOneOffIncome;
  const totalGapIncome = inputs.replacementMonthlyIncome + (inputs.includePartnerIncome ? inputs.partnerMonthlyNetIncome : 0);

  const update = (field: keyof RunwayInputs, value: number | boolean) => {
    setInputs((current) => ({ ...current, [field]: value }));
  };

  const updatePackage = (value: number) => {
    setInputs((current) => ({
      ...current,
      redundancyPackage: {
        ...current.redundancyPackage,
        manualOverrideAmount: value,
        useManualOverride: true,
      },
    }));
  };

  return (
    <Card className="border-primary/20 shadow-sm" data-testid="embedded-runway-calculator">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {page.variant === "mortgage" ? "Housing pressure model" : page.variant === "household" ? "One-income household model" : "Runway estimate"}
            </p>
            <p className="text-xs text-muted-foreground">
              Adjust the core figures to see how capital, housing costs and income assumptions affect estimated runway.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">Illustrative scenario</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NumberField id="seo-package" label="Redundancy package" value={inputs.redundancyPackage.manualOverrideAmount} min={0} step={500} onChange={updatePackage} />
          <NumberField id="seo-savings" label="Cash savings" value={inputs.cashSavings} min={0} step={500} onChange={(value) => update("cashSavings", value)} />
          <NumberField id="seo-housing-cost" label={page.variant === "mortgage" ? "Mortgage payment" : "Mortgage or rent"} value={inputs.mortgageOrRent} min={0} step={50} onChange={(value) => update("mortgageOrRent", value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <NumberField id="seo-essential-other" label="Other essentials" value={inputs.utilities + inputs.food + inputs.councilTax + inputs.insurance + inputs.transport + inputs.debtRepayments + inputs.childcare + inputs.otherEssential} min={0} step={50} onChange={(value) => {
            setInputs((current) => ({ ...current, otherEssential: Math.max(0, value - current.utilities - current.food - current.councilTax - current.insurance - current.transport - current.debtRepayments - current.childcare) }));
          }} />
          <NumberField id="seo-gap-income" label={page.variant === "household" ? "Remaining income" : "Gap income"} value={totalGapIncome} min={0} step={100} onChange={(value) => {
            if (page.variant === "household") {
              setInputs((current) => ({ ...current, partnerMonthlyNetIncome: value, includePartnerIncome: value > 0 }));
            } else {
              update("replacementMonthlyIncome", value);
            }
          }} />
          <NumberField id="seo-new-job" label="Months to income recovery" value={inputs.monthsUntilNewJob} min={0} max={60} onChange={(value) => update("monthsUntilNewJob", value)} />
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-md bg-primary text-primary-foreground p-4 sm:col-span-2">
            <p className="text-xs opacity-75 mb-1">Estimated runway</p>
            <p className="text-2xl font-bold tabular-nums">{formatMonths(result.monthsUntilDepletion)}</p>
            <p className="text-xs opacity-75 mt-2">Based on the scenario assumptions entered here.</p>
          </div>
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Starting capital</p>
            <p className="text-lg font-semibold tabular-nums">{formatGBP(startingCapital)}</p>
          </div>
          <div className="rounded-md bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Monthly burn</p>
            <p className="text-lg font-semibold tabular-nums">{formatGBP(result.monthlyBurn)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-md border bg-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Build the full private report</p>
              <p className="text-xs text-muted-foreground">
                Add detailed expenses, income recovery paths, essential-only comparisons and pressure points.
              </p>
            </div>
            <Link href="/wizard">
              <Button data-testid="button-embedded-runway-cta">
                {page.primaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          This is scenario modelling only. It is not financial, mortgage, benefits, tax, employment or legal advice.
        </p>
      </CardContent>
    </Card>
  );
}

function EmbeddedGuideCta({ page }: { page: SeoPageContent }) {
  const isConsultation = page.variant === "consultation";

  return (
    <Card className="border-primary/20 shadow-sm" data-testid="embedded-guide-cta">
      <CardContent className="p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-5 items-start">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isConsultation ? "Prepare the meeting, then model the numbers" : "Get organised before the next decision"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {isConsultation
                ? "Use the checklist to clarify package, timing and consultation assumptions, then put the confirmed numbers into the private calculator."
                : "Start with the practical checklist, estimate the package for free, and use the 7-Day Reset if you want a written structure for the week ahead."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {[
                isConsultation ? "Clarify selection and timing" : "Gather documents and dates",
                "Estimate package assumptions",
                isConsultation ? "Plan follow-up questions" : "Model household runway",
              ].map((item) => (
                <div key={item} className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mb-2" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border bg-background p-4">
            <p className="text-sm font-semibold mb-3">Useful next step</p>
            <div className="space-y-2">
              <Link href={page.primaryHref ?? "/wizard"}>
                <Button className="w-full justify-center" data-testid="button-guide-primary">
                  {page.primaryCta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={page.secondaryHref ?? "/free-redundancy-calculator"}>
                <Button variant="outline" className="w-full justify-center" data-testid="button-guide-secondary">
                  {page.secondaryCta ?? "Use the free calculator"}
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              General information and organisation only. Not legal, tax, employment or financial advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RelatedLinks({ currentSlug, variant }: { currentSlug: string; variant: PageVariant }) {
  const standardLinks = [
    { href: "/free-redundancy-calculator", label: "Free redundancy calculator", body: "Start with the free statutory estimate." },
    { href: "/redundancy-pay-calculator-uk", label: "Redundancy pay calculator UK", body: "Generic UK redundancy pay estimate." },
    { href: "/redundancy-pay-calculator-2026", label: "Redundancy pay calculator 2026", body: "Current-year statutory cap and formula." },
    { href: "/statutory-redundancy-pay-calculator", label: "Statutory redundancy pay calculator", body: "Focus on the legal minimum." },
    { href: "/redundancy-calculator-uk", label: "Redundancy calculator UK", body: "Pay plus runway modelling." },
    { href: "/how-does-redundancy-pay-work", label: "How redundancy pay works", body: "Plain-English formula explanation." },
    { href: "/maximum-redundancy-pay-uk", label: "Maximum redundancy pay UK", body: "Understand statutory caps and limits." },
  ];
  const packageLinks = [
    { href: "/redundancy-package-calculator", label: "Redundancy package calculator", body: "Estimate statutory, enhanced, notice and holiday assumptions." },
    { href: "/enhanced-redundancy-calculator", label: "Enhanced redundancy calculator", body: "Compare above-statutory package assumptions." },
    { href: "/voluntary-redundancy-calculator", label: "Voluntary redundancy calculator", body: "Model a voluntary redundancy offer." },
    { href: "/redundancy-tax-calculator", label: "Redundancy tax calculator", body: "Separate redundancy, notice and holiday pay." },
    { href: "/redundancy-pay-after-tax-calculator", label: "Redundancy pay after tax", body: "Separate package components before tax assumptions." },
  ];
  const componentLinks = [
    { href: "/redundancy-notice-pay-calculator", label: "Redundancy notice pay calculator", body: "Estimate notice pay alongside redundancy pay." },
    { href: "/pilon-calculator-redundancy", label: "PILON calculator for redundancy", body: "Model payment in lieu of notice separately." },
    { href: "/holiday-pay-redundancy-calculator", label: "Holiday pay redundancy calculator", body: "Estimate accrued holiday pay in the package." },
    { href: "/redundancy-final-pay-calculator", label: "Redundancy final pay calculator", body: "Organise final payroll assumptions." },
    { href: "/redundancy-payout-calculator", label: "Redundancy payout calculator", body: "Estimate the total payout and runway context." },
  ];
  const runwayLinks = [
    { href: "/how-long-will-my-redundancy-pay-last", label: "How long will my redundancy pay last?", body: "Estimate runway from package, savings and spending." },
    { href: "/how-long-will-my-savings-last-after-redundancy", label: "How long savings may last", body: "Model savings after redundancy." },
    { href: "/redundancy-runway-calculator", label: "Redundancy runway calculator", body: "Model capital, costs and income recovery." },
    { href: "/income-loss-calculator-uk", label: "Income loss calculator UK", body: "Model reduced income and savings runway." },
    { href: "/emergency-fund-runway-calculator", label: "Emergency fund runway calculator", body: "Estimate emergency fund duration." },
    { href: "/mortgage-redundancy-calculator", label: "Mortgage redundancy calculator", body: "Model mortgage or rent pressure." },
    { href: "/redundancy-and-mortgage-payments", label: "Redundancy and mortgage payments", body: "Guide to payment pressure and runway." },
    { href: "/one-income-household-calculator", label: "One-income household calculator", body: "Model a household after one income stops." },
    { href: "/redundancy-budget-calculator", label: "Redundancy budget calculator", body: "Model essential and flexible costs." },
    { href: "/job-loss-calculator-uk", label: "Job loss calculator UK", body: "Model job loss or income disruption." },
  ];
  const resetLinks = [
    { href: "/at-risk-of-redundancy-what-to-do", label: "At risk of redundancy: what to do next", body: "Organise facts, questions and first money assumptions." },
    { href: "/made-redundant-what-next", label: "Made redundant: what next?", body: "First steps after redundancy has happened." },
    { href: "/first-week-after-redundancy", label: "First week after redundancy", body: "A calm seven-day practical sequence." },
    { href: "/redundancy-action-plan", label: "Redundancy action plan", body: "Turn money, documents and job search into a plan." },
    { href: "/redundancy-consultation-questions", label: "Redundancy consultation questions", body: "Prepare questions before consultation meetings." },
    { href: "/questions-to-ask-in-redundancy-consultation", label: "Consultation question checklist", body: "A deeper checklist organised by theme." },
    { href: "/what-to-do-before-redundancy-consultation", label: "Before redundancy consultation", body: "Prepare documents, questions and pay assumptions." },
    { href: "/worried-about-losing-your-job", label: "Worried about losing your job?", body: "Model uncertainty without predicting outcomes." },
    { href: "/my-job-is-at-risk-what-should-i-do", label: "My job is at risk", body: "Organise facts and next steps calmly." },
    { href: "/redundancy-next-steps", label: "Redundancy next steps", body: "Create a practical next-step sequence." },
    { href: "/redundancy-reset", label: "7-Day Redundancy Reset", body: "Structured support after redundancy." },
  ];
  const rightsLinks = [
    { href: "/redundancy-rights-uk", label: "Redundancy rights UK", body: "General rights context and calculator links." },
    { href: "/employer-insolvent-redundancy-pay", label: "Employer insolvent redundancy pay", body: "Official insolvency signposting and runway modelling." },
    { href: "/redundancy-payments-service-claim", label: "Redundancy Payments Service claim", body: "Separate official claims from private modelling." },
    { href: "/employer-has-not-paid-redundancy", label: "Employer has not paid redundancy", body: "Model delayed payment assumptions." },
    { href: "/claim-redundancy-pay-from-government", label: "Claim redundancy pay from government", body: "Official claim route signposting." },
    { href: "/unpaid-wages-redundancy", label: "Unpaid wages after redundancy", body: "Separate wages from redundancy pay." },
    { href: "/holiday-pay-owed-after-redundancy", label: "Holiday pay owed after redundancy", body: "Model holiday pay as final pay." },
    { href: "/benefits-after-redundancy", label: "Benefits after redundancy", body: "Benefit signposting and runway modelling." },
    { href: "/universal-credit-after-redundancy", label: "Universal Credit after redundancy", body: "Official UC signposting and runway modelling." },
    { href: "/claiming-universal-credit-after-redundancy", label: "Universal Credit after redundancy", body: "Official UC signposting and private runway modelling." },
    { href: "/does-redundancy-pay-affect-universal-credit", label: "Redundancy pay and Universal Credit", body: "Understand why package and savings assumptions matter." },
    { href: "/redundancy-pay-and-benefits", label: "Redundancy pay and benefits", body: "Separate package and entitlement questions." },
    { href: "/can-i-claim-jsa-after-redundancy", label: "JSA after redundancy", body: "New Style JSA signposting." },
    { href: "/redundancy-pay-and-savings-benefits", label: "Redundancy pay, savings and benefits", body: "Model runway while checking official support." },
    { href: "/redundancy-pay-over-40", label: "Redundancy pay over 40", body: "Age-band estimate and runway context." },
    { href: "/redundancy-pay-over-50", label: "Redundancy pay over 50", body: "Age-band estimate and runway context." },
    { href: "/redundancy-pay-over-60", label: "Redundancy pay over 60", body: "Age-band estimate without pension advice." },
    { href: "/redundancy-pay-after-5-years", label: "Redundancy pay after 5 years", body: "Service-year estimate and runway context." },
    { href: "/redundancy-pay-after-10-years", label: "Redundancy pay after 10 years", body: "Service-year estimate and runway context." },
    { href: "/redundancy-pay-after-20-years", label: "Redundancy pay after 20 years", body: "Service cap estimate and runway context." },
    { href: "/part-time-redundancy-pay-calculator", label: "Part-time redundancy pay calculator", body: "Weekly pay assumptions for part-time work." },
    { href: "/zero-hours-redundancy-pay-calculator", label: "Zero-hours redundancy pay calculator", body: "Variable-hours pay assumptions." },
    { href: "/fixed-term-contract-redundancy-pay", label: "Fixed-term redundancy pay", body: "Official signposting and income disruption modelling." },
    { href: "/redundancy-pay-less-than-2-years-service", label: "Less than 2 years' service", body: "Eligibility boundary and package checks." },
    { href: "/ai-job-uncertainty-financial-planning", label: "AI job uncertainty planning", body: "Scenario modelling without job-loss predictions." },
  ];
  const links = (variant === "rights" || variant === "benefits")
    ? [...rightsLinks, ...standardLinks, ...runwayLinks, ...resetLinks]
    : (variant === "reset" || variant === "consultation")
    ? [...resetLinks, ...standardLinks, ...runwayLinks]
    : (variant === "age" || variant === "eligibility")
    ? [...rightsLinks, ...standardLinks, ...runwayLinks, ...packageLinks]
    : (variant === "ai")
    ? [...runwayLinks, ...rightsLinks, ...standardLinks]
    : (variant === "runway" || variant === "mortgage" || variant === "household")
    ? [...runwayLinks, ...standardLinks, ...packageLinks, ...rightsLinks]
    : (variant === "package" || variant === "tax" || variant === "notice" || variant === "holiday")
    ? [...packageLinks, ...componentLinks, ...runwayLinks, ...resetLinks, ...standardLinks]
    : [...standardLinks, ...packageLinks, ...componentLinks];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {links
        .filter((link) => link.href !== `/${currentSlug}`)
        .slice(0, 10)
        .map((link) => (
          <Link key={link.href} href={link.href} data-testid={`related-${link.href.slice(1)}`}>
            <div className="rounded-md border p-4 hover:border-primary/40 hover:bg-muted/20 transition-colors h-full">
              <p className="text-sm font-medium mb-1">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.body}</p>
            </div>
          </Link>
        ))}
    </div>
  );
}

function getPriorityPathLinks(page: SeoPageContent): InternalLinkItem[] {
  const links: InternalLinkItem[] = [
    { href: "/free-redundancy-calculator", label: "Free redundancy calculator", body: "Start with the statutory estimate." },
    { href: "/redundancy-pay-calculator-uk", label: "Redundancy pay calculator UK", body: "Use the main UK pay estimate page." },
  ];

  if (page.variant === "package" || page.variant === "tax" || page.variant === "notice" || page.variant === "holiday") {
    links.push({ href: "/redundancy-package-calculator", label: "Package calculator", body: "Bring statutory, notice, holiday and enhanced assumptions together." });
  }

  if (page.variant === "tax") {
    links.push({ href: "/redundancy-tax-calculator", label: "Redundancy tax calculator", body: "Separate tax-sensitive package components." });
  }

  if (page.variant === "question" || page.variant === "eligibility" || page.variant === "rights") {
    links.push(
      { href: "/redundancy-package-calculator", label: "Package calculator", body: "Model statutory, notice, holiday and enhanced assumptions." },
      { href: "/how-long-will-my-redundancy-pay-last", label: "How long will it last?", body: "Turn package assumptions into runway." },
    );
  }

  if (page.variant === "consultation") {
    links.push({ href: "/redundancy-package-checklist", label: "Package checklist", body: "Verify components before modelling." });
  }

  if (page.variant === "runway" || page.variant === "mortgage" || page.variant === "household" || page.variant === "ai") {
    links.push({ href: "/how-long-will-my-redundancy-pay-last", label: "How long will it last?", body: "Turn package and savings assumptions into runway." });
  }

  if (page.variant === "mortgage" || page.variant === "household") {
    links.push(
      { href: "/mortgage-redundancy-calculator", label: "Mortgage redundancy calculator", body: "Model housing pressure in the runway." },
      { href: "/one-income-household-calculator", label: "One-income household calculator", body: "Model household income disruption." },
    );
  }

  if (page.variant === "reset" || page.variant === "consultation") {
    links.push({ href: "/redundancy-reset", label: "7-Day Redundancy Reset", body: "Get a structured written plan for the next steps." });
  }

  if (page.variant === "benefits") {
    links.push({ href: "/income-loss-calculator-uk", label: "Income loss calculator", body: "Model reduced income while checking official support." });
  }

  return Array.from(new Map(links.map((link) => [link.href, link])).values());
}

function PriorityPathLinks({ page }: { page: SeoPageContent }) {
  const links = getPriorityPathLinks(page);

  return (
    <Card data-testid="card-priority-internal-links">
      <CardContent className="p-5">
        <h2 className="font-serif text-lg font-bold mb-2">Key routes</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Move between the calculator, package and runway pages without losing the thread.
        </p>
        <div className="space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-testid={`priority-link-${link.href.slice(1)}`}>
              <div className="rounded-md border px-3 py-3 hover:border-primary/40 hover:bg-muted/20 transition-colors">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{link.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SeoJsonLd({ page }: { page: SeoPageContent }) {
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const isGuidePage = page.variant === "reset" || page.variant === "consultation" || page.variant === "rights" || page.variant === "benefits";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.h1, item: pageUrl },
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
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    dateModified: UK_STATUTORY_REDUNDANCY.lastCheckedIso,
    mainEntityOfPage: pageUrl,
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
      <script type="application/ld+json">{JSON.stringify(isGuidePage ? article : app)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </>
  );
}

export function SeoCalculatorPage({ slug }: { slug: string }) {
  const page = getPage(slug);
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const isRunwayPage = page.variant === "runway" || page.variant === "mortgage" || page.variant === "household" || page.variant === "ai";
  const isGuidePage = page.variant === "reset" || page.variant === "consultation" || page.variant === "rights" || page.variant === "benefits";
  const primaryHref = page.primaryHref ?? "/wizard";
  const secondaryHref = page.secondaryHref ?? "/wizard";

  return (
    <>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content={isGuidePage ? "article" : "website"} />
        <meta property="og:site_name" content="RedundancyCalculatorUK" />
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.metaTitle} />
        <meta name="twitter:description" content={page.metaDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <SeoJsonLd page={page} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <DisclaimerBanner />

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
            <Logo />
            <Link href={primaryHref}>
              <Button size="sm" className="h-auto min-h-9 max-w-[190px] whitespace-normal text-right sm:max-w-none sm:text-center" data-testid="button-header-cta">
                {page.primaryCta}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section className="bg-primary text-primary-foreground px-6 py-12" data-testid="section-seo-hero">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
              <div>
                <Badge className="mb-5 bg-white/15 text-primary-foreground border-white/20 text-xs">{page.badge}</Badge>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4">{page.h1}</h1>
                <p className="text-primary-foreground/78 text-base sm:text-lg leading-relaxed max-w-2xl">{page.intro}</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link href={primaryHref}>
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
                      {page.primaryCta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  {page.secondaryCta && (
                    <Link href={secondaryHref}>
                      <Button variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/15">
                        {page.secondaryCta}
                      </Button>
                    </Link>
                  )}
                </div>
                <p className="mt-4 text-xs text-primary-foreground/55">
                  Free calculator first. Full report: £{RUNWAY_REPORT_PRICE_GBP} one-off. Last checked: {UK_STATUTORY_REDUNDANCY.lastChecked}.
                </p>
              </div>

              <div className="rounded-md bg-white/10 border border-white/15 p-4">
                <p className="text-sm font-semibold mb-2">{isGuidePage ? "Practical boundary" : isRunwayPage ? "Current model assumptions" : "Current statutory assumptions"}</p>
                <div className="space-y-2 text-xs text-primary-foreground/75">
                  {isGuidePage ? (
                    <>
                      <p>{page.variant === "benefits" ? "Use official calculators for benefit entitlement." : page.variant === "rights" ? "Use official guidance for employment rights questions." : "Use this page to organise questions, documents and next steps."}</p>
                      <p>Use the free calculator for package and runway assumptions.</p>
                      <p>Use specialist sources for legal, benefits, tax, pension or mortgage advice.</p>
                    </>
                  ) : isRunwayPage ? (
                    <>
                      <p>Runway depends on package, savings, costs and income assumptions.</p>
                      <p>Housing and debt costs can materially change the monthly burn rate.</p>
                      <p>Income recovery timing is a scenario input, not a prediction.</p>
                    </>
                  ) : (
                    <>
                      <p>Weekly cap: {formatGBP(UK_STATUTORY_REDUNDANCY.weeklyPayCap)}</p>
                      <p>Service counted: {UK_STATUTORY_REDUNDANCY.minServiceYears}-{UK_STATUTORY_REDUNDANCY.maxServiceYears} years</p>
                      <p>Tax-free statutory threshold: {formatGBP(UK_STATUTORY_REDUNDANCY.taxFreeThreshold)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-8 bg-muted/25" data-testid="section-embedded-calculator">
            <div className="max-w-5xl mx-auto">
              {isGuidePage ? <EmbeddedGuideCta page={page} /> : isRunwayPage ? <EmbeddedRunwayCalculator page={page} /> : <EmbeddedRedundancyCalculator page={page} />}
            </div>
          </section>

          <section className="px-6 pb-8 bg-muted/25" data-testid="section-payout-cta-ladder">
            <div className="max-w-5xl mx-auto">
              <PayoutCtaLadder slug={page.slug} />
            </div>
          </section>

          {!isGuidePage && <PrivateReportPreview isRunwayPage={isRunwayPage} />}

          <section className="px-6 py-12" data-testid="section-seo-content">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
              <article className="space-y-10">
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-3">What this page is for</h2>
                  <p className="text-muted-foreground leading-relaxed">{page.intent}</p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">{isGuidePage ? "What this helps you organise" : "What this helps you estimate"}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {page.helps.map((item) => (
                      <div key={item} className="rounded-md border bg-background p-4 flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">{isGuidePage ? "Important boundaries" : "Current assumptions"}</h2>
                  <div className="rounded-md border bg-muted/25 p-5 space-y-3">
                    {page.assumptions.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p>{item}</p>
                      </div>
                    ))}
                    {isGuidePage ? (
                      <div className="flex flex-col gap-2">
                        <Link href="/free-redundancy-calculator" className="inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4">
                          Use the free redundancy calculator <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        {page.officialLinks?.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
                          >
                            {link.label} <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <a
                        href={UK_STATUTORY_REDUNDANCY.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
                      >
                        Check GOV.UK statutory redundancy rules <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold mb-3">{page.example.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{page.example.body}</p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">Related questions</h2>
                  <div className="space-y-3">
                    {page.faqs.map((item) => (
                      <div key={item.question} className="rounded-md border p-4">
                        <h3 className="font-medium mb-1">{item.question}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">{isGuidePage ? "Related next steps" : "Related calculators"}</h2>
                  <RelatedLinks currentSlug={page.slug} variant={page.variant} />
                </div>

                <Card className="bg-primary text-primary-foreground" data-testid="card-seo-final-cta">
                  <CardContent className="p-7 text-center">
                    <Calculator className="w-8 h-8 mx-auto mb-4 opacity-85" />
                    <h2 className="font-serif text-2xl font-bold mb-2">{isGuidePage ? "Choose the next practical step" : "Start with the free calculator"}</h2>
                    <p className="text-sm text-primary-foreground/75 max-w-xl mx-auto mb-5">
                      {isGuidePage
                        ? "Use the calculator to ground the money assumptions, or start the 7-Day Reset if you want a written structure for the next few days."
                        : "Get the statutory estimate first. Then decide whether to build a fuller private runway report with your savings, mortgage or rent, income and household cost assumptions."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href={isGuidePage ? "/free-redundancy-calculator" : "/wizard"}>
                        <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
                          Start free redundancy calculator
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      {isGuidePage && (
                        <Link href="/redundancy-reset">
                          <Button variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/15">
                            Start a 7-Day Redundancy Reset
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </article>

              <aside className="space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <ShieldCheck className="w-5 h-5 text-primary mb-3" />
                    <h2 className="font-serif text-lg font-bold mb-2">Non-advisory boundary</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      RedundancyCalculatorUK provides illustrative modelling only. It does not provide legal, tax, mortgage, employment or financial advice, and it does not determine entitlement.
                    </p>
                  </CardContent>
                </Card>
                <PriorityPathLinks page={page} />
                <Card>
                  <CardContent className="p-5">
                    <h2 className="font-serif text-lg font-bold mb-2">Private runway report</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      After the free estimate, model how redundancy pay, savings, income assumptions and household costs may interact over time.
                    </p>
                    <Link href="/wizard">
                      <Button variant="outline" className="w-full">
                        Build my private report
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export function createSeoCalculatorPage(slug: string) {
  return function GeneratedSeoCalculatorPage() {
    return <SeoCalculatorPage slug={slug} />;
  };
}
