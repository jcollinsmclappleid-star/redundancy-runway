import type { AiRedundancySeoPage } from "./ai-redundancy-page-types";
import { RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { AI_RESEARCH_SOURCES } from "@shared/aiRedundancyResearch";

export const aiRedundancyPagesPart1: AiRedundancySeoPage[] = [
  {
    slug: "ai-redundancy-calculator",
    metaTitle: "AI Redundancy Calculator UK | Model Readiness From Your Figures",
    metaDescription:
      "26% of UK businesses now use AI (ONS). Model your redundancy package, runway months and preparation gaps — without predicting job loss.",
    h1: "AI redundancy calculator",
    badge: "UK data · readiness modelling",
    intro:
      "AI adoption in UK workplaces has moved from experiment to operational reality. If that shift is affecting how secure your role feels, the practical question is not a yes-or-no prediction — it is whether your package assumptions, savings and household costs give you enough runway to prepare calmly.",
    anxietyNote:
      "Feeling unsettled when employers discuss automation is common. This calculator turns abstract worry into numbers you control — not forecasts of what your employer will do.",
    positioning:
      "This tool models readiness from your assumptions. It does not score your probability of redundancy or assess whether an employer's AI plans are lawful.",
    ctaPreset: "readiness",
    showRunwayEmbed: true,
    midCta: "readiness",
    heroStats: [
      { value: "26%", label: "UK businesses using AI (ONS, Mar 2026)" },
      { value: "18%", label: "Planning AI adoption in next 3 months" },
      { value: "5%", label: "AI-using firms reporting headcount fall" },
    ],
    sections: [
      {
        title: "What UK data says about AI in workplaces right now",
        paragraphs: [
          "The Office for National Statistics (ONS) Business Insights and Conditions Survey (BICS) tracks AI adoption fortnightly. In late March 2026, 26% of UK businesses reported using at least one form of AI technology — up from 9% when the question was first asked in September 2023.",
          "Adoption is heavily skewed by firm size: 45% of businesses with 250 or more employees reported using AI, compared with a much lower share among micro-businesses. That matters if you work in a large organisation where efficiency programmes and technology rollouts tend to arrive first.",
        ],
        stats: [
          { value: "45%", label: "Large employers (250+) using AI" },
          { value: "4%→26%", label: "AI adoption rise since Sep 2023" },
        ],
      },
      {
        title: "Headcount impact: smaller than headlines suggest, but not zero",
        paragraphs: [
          "Among businesses already using AI, 5% told the ONS their overall workforce headcount had decreased as a result — broadly stable since late 2025. For firms with 10 or more employees, that figure was 7%.",
          "Crucially, this is a survey of employers who adopted AI — not proof that one in twenty UK workers will lose their job. It does, however, explain why employees in AI-piloting teams may feel pressure even when no formal redundancy process has started.",
        ],
      },
      {
        title: "What this calculator actually models",
        paragraphs: [
          "RedundancyCalculatorUK builds a private snapshot from figures you enter: statutory redundancy (using current UK rules including the £751 weekly pay cap and two-year qualifying service), notice and holiday assumptions, savings, housing costs and income recovery timing.",
          "The output is runway months — how long starting capital may last on your household costs under each scenario. That is financial modelling, not employment forecasting.",
        ],
        bullets: [
          "Statutory redundancy estimate with current age-band multipliers.",
          "Package total from your assumptions (enhanced terms replace statutory in the model).",
          "Baseline runway months and stability classification.",
          "Stress scenarios in the paid report: slow income recovery, essential-only spending, housing pressure.",
        ],
      },
      {
        title: "Why runway matters more than a headline redundancy figure",
        paragraphs: [
          "A £15,000 package sounds reassuring until you model six months of mortgage, council tax and childcare on a single income. The ONS data shows AI adoption accelerating — but individual financial pressure depends on your costs, partner income and how quickly replacement work arrives.",
          "The paid report's month-by-month capital path shows where pressure points fall, not just a single months-left number.",
        ],
      },
      {
        title: `Preparation modules in the £${RUNWAY_REPORT_PRICE_GBP} report`,
        paragraphs: [
          `The full ${RUNWAY_REPORT_FULL} adds tools designed for uncertainty — not for predicting selection outcomes.`,
        ],
        bullets: [
          "Protection measures playbook — eight preparation pillars filtered to your situation.",
          "Role Protection Planner — document judgement-led work and task exposure.",
          "Consultation Defence Pack — business-reason and selection questions if a process begins.",
          "Package Maximiser — verify components before relying on a headline settlement figure.",
        ],
      },
      {
        title: "When to use this vs waiting for certainty",
        paragraphs: [
          "You do not need a redundancy letter to model cautious assumptions. Many people use the calculator when AI pilots start, when restructuring is rumoured, or when they simply want a private baseline before HR confirms anything.",
          "Updating figures when written confirmation arrives is faster than starting from scratch under time pressure.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this calculator predict whether AI will make me redundant?",
        answer:
          "No. It models package assumptions and runway months from your figures. ONS data shows 5% of AI-using businesses reported headcount falls — that is an employer survey statistic, not a personal forecast.",
      },
      {
        question: "What UK statutory rules are built in?",
        answer:
          "Current statutory redundancy rules: £751 weekly pay cap, two-year minimum qualifying service, 20-year service cap, and £30,000 tax-free threshold for qualifying redundancy payments (verify with payroll or GOV.UK).",
      },
      {
        question: "How is this different from a generic redundancy calculator?",
        answer:
          "It is built for people whose uncertainty is tied to AI, automation or restructuring — with protection measures, role exposure preparation and consultation tools in the paid report.",
      },
      {
        question: `What does the £${RUNWAY_REPORT_PRICE_GBP} report add?`,
        answer: `The ${RUNWAY_REPORT_FULL} adds protection playbooks, Role Protection Planner, Consultation Defence Pack, scenario dashboards and a plain-English Redundancy Runway Brief.`,
      },
      {
        question: "Is my data stored on your servers?",
        answer:
          "Financial calculations run in your browser. Sensitive figures are not transmitted for the core modelling.",
      },
    ],
    researchSources: [AI_RESEARCH_SOURCES.onsBicsApr2026, AI_RESEARCH_SOURCES.govUkRedundancy],
  },
  {
    slug: "will-ai-replace-my-job",
    metaTitle: "Will AI Replace My Job? | What UK & Global Data Actually Shows",
    metaDescription:
      "86% of employers expect AI to transform their business by 2030 (WEF). Understand task change vs role loss — and model your readiness without panic.",
    h1: "Will AI replace my job?",
    badge: "Evidence · not predictions",
    intro:
      "If you have typed this question into a search bar at 11pm, you are not alone. Generative AI moved from conference slides into everyday work tools in under three years — and the gap between media alarm and your lived experience can feel impossible to bridge.",
    anxietyNote:
      "Anxiety is a rational response to uncertainty. The research below is here to give you context — not to tell you whether your job is safe or doomed.",
    positioning:
      "No page can answer yes or no for your role. What research can do is show how employers describe change — and help you separate task disruption from whole-role redundancy.",
    ctaPreset: "readiness",
    primaryCta: { label: "Model my readiness from my figures", href: "/wizard" },
    secondaryCta: { label: "Unlock Role Protection Planner", href: "/unlock" },
    midCta: "protection",
    heroStats: [
      { value: "86%", label: "Employers expect AI to transform business by 2030 (WEF)" },
      { value: "41%", label: "Employers planning workforce reduction for AI tasks" },
      { value: "48%", label: "Employers planning to move staff to other roles" },
    ],
    sections: [
      {
        title: "The question behind the question",
        paragraphs: [
          "Most people asking 'will AI replace my job?' are really asking two things: how exposed is my day-to-day work, and what happens to my income if my employer redesigns roles or reduces headcount.",
          "Those are preparation questions — not prophecy. The World Economic Forum's Future of Jobs Report 2025 surveyed more than 1,000 employers globally. 86% expected AI and information processing technologies to transform their business by 2030. That is transformation language, not a redundancy notice.",
        ],
      },
      {
        title: "What employers say they will do — reduction and redeployment",
        paragraphs: [
          "The same WEF survey found 41% of employers globally plan to reduce their workforce as AI automates certain tasks. That figure is real, and it explains workplace anxiety.",
          "But the survey also found 48% of employers expect to transition staff from roles exposed to AI disruption into other parts of the business — and 77% plan to upskill workers in the next five years. Employer intentions are mixed, not uniformly towards exit.",
        ],
        stats: [
          { value: "77%", label: "Employers planning worker upskilling" },
          { value: "11M / 9M", label: "Global AI-related jobs created vs displaced by 2030 (WEF)" },
        ],
      },
      {
        title: "Tasks change before job titles disappear",
        paragraphs: [
          "Labour economists consistently frame automation as task-level change. A marketing manager may spend less time drafting and more time reviewing AI output. A paralegal may spend less time document summarisation and more time client liaison.",
          "The WEF report estimates AI and information processing trends will create 11 million jobs globally by 2030 while displacing 9 million — a net positive at macro level, but with sharp disruption for specific occupations and individuals.",
        ],
      },
      {
        title: "UK-specific context: adoption is rising, exits are a minority report",
        paragraphs: [
          "ONS BICS data (late March 2026) shows 26% of UK businesses using AI. Among those already using it, only 5% reported an overall workforce headcount decrease attributable to AI technologies.",
          "ONS research also notes that among firms planning AI adoption, the most common workforce approach reported is training or retraining existing staff — not wholesale replacement. Your employer's stated approach may differ; the national picture is more nuanced than 'robots are coming for everyone'.",
        ],
      },
      {
        title: "Signs your role may see faster task change",
        paragraphs: [
          "Exposure is about how you spend your week — not your LinkedIn title.",
        ],
        bullets: [
          "Most of your output is rules-based, template-driven or document-heavy.",
          "Your team is piloting tools that already produce work you used to own.",
          "Leadership messaging pairs AI investment with efficiency or headcount targets.",
          "Internal vacancies are shrinking while automation budgets grow.",
        ],
      },
      {
        title: "Signs your role may change more slowly",
        paragraphs: [
          "These patterns are associated with slower displacement in research — not immunity from restructuring.",
        ],
        bullets: [
          "You hold regulated accountability or professional sign-off.",
          "Work depends on trust built over years with specific clients or stakeholders.",
          "Errors carry severe financial, safety or reputational consequences.",
          "Physical presence or spatial judgement is central to the role.",
        ],
      },
      {
        title: "What to do with this information",
        paragraphs: [
          "Research context reduces panic; it does not remove risk. The practical next step is a private readiness snapshot: package assumptions, runway months and a list of consultation questions if your employer's AI programme becomes a formal restructuring proposal.",
          "The Role Protection Planner in the paid report helps you document judgement-led work and task exposure — preparation themes, not a score of whether you will keep your job.",
        ],
      },
    ],
    faqs: [
      {
        question: "Will AI replace my job?",
        answer:
          "No reliable source can answer that for your individual role. WEF data shows employers expect widespread transformation; ONS UK data shows headcount decreases reported by a minority of AI-using firms. Outcomes depend on your employer's decisions.",
      },
      {
        question: "Why do headlines feel worse than the statistics?",
        answer:
          "Media coverage emphasises displacement stories. Survey data includes redeployment, upskilling and task redesign — less dramatic, but more common in employer responses.",
      },
      {
        question: "Should I panic if my company is rolling out Copilot or similar tools?",
        answer:
          "Tool rollout alone is not redundancy. It may signal task change. Use the moment to map which work you still own, verify your financial runway, and note what leadership says about headcount.",
      },
      {
        question: "How do I prepare without predicting the outcome?",
        answer:
          "Model cautious package and cost assumptions, document judgement-led contributions, and prepare consultation questions. The calculator and paid report support that — they do not forecast your employment outcome.",
      },
      {
        question: "Where does the 41% workforce reduction figure come from?",
        answer:
          "The WEF Future of Jobs Report 2025 employer survey. It describes global employer intentions, not UK law or your employer's specific plan.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.wefFutureJobs2025,
      AI_RESEARCH_SOURCES.wefPressJan2025,
      AI_RESEARCH_SOURCES.onsBicsApr2026,
      AI_RESEARCH_SOURCES.onsAiEmploymentFoi,
    ],
  },
  {
    slug: "can-my-employer-replace-me-with-ai",
    metaTitle: "Can My Employer Replace Me With AI? | UK Consultation Prep",
    metaDescription:
      "UK redundancy law is not AI-specific — but process matters. Prepare consultation questions, selection criteria queries and package checks.",
    h1: "Can my employer replace me with AI?",
    badge: "UK process · preparation only",
    intro:
      "If your manager has mentioned automation, efficiency or 'doing more with less', you may wonder whether AI can legally — or practically — end your role. This page does not answer that for your case. It explains how UK redundancy process works when technology is part of the story, and what to clarify before decisions are final.",
    anxietyNote:
      "Being told your role is 'under review' is stressful. Written notes, neutral questions and verified package figures give you something concrete to hold onto — even when answers are slow.",
    positioning:
      "This is preparation support only — not legal or employment advice. For rights specific to your situation, contact ACAS, a trade union or a qualified employment adviser.",
    ctaPreset: "consultation",
    midCta: "consultation",
    heroStats: [
      { value: "20+", label: "Redundancies triggering collective consultation (at one establishment)" },
      { value: "2 yrs", label: "Minimum qualifying service for statutory redundancy pay" },
      { value: "£751", label: "Current weekly pay cap for statutory calculation" },
    ],
    sections: [
      {
        title: "UK redundancy is about the role — not the technology label",
        paragraphs: [
          "UK redundancy law centres on whether an employer needs fewer people to do work of a particular kind, or whether a workplace is closing. AI may appear in the business rationale employers give — efficiency, digitisation, service redesign — but there is no separate 'AI redundancy' statute.",
          "GOV.UK and ACAS describe general principles: fair process, meaningful consultation, objective selection where pools are used, and consideration of suitable alternative employment. Whether a specific proposal meets those standards is a question for professional advice, not this tool.",
        ],
      },
      {
        title: "Collective consultation thresholds employers must consider",
        paragraphs: [
          "When an employer proposes 20 or more redundancies at one establishment within a 90-day period, collective consultation obligations apply — including consulting trade union or employee representatives. Smaller proposals may still require individual consultation.",
          "If you are in a large restructuring where AI is cited alongside headcount reduction, ask whether collective consultation has been triggered and who employee representatives are.",
        ],
      },
      {
        title: "What to clarify when AI is named in restructuring papers",
        paragraphs: [
          "Employers sometimes describe technology change vaguely. Specific questions help you understand scope without escalating conflict.",
        ],
        bullets: [
          "Which tasks are moving to AI tools — and which remain human-led?",
          "Is this a pilot, a permanent redesign, or a headcount reduction programme?",
          "How many roles are in scope, and how were they identified?",
          "What internal alternatives or retraining are being considered?",
          "What is the timeline from consultation end to decision?",
        ],
      },
      {
        title: "Selection criteria: what employers should explain",
        paragraphs: [
          "If selection pools are proposed, employers typically use criteria such as skills, performance, attendance or future business need. You can prepare questions about weighting, scoring evidence and appeal routes — as your employer describes them.",
          "The Selection Criteria Prep module in the paid report helps you build a criteria-to-evidence table. It does not assess fairness or tell you how to challenge an outcome.",
        ],
      },
      {
        title: "Suitable alternative employment — questions worth asking",
        paragraphs: [
          "Employers may discuss redeployment before confirming redundancy. ACAS guidance notes that employees may be entitled to a trial period in an alternative role (often four weeks, extendable by agreement).",
          "Prepare factual questions: job content, location, pay, benefits, trial period length and how suitability will be assessed. The Alternative Role Finder in the paid report organises comparisons — it does not decide legal suitability.",
        ],
      },
      {
        title: "Package verification before you model runway",
        paragraphs: [
          "Separate process questions from money assumptions. Statutory redundancy uses the lower of your actual weekly gross pay or the £751 cap (from 6 April 2026), with age-band multipliers and a two-year qualifying service minimum.",
          "Verify notice pay, holiday accrual, bonus treatment and payment dates in writing before entering figures in a runway model.",
        ],
      },
      {
        title: "Documents to start gathering now",
        paragraphs: [
          "If consultation is live or likely, a simple folder saves time later.",
        ],
        bullets: [
          "Contract, variation letters and recent payslips.",
          "Consultation invitation, business case documents and FAQ packs.",
          "Selection matrix or criteria documents if shared.",
          "Internal vacancy lists and role descriptions.",
          "Your own meeting notes with dates and attendees.",
        ],
      },
      {
        title: "Build a readiness snapshot alongside process prep",
        paragraphs: [
          "Financial pressure can force fast decisions. Once you have cautious package assumptions, model runway months so you know how long you may have under different income-recovery paths — stress tests only, not predictions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is it legal for an employer to make someone redundant because of AI?",
        answer:
          "Employers may propose organisational change for various reasons, which can include technology. Whether a specific proposal is lawful and fair depends on individual circumstances — seek professional employment advice.",
      },
      {
        question: "Do I have special rights because AI was the reason given?",
        answer:
          "UK redundancy rights are not AI-specific in the way summarised here. Process, consultation and selection rules apply regardless of the business rationale described.",
      },
      {
        question: "When does collective consultation apply?",
        answer:
          "Broadly when 20 or more redundancies are proposed at one establishment within 90 days. Confirm details with ACAS or an adviser for your situation.",
      },
      {
        question: "What statutory redundancy pay might apply?",
        answer:
          "If you have at least two years' qualifying service, statutory redundancy is calculated from age-band weeks per year of service, capped at 20 years and the £751 weekly pay limit. Use the calculator for an illustrative estimate from your assumptions.",
      },
      {
        question: "Does this page provide legal advice?",
        answer: "No. It helps you prepare questions and model finances — not interpret the law for your case.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.govUkRedundancy,
      AI_RESEARCH_SOURCES.acasRedundancy,
      AI_RESEARCH_SOURCES.onsBicsApr2026,
    ],
  },
  {
    slug: "what-jobs-will-ai-replace",
    metaTitle: "What Jobs Will AI Replace? | WEF Data on Growing & Declining Roles",
    metaDescription:
      "WEF: cashiers, admin assistants and printing workers among fastest-declining roles. Big data and AI specialists among fastest-growing. Task-level analysis.",
    h1: "What jobs will AI replace?",
    badge: "Labour-market research",
    intro:
      "Listicles naming 'jobs AI will kill' get clicks — and fuel anxiety. Labour-market research is more precise: it talks about tasks within occupations, employer survey expectations, and net job creation alongside displacement. This page unpacks what major studies actually say.",
    anxietyNote:
      "A job title on a 'declining' list does not mean everyone in that role will be made redundant. It means employers in global surveys expect demand for that occupation to fall relative to others.",
    positioning:
      "These are macro trends from employer surveys — not a forecast for your career. Your sector, employer and specific responsibilities matter more than a headline list.",
    ctaPreset: "exposure",
    primaryCta: { label: "Check readiness for my role", href: "/wizard" },
    midCta: "protection",
    heroStats: [
      { value: "170M", label: "Jobs created globally by 2030 (WEF macrotrends)" },
      { value: "92M", label: "Jobs displaced globally by 2030" },
      { value: "22%", label: "Of formal jobs disrupted by labour-market change" },
    ],
    sections: [
      {
        title: "Whole-job predictions are weaker than task analysis",
        paragraphs: [
          "The OECD, WEF and academic researchers model automation at task level: which activities within a job can be assisted or substituted by technology. A financial analyst who spends 40% of their week on report assembly faces different exposure than one who spends 40% on client advisory work — same job title.",
          "When you read 'AI will replace X job', ask which tasks within X are meant — and whether employers plan to redeploy people rather than exit them.",
        ],
      },
      {
        title: "Fastest-declining occupations in the WEF 2025 survey",
        paragraphs: [
          "The Future of Jobs Report 2025 asked employers which roles they expect to decline fastest in percentage terms through 2030. Frequently cited examples include:",
        ],
        bullets: [
          "Cashiers and ticket clerks.",
          "Administrative assistants and executive secretaries.",
          "Printing and related trades workers.",
          "Accountants and auditors (in the sense of routine compliance and reporting tasks).",
          "Postal service clerks and data entry roles.",
        ],
      },
      {
        title: "Fastest-growing occupations in the same survey",
        paragraphs: [
          "The same employer survey highlights roles expected to grow fastest — many directly tied to building, deploying or governing AI systems:",
        ],
        bullets: [
          "Big data specialists.",
          "Fintech engineers.",
          "AI and machine learning specialists.",
          "Software and application developers.",
          "Security management specialists.",
        ],
        stats: [
          { value: "11M", label: "AI-related jobs created globally by 2030" },
          { value: "9M", label: "AI-related jobs displaced globally by 2030" },
        ],
      },
      {
        title: "Where task exposure concentrates",
        paragraphs: [
          "Higher exposure tends to cluster in predictable, digital, language-based work: first-line customer queries with scripted answers, standard report packs, template content, invoice matching and calendar coordination.",
          "Lower exposure tends to cluster where accountability, physical skill, or relationship trust is central — though AI may still assist preparation work in those roles.",
        ],
      },
      {
        title: "UK employers are adopting AI faster than they report cutting jobs",
        paragraphs: [
          "ONS BICS (March 2026): 26% of UK businesses use AI; 18% plan to adopt within three months. Reported headcount decreases among AI users remain at 5%.",
          "The gap between adoption and reported exits suggests many UK employers are still in experimentation and task-redesign phases — which can still feel threatening at team level even when national redundancy statistics have not moved sharply.",
        ],
      },
      {
        title: "Why macro net job growth does not comfort an individual",
        paragraphs: [
          "WEF projects net global job growth of 78 million by 2030 from macrotrends. That is cold comfort if your occupation is on the declining list and your employer is not hiring into growing ones.",
          "Preparation means mapping your tasks, internal mobility options and financial runway — not assuming macro statistics protect your specific role.",
        ],
      },
      {
        title: "Apply this to your situation",
        paragraphs: [
          "List your top ten weekly tasks. Mark which are rules-based, document-heavy or already AI-assisted. The remainder is where your preparation narrative lives — for manager conversations, consultation evidence or redeployment profiles.",
          "The AI job risk calculator and Role Protection Planner help organise that mapping without assigning a probability score.",
        ],
      },
    ],
    faqs: [
      {
        question: "What jobs will AI replace first?",
        answer:
          "WEF employer surveys point to clerical, administrative and routine customer-service roles declining fastest in percentage terms. Task-level exposure within your role matters more than the title alone.",
      },
      {
        question: "Are office jobs most at risk?",
        answer:
          "Digital, language-based office tasks show higher automation potential in research models. Physical trades, regulated accountability and relationship-heavy roles show different patterns — not zero change, but different pace.",
      },
      {
        question: "Does being on a declining list mean redundancy?",
        answer: "No. It means surveyed employers expect lower demand for that occupation. Individual employers may redeploy, redesign or retain roles.",
      },
      {
        question: "Which jobs are growing because of AI?",
        answer:
          "WEF data highlights AI/ML specialists, big data roles, fintech engineers and cybersecurity — alongside care, education and delivery roles growing for demographic reasons.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.wefFutureJobs2025,
      AI_RESEARCH_SOURCES.wefPressJan2025,
      AI_RESEARCH_SOURCES.onsBicsApr2026,
    ],
  },
  {
    slug: "how-to-protect-your-job-from-ai",
    metaTitle: "How to Protect Your Job From AI | Evidence, Visibility & Runway",
    metaDescription:
      "36% of UK firms approach AI by training existing staff (ONS). Practical preparation: role value, consultation records, alternatives — not false promises.",
    h1: "How to protect your job from AI",
    badge: "Practical preparation",
    intro:
      "You cannot control board-level restructuring decisions. You can control how clearly your contribution is documented, how calmly you prepare questions, and whether financial pressure will force a rushed decision if your role changes.",
    anxietyNote:
      "This page is not a list of tricks to 'beat' automation. It is preparation that may strengthen your position — without promising you can avoid redundancy.",
    positioning:
      "Protection means visibility, evidence and options — not immunity from employer decisions or a tactic to undermine a lawful process.",
    ctaPreset: "protection",
    midCta: "protection",
    heroStats: [
      { value: "36%", label: "UK firms training/retraining staff for AI (ONS)" },
      { value: "45%", label: "UK enterprises offering AI training (IBM, 2025)" },
      { value: "48%", label: "Global employers planning staff transitions (WEF)" },
    ],
    sections: [
      {
        title: "What 'protection' realistically means",
        paragraphs: [
          "In redundancy preparation, protection is often confused with prevention. Research suggests many employers prefer retraining over exit: ONS findings note that among firms engaging with AI, training or retraining existing staff is a commonly reported approach.",
          "IBM's 2025 UK survey of 500 business leaders found 45% of enterprises offer company-wide or role-specific AI training — while 67% cited internal resistance and cultural barriers slowing rollout. The picture is messy: opportunity and friction coexist.",
        ],
      },
      {
        title: "Make your role value legible — in business terms",
        paragraphs: [
          "Decision-makers under cost pressure may see roles as salary lines. A one-page value summary — outcomes delivered, risk reduced, revenue protected, compliance maintained — helps others understand what would be lost beyond automatable tasks.",
          "Keep it factual. This is visibility preparation for consultation or role-design conversations, not a promotional campaign.",
        ],
        bullets: [
          "List three measurable outcomes from the last 12 months.",
          "Note where work would stall if the role were vacant.",
          "Identify stakeholders who can describe your impact (with their consent).",
        ],
      },
      {
        title: "Map judgement-led work vs automatable tasks",
        paragraphs: [
          "Honest task mapping is the core of AI-era role protection. Split your week into: rules-based output, AI-assisted work you review, and work requiring discretion, relationships or sign-off.",
          "If 60% of your time is already AI-assisted drafting, your conversation with management is about what you own in the review chain — not whether AI exists.",
        ],
      },
      {
        title: "Build a consultation record before you need one",
        paragraphs: [
          "If restructuring is rumoured, start a dated log: meetings attended, what was said about AI or headcount, what remains unclear. Neutral follow-up emails ('Further to our conversation…') create a personal record.",
          "This supports your preparation. It is not a substitute for trade union or legal support if a formal process begins.",
        ],
      },
      {
        title: "Track internal alternatives early",
        paragraphs: [
          "WEF data shows 48% of employers globally expect to transition staff from AI-exposed roles elsewhere in the business. Internal mobility only works if you know vacancies exist.",
          "Save job adverts with dates. Prepare role-fit questions: content, pay, location, trial period, training. The Alternative Role Finder in the paid report organises this.",
        ],
      },
      {
        title: "Financial runway reduces forced decisions",
        paragraphs: [
          "The strongest practical protection against panic is knowing your numbers. Model package assumptions, essential monthly costs and how many runway months different income paths may buy under your figures.",
          "If redundancy happened this month — model that as a stress test, not a prediction.",
        ],
      },
      {
        title: "Protection measures in the paid report",
        paragraphs: [
          "Section 4 of the Redundancy Runway Brief includes a Protection Measures Playbook — eight pillars filtered to your situation: role visibility, consultation records, selection evidence, redeployment, AI exposure, financial readiness, communications and package integrity.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I protect my job from AI?",
        answer:
          "You cannot ensure job security. ONS and WEF data show many employers retrain or redeploy rather than exit — but individual outcomes vary. Preparation improves clarity; it does not control decisions.",
      },
      {
        question: "Should I learn AI tools to protect my role?",
        answer:
          "That is a personal career decision this site does not advise on. Some employers value AI literacy; IBM's survey notes training provision is still uneven across UK firms.",
      },
      {
        question: "What is the Role Protection Planner?",
        answer:
          "A paid-report module organising role value, task exposure, evidence themes and alternative options — preparation only.",
      },
      {
        question: "What if consultation has already started?",
        answer:
          "Shift focus to consultation logs, selection evidence and package verification. The Consultation Defence Pack supports question preparation — seek professional advice for rights questions.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.onsAiEmploymentFoi,
      AI_RESEARCH_SOURCES.ibmUkAi2025,
      AI_RESEARCH_SOURCES.wefPressJan2025,
    ],
  },
];
