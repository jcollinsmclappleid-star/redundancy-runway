import type { AiRedundancySeoPage } from "./ai-redundancy-page-types";
import { RUNWAY_REPORT_FULL, RUNWAY_REPORT_PRICE_GBP } from "@shared/product";
import { AI_RESEARCH_SOURCES } from "@shared/aiRedundancyResearch";

export const aiRedundancyPagesPart2: AiRedundancySeoPage[] = [
  {
    slug: "ai-job-risk-calculator",
    metaTitle: "AI Job Risk Calculator UK | Exposure vs Probability Explained",
    metaDescription:
      "We do not score AI job-loss probability. Model role exposure themes, package assumptions and runway months from your figures — with ONS context.",
    h1: "AI job risk calculator",
    badge: "Exposure · not probability",
    intro:
      "Most 'AI risk calculators' on the internet assign a percentage chance of losing your job. We deliberately do not. Probability scores imply scientific precision that does not exist at individual level. This tool models financial readiness and organises role exposure themes from your assumptions.",
    anxietyNote:
      "A number on a screen cannot tell you your future. What numbers can do — when they are yours — is show how long your money may last if income changes.",
    positioning:
      "Role exposure describes which tasks may change if AI is adopted. Risk implies a forecast we do not provide.",
    ctaPreset: "readiness",
    primaryCta: { label: "Start readiness check from my figures", href: "/wizard" },
    secondaryCta: { label: `Unlock full report — £${RUNWAY_REPORT_PRICE_GBP}`, href: "/unlock" },
    showRunwayEmbed: true,
    midCta: "readiness",
    heroStats: [
      { value: "5%", label: "AI-using UK firms reporting headcount fall (ONS)" },
      { value: "7%", label: "Same figure for firms with 10+ employees" },
      { value: "11%", label: "Firms planning AI that expect headcount fall" },
    ],
    sections: [
      {
        title: "Why we refuse to give you an 'AI risk score'",
        paragraphs: [
          "Individual redundancy outcomes depend on employer solvency, management decisions, sector regulation, selection design and timing — none of which can be reduced to a percentage from a web form.",
          "ONS data is instructive here: in late March 2026, 5% of UK businesses already using AI reported workforce headcount had decreased because of those technologies. Among firms planning AI adoption, 11% expected headcount to decrease — rising to higher shares among larger employers in some waves.",
          "Those are employer-reported statistics, not employee-level risk scores. Quoting them as 'your chance of redundancy' would be misleading.",
        ],
      },
      {
        title: "What role exposure means in practice",
        paragraphs: [
          "Exposure is a preparation lens. You note which weekly tasks are rules-based, document-heavy or already AI-assisted — versus which require judgement, regulated sign-off or relationship trust.",
          "That map shapes which paid modules help most: Role Protection Planner for evidence themes, Consultation Defence Pack if restructuring becomes formal, Alternative Role Finder if redeployment is discussed.",
        ],
        bullets: [
          "High exposure: most output is templated, triaged or auto-generated with light review.",
          "Mixed exposure: AI drafts; you approve, customise and own client relationships.",
          "Lower exposure: accountability, physical skill or trust dominate the role.",
        ],
      },
      {
        title: "What the calculator actually computes",
        paragraphs: [
          "From your inputs: statutory redundancy estimate (UK rules, £751 weekly cap, two-year qualifying service), package total, starting capital, monthly burn and baseline runway months.",
          "The paid report adds a Redundancy Readiness Score and stability band — these summarise financial resilience under your assumptions, not employment security or AI exposure.",
        ],
      },
      {
        title: "Readiness score: financial, not vocational",
        paragraphs: [
          "The readiness score weights whether package assumptions are complete, essential costs are entered, savings are verified and income recovery is modelled. A high readiness score means your financial model is well-populated — not that your job is safe.",
          "Conversely, a low score flags gaps to fix before relying on the model in HR conversations.",
        ],
      },
      {
        title: "Stress test: if redundancy happened this month",
        paragraphs: [
          "The paid report includes a scenario modelling immediate redundancy under your package and cost assumptions. It answers: 'If this happened now, how many months might I have on these costs?'",
          "That is a stress test for planning — not a prediction that redundancy will happen this month.",
        ],
      },
      {
        title: "How ONS adoption data should inform — not alarm — you",
        paragraphs: [
          "AI adoption among UK businesses rose from 9% (September 2023) to 26% (March 2026). Adoption is accelerating faster than reported headcount cuts.",
          "For many employees, the near-term experience is changing tools and workflows — with restructuring a separate, smaller reported outcome. Both experiences deserve preparation.",
        ],
        stats: [
          { value: "26%", label: "UK businesses using AI (Mar 2026)" },
          { value: "18%", label: "Planning adoption in next 3 months" },
        ],
      },
      {
        title: "Next step: build your snapshot",
        paragraphs: [
          "Enter cautious figures. Note exposure themes separately in the Role Protection Planner after unlock. Combine financial runway with consultation preparation if your employer's AI programme becomes a formal proposal.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this calculate my chance of being replaced by AI?",
        answer:
          "No. We model financial readiness and preparation gaps. ONS reports 5% of AI-using firms saw headcount fall — an employer statistic, not an individual probability.",
      },
      {
        question: "What is the difference between risk and exposure?",
        answer:
          "Exposure describes task patterns that may change with automation. Risk implies a forecast percentage we do not assign.",
      },
      {
        question: "Is the baseline calculator free?",
        answer: `Yes — statutory estimate and baseline runway preview. The full readiness report is a one-off £${RUNWAY_REPORT_PRICE_GBP} unlock.`,
      },
      {
        question: "What paid tools address AI-related uncertainty?",
        answer:
          "Protection measures playbook, Role Protection Planner, Consultation Defence Pack, Alternative Role Finder, Decision Leverage Map and runway scenario dashboards.",
      },
    ],
    researchSources: [AI_RESEARCH_SOURCES.onsBicsApr2026, AI_RESEARCH_SOURCES.onsAiEmploymentFoi],
  },
  {
    slug: "jobs-most-at-risk-from-ai",
    metaTitle: "Jobs Most at Risk From AI | Task Patterns & UK Adoption Data",
    metaDescription:
      "Which task patterns face faster AI change? ONS: 45% of large UK employers use AI. WEF declining roles: clerical, admin, printing. Preparation — not prophecy.",
    h1: "Jobs most at risk from AI",
    badge: "Task exposure patterns",
    intro:
      "'Most at risk' lists make frightening reading. This page focuses on task patterns that research associates with faster automation — and on how UK employers are actually deploying AI today. It is not a redundancy forecast for your job title.",
    anxietyNote:
      "Seeing your occupation named can spike anxiety. Remember: employers often redesign roles before removing them — and UK data shows reported headcount cuts remain a minority outcome among AI adopters.",
    positioning:
      "Exposure patterns help you prepare early. They do not tell you redundancy is inevitable for a given role.",
    ctaPreset: "exposure",
    midCta: "protection",
    heroStats: [
      { value: "45%", label: "UK large employers (250+) using AI" },
      { value: "9%→22%", label: "ONS projected AI adoption 2023→2024 (MES)" },
      { value: "5M", label: "Net global jobs displaced by robotics (WEF, 2030)" },
    ],
    sections: [
      {
        title: "Risk lists confuse job titles with weekly tasks",
        paragraphs: [
          "Two people with the same job title can have opposite exposure. A 'customer service adviser' handling regulated complaints faces different automation pressure than one processing password resets.",
          "Research from the WEF, OECD and academic task-exposure models consistently scores activities — not LinkedIn headlines.",
        ],
      },
      {
        title: "Task clusters with higher automation potential",
        paragraphs: [
          "Across studies, these task types recur in higher-exposure categories:",
        ],
        bullets: [
          "Data entry, reconciliation and invoice matching.",
          "Scripted first-line customer queries and ticket routing.",
          "Template-based content, summaries and standard report assembly.",
          "Scheduling, booking and form processing at volume.",
          "Basic code generation from clear specifications.",
        ],
      },
      {
        title: "Occupations employers expect to decline fastest",
        paragraphs: [
          "The WEF Future of Jobs Report 2025 employer survey highlights roles expected to see the sharpest percentage declines through 2030 — including cashiers and ticket clerks, administrative assistants, printing workers and routine accounting tasks.",
          "Decline in demand is not the same as every holder of that role being made redundant. Some employers shrink teams; others redeploy people into hybrid roles.",
        ],
      },
      {
        title: "Sectors where UK AI adoption is concentrated",
        paragraphs: [
          "ONS Management and Expectations Survey data (2023) showed AI adoption at 9% of firms — rising to 22% in firms' 2024 plans. Adoption rates increase sharply when measured by employment share because larger firms adopt first.",
          "Practically, employees in large financial services, professional services, retail HQ functions and technology firms may encounter AI tooling earlier than those in micro-businesses.",
        ],
        stats: [
          { value: "69%", label: "UK firms using cloud systems (ONS MES, 2023)" },
          { value: "9%", label: "UK firms using AI in 2023 (ONS MES)" },
        ],
      },
      {
        title: "Customer service and operations: what changes first",
        paragraphs: [
          "Contact centres were early adopters of chatbots and AI triage. The human role often shifts toward exception handling, complaints, vulnerable customers and regulated advice boundaries — but team sizes may still shrink if volume drops.",
          "Operations teams see reporting, forecasting packs and standard analysis assisted first. Strategic interpretation and sign-off often remain — but role definitions change.",
        ],
      },
      {
        title: "Finance, legal and professional services",
        paragraphs: [
          "Document review, contract summarisation and compliance checking are common AI use cases. Junior roles built around those tasks may face faster redesign — while senior accountability and client relationships retain different value.",
          "Regulation can slow deployment: someone must remain accountable even when AI assists the workflow.",
        ],
      },
      {
        title: "Why UK headcount data does not match fear levels",
        paragraphs: [
          "Despite rapid AI adoption (26% of UK businesses in March 2026), only 5% of AI-using firms reported workforce decreases attributable to AI. Anxiety runs ahead of reported exits — which does not mean exits never happen, but explains why preparation beats panic.",
        ],
      },
      {
        title: "If your tasks are in higher-exposure clusters",
        paragraphs: [
          "Document judgement-led work, track internal vacancies, model financial runway and prepare consultation questions before decisions are final. The AI job risk calculator organises exposure themes without assigning a probability.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which jobs are most at risk from AI?",
        answer:
          "Research points to clerical, administrative, routine customer-service and template-driven knowledge work. Task mix within your role matters more than the title.",
      },
      {
        question: "Are large company employees more affected?",
        answer:
          "ONS data shows AI adoption is far higher among large UK employers (45% vs 26% overall). That may mean earlier task change — not automatic redundancy.",
      },
      {
        question: "Will exposed roles always be made redundant?",
        answer:
          "No. WEF surveys show many employers plan redeployment and upskilling. ONS UK data shows headcount cuts reported by a minority of AI users.",
      },
      {
        question: "How do I check my own exposure?",
        answer:
          "Map your weekly tasks, then use the AI job risk calculator and Role Protection Planner with your situation — not a generic list.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.wefFutureJobs2025,
      AI_RESEARCH_SOURCES.onsBicsApr2026,
      AI_RESEARCH_SOURCES.onsMesAi2023,
    ],
  },
  {
    slug: "jobs-safe-from-ai",
    metaTitle: "Jobs Safe From AI? | Resilience Factors & Honest Limits",
    metaDescription:
      "No job is fully 'safe' — but care roles, educators and regulated accountability show different patterns. WEF net +78M jobs by 2030. Prepare anyway.",
    h1: "Jobs safe from AI",
    badge: "Resilience · not immunity",
    intro:
      "Search traffic for 'jobs safe from AI' often comes from people seeking reassurance. Here is the honest version: no occupation is permanently immune from technology or restructuring. Some role factors are associated with slower task automation — that is different from safety.",
    anxietyNote:
      "If you were hoping for a list that ends your worry, this page will disappoint you. If you want a clearer picture of what 'resilience' actually means — and what to do anyway — read on.",
    positioning:
      "Resilience factors describe task patterns that may change more slowly. They do not protect you from redundancy, outsourcing or employer strategy.",
    ctaPreset: "readiness",
    primaryCta: { label: "Check my redundancy readiness", href: "/wizard" },
    secondaryCta: { label: "Unlock Decision Leverage Map", href: "/unlock" },
    midCta: "readiness",
    heroStats: [
      { value: "+78M", label: "Net global jobs by 2030 (WEF macrotrends)" },
      { value: "40%", label: "Of job skills expected to change (WEF)" },
      { value: "5%", label: "AI-using UK firms reporting headcount fall" },
    ],
    sections: [
      {
        title: "The honest answer to 'are any jobs safe?'",
        paragraphs: [
          "No. The WEF Future of Jobs Report 2025 projects 22% of formal jobs globally will be disrupted by labour-market transformation by 2030 — created, displaced or both. Technology is one driver among demographics, green transition and geoeconomic shifts.",
          "Roles with slower automation potential can still be made redundant for commercial reasons unrelated to AI. Safety language is misleading; resilience language is more accurate.",
        ],
      },
      {
        title: "Occupations growing even as others decline",
        paragraphs: [
          "WEF employer surveys expect growth in care roles, educators, farmworkers and delivery drivers alongside AI specialists — driven by ageing populations, consumption patterns and technology itself.",
          "Growth in an occupation does not mean every applicant succeeds — but it explains why macro job numbers can rise while specific roles feel threatened.",
        ],
        bullets: [
          "Care and personal service roles.",
          "Teaching and education professionals.",
          "Skilled trades in physical environments.",
          "AI, data and cybersecurity specialists.",
        ],
      },
      {
        title: "Role factors associated with slower automation",
        paragraphs: [
          "Research across WEF, OECD and robotics studies converges on similar themes:",
        ],
        bullets: [
          "Licensed or regulated professional accountability.",
          "Work in unpredictable physical environments.",
          "Deep trust relationships built over years.",
          "High-consequence decisions with reputational or safety risk.",
          "Complex multi-stakeholder negotiation and politics.",
        ],
      },
      {
        title: "Even resilient roles use AI — differently",
        paragraphs: [
          "Surgeons may use AI-assisted imaging; solicitors may use AI for research; electricians may use diagnostic tools. Resilience often means the human remains accountable — not that technology stays out.",
          "Preparation in resilient roles means understanding how your accountability boundary shifts when AI assists upstream work.",
        ],
      },
      {
        title: "Why UK employers often retrain rather than exit",
        paragraphs: [
          "ONS research on AI and employment notes training or retraining existing staff as a commonly reported workforce approach among firms engaging with AI — alongside smaller shares reporting headcount reduction.",
          "If your role looks resilient on paper, your employer may still expect you to work differently — not necessarily leave.",
        ],
        stats: [
          { value: "77%", label: "Global employers planning upskilling (WEF)" },
          { value: "36%", label: "UK firms citing train/retrain approach (ONS)" },
        ],
      },
      {
        title: "Skills change even when jobs remain",
        paragraphs: [
          "WEF reports nearly 40% of skills required in jobs will change over the coming years, with 63% of employers citing skills gaps as a key barrier to transformation.",
          "Resilience is partly vocational and partly financial: can you absorb a learning curve or income dip if your role redesigns?",
        ],
      },
      {
        title: "Prepare anyway — runway is role-agnostic",
        paragraphs: [
          "Readiness modelling is useful regardless of exposure level. Income can change from redundancy, ill health, caring responsibilities or voluntary career moves.",
          "Model package assumptions, essential costs and runway months. The Decision Leverage Map in the paid report shows preparation opportunities across money, time, options and evidence.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are any jobs completely safe from AI?",
        answer:
          "No. Some task patterns may change more slowly, but restructuring, outsourcing and commercial pressure affect all sectors.",
      },
      {
        question: "Should I skip preparation if my role seems resilient?",
        answer:
          "No. WEF data shows 40% of skills may change. Financial runway modelling is useful independent of AI exposure.",
      },
      {
        question: "Which UK roles are growing?",
        answer:
          "WEF surveys highlight care, education, delivery and AI-related technical roles among growers — alongside declines in routine clerical work.",
      },
      {
        question: "Does this page say my job is safe?",
        answer: "No. It explains resilience factors and macro trends only — not outcomes for your role.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.wefFutureJobs2025,
      AI_RESEARCH_SOURCES.wefPressJan2025,
      AI_RESEARCH_SOURCES.onsAiEmploymentFoi,
      AI_RESEARCH_SOURCES.onsBicsApr2026,
    ],
  },
  {
    slug: "ai-redundancy-rights-uk",
    metaTitle: "AI Redundancy Rights UK | Consultation, Selection & Package Facts",
    metaDescription:
      "UK redundancy rights are not AI-specific. Collective consultation at 20+ proposals, £751 weekly cap, trial periods — questions to prepare, not legal advice.",
    h1: "AI redundancy rights UK",
    badge: "UK facts · questions to prepare",
    intro:
      "Searching 'AI redundancy rights' usually means you want to know where you stand. UK employment law does not create a special category for AI redundancies — but it does set consultation, selection and payment frameworks that apply whatever business reason the employer gives.",
    anxietyNote:
      "Rights questions are legitimate. This page organises themes and official sources — it does not tell you whether your employer has acted unlawfully.",
    positioning:
      "For rights specific to your case, contact ACAS (0300 123 1100), your trade union or a qualified employment solicitor. This tool supports preparation and financial modelling only.",
    ctaPreset: "consultation",
    midCta: "consultation",
    heroStats: [
      { value: "£751", label: "Weekly pay cap for statutory redundancy" },
      { value: "£30k", label: "Tax-free threshold for qualifying redundancy pay" },
      { value: "20+", label: "Proposed redundancies triggering collective consultation" },
    ],
    sections: [
      {
        title: "There is no separate 'AI redundancy law' in the UK",
        paragraphs: [
          "Redundancy is a form of dismissal because the employer needs fewer people for work of a particular kind, or the workplace is closing. AI, automation or digitisation may appear in the employer's business case — but the legal framework is general redundancy law.",
          "GOV.UK and ACAS are the authoritative starting points. This page summarises preparation themes; it does not interpret law for your situation.",
        ],
      },
      {
        title: "Consultation: what should happen",
        paragraphs: [
          "Employers should consult meaningfully before confirming redundancies. Where 20 or more redundancies are proposed at one establishment within 90 days, collective consultation with representatives is required alongside individual consultation.",
          "Consultation should cover the business reason, ways to avoid redundancies, reducing numbers and mitigating consequences. Ask for written information and keep your own meeting notes.",
        ],
      },
      {
        title: "Selection pools and criteria",
        paragraphs: [
          "When employers use selection, criteria should be objective and applied consistently. Common themes include skills, performance, attendance and future business needs.",
          "Prepare questions: How were pools defined? How are criteria weighted? What evidence is used? Is there an appeal? The Selection Criteria Prep module organises evidence — it does not assess fairness.",
        ],
      },
      {
        title: "Suitable alternative employment",
        paragraphs: [
          "Employers may offer alternative roles. Employees may be entitled to a trial period (commonly four weeks, extendable by agreement). Unreasonable refusal of suitable alternative employment can affect redundancy pay entitlement — suitability is a legal question for professional advice.",
          "Prepare comparison questions: job content, location, pay, benefits, trial length and training.",
        ],
      },
      {
        title: "Statutory redundancy pay: figures to verify",
        paragraphs: [
          "From 6 April 2026, statutory redundancy pay uses a £751 weekly pay cap (or your actual weekly gross if lower), age-band multipliers (0.5, 1.0 or 1.5 weeks per year depending on age), maximum 20 years' service, and minimum two years' qualifying service.",
          "Up to £30,000 of qualifying redundancy payment may be tax-free. Notice pay, holiday pay and PILON are separate components — verify each line in writing.",
        ],
        stats: [
          { value: "2 yrs", label: "Minimum qualifying service" },
          { value: "20 yrs", label: "Maximum service counted" },
        ],
      },
      {
        title: "If AI is cited in the business reason",
        paragraphs: [
          "Ask how technology change links to headcount: which functions, which locations, which timeline. Request the consultation document pack and any selection matrix shared with the pool.",
          "AI as a stated reason does not bypass consultation or selection rules — but assessing compliance is for advisers, not calculators.",
        ],
      },
      {
        title: "Documents to gather",
        paragraphs: [
          "Build a folder early:",
        ],
        bullets: [
          "Contract, variations, payslips and P60.",
          "Redundancy at risk letter and consultation papers.",
          "Selection criteria, scoring sheets or matrix if provided.",
          "Internal vacancy list and role descriptions.",
          "Settlement correspondence and draft agreement if issued.",
        ],
      },
      {
        title: "Model finances while you gather facts",
        paragraphs: [
          "Rights preparation and financial preparation run in parallel. Enter cautious package assumptions in the calculator so you know runway months while waiting for HR confirmations.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I have special rights if AI caused my redundancy?",
        answer:
          "UK redundancy rights are not AI-specific in the way summarised here. General consultation, selection and payment rules apply. Seek professional advice for your case.",
      },
      {
        question: "Can this page tell me if my employer broke the law?",
        answer: "No. It does not provide legal advice or determine unlawful conduct.",
      },
      {
        question: "What is the statutory redundancy weekly cap?",
        answer: "£751 from 6 April 2026. Verify current figures on GOV.UK.",
      },
      {
        question: "When is collective consultation required?",
        answer:
          "Broadly when 20 or more redundancies are proposed at one establishment within 90 days. Confirm with ACAS or an adviser.",
      },
      {
        question: "Should I model my finances while preparing rights questions?",
        answer:
          "Yes — runway modelling helps you understand financial pressure while gathering information. It does not replace legal advice.",
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.govUkRedundancy,
      AI_RESEARCH_SOURCES.acasRedundancy,
      AI_RESEARCH_SOURCES.onsBicsApr2026,
    ],
  },
  {
    slug: "ai-proof-your-career",
    metaTitle: "How to AI-Proof Your Career | Skills Change & Runway Planning",
    metaDescription:
      "WEF: 40% of job skills may change; 77% of employers plan upskilling. AI-proofing means preparation and runway — not job security promises.",
    h1: "How to AI-proof your career",
    badge: "Skills · visibility · runway",
    intro:
      "'AI-proof your career' is marketing language — often attached to courses that cannot control your employer's headcount decisions. What you can do is respond to how labour markets are shifting: document value, track skill demands, keep internal options visible and model finances if income disrupts.",
    anxietyNote:
      "Career anxiety and financial anxiety overlap. Addressing both — skills visibility and runway months — is more useful than chasing an illusion of permanent immunity.",
    positioning:
      "This page is preparation framing only — not career coaching, training recommendations or promises of job security.",
    ctaPreset: "protection",
    midCta: "protection",
    heroStats: [
      { value: "40%", label: "Of job skills expected to change (WEF)" },
      { value: "77%", label: "Employers planning worker upskilling" },
      { value: "63%", label: "Employers citing skills gap as key barrier" },
    ],
    sections: [
      {
        title: "What AI-proofing cannot mean",
        paragraphs: [
          "No course, certification or tool can ensure your role survives restructuring. WEF data shows 41% of employers globally plan workforce reduction as AI automates tasks — while 48% plan to move affected staff elsewhere and 77% plan upskilling.",
          "AI-proofing, used honestly, means staying legible to employers and resilient in your finances while change unfolds — not stopping change.",
        ],
      },
      {
        title: "The skills horizon: 40% may change",
        paragraphs: [
          "The Future of Jobs Report 2025 estimates nearly 40% of skills required in jobs will change in the coming years. Technology skills in AI, big data and cybersecurity are rising fast — but WEF emphasises human skills too: creative thinking, resilience, flexibility and agility.",
          "63% of employers cited skills gaps in the workforce as the key barrier to transformation — meaning hiring and redeployment are live issues, not closed doors.",
        ],
        stats: [
          { value: "48%", label: "Employers planning to transition AI-exposed staff" },
          { value: "45%", label: "UK firms offering AI training (IBM, 2025)" },
        ],
      },
      {
        title: "Build a task portfolio — not just a job title",
        paragraphs: [
          "Career resilience in AI-era labour markets is task-based. Maintain a private inventory: tasks you own end-to-end, tasks you review after AI assistance, tasks only you can sign off.",
          "That inventory feeds manager conversations, LinkedIn updates (if you choose) and consultation evidence if restructuring arrives.",
        ],
      },
      {
        title: "Make outcomes visible in business language",
        paragraphs: [
          "Employers allocate roles to problems solved. Translate your work into outcomes: revenue protected, churn reduced, compliance maintained, projects delivered under constraint.",
          "A quarterly email to your manager summarising deliverables creates contemporaneous visibility — preparation, not politics.",
        ],
      },
      {
        title: "Internal mobility as a career strategy",
        paragraphs: [
          "WEF's 48% transition figure suggests many large employers prefer internal moves over external hiring for AI-disrupted roles. That only helps if you monitor vacancies, build cross-team relationships and prepare role-fit questions.",
          "The Alternative Role Finder in the paid report tracks comparisons and trial-period questions.",
        ],
      },
      {
        title: "Training: opportunity and gap",
        paragraphs: [
          "IBM's 2025 UK survey found only 45% of enterprises offer company-wide or role-specific AI training — and 38% prioritise inclusive workforce transformation. Training availability is uneven; do not assume your employer will upskill you automatically.",
          "Whether to invest in learning is a personal decision this site does not advise on. The research case for documenting existing skills may be stronger than rushing into generic certificates.",
        ],
      },
      {
        title: "Financial runway is career infrastructure",
        paragraphs: [
          "Career transitions take time. Runway months — how long your capital lasts on household costs — determine whether you can afford a deliberate move or must accept the first offer.",
          "Model package assumptions, essential spending and slow income-recovery paths. The paid report's scenario dashboards show where pressure concentrates month by month.",
        ],
      },
      {
        title: "Protection measures in the paid report",
        paragraphs: [
          "The Protection Measures Playbook covers eight preparation pillars: role visibility, consultation records, selection evidence, redeployment, AI exposure documentation, financial readiness, communications and package integrity after redundancy.",
          "Pair career preparation with financial preparation — especially when AI uncertainty is the trigger.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I AI-proof my career completely?",
        answer:
          "No. WEF data shows widespread skill change and mixed employer responses — upskilling, transition and reduction. Preparation improves options; it does not ensure job security.",
      },
      {
        question: "Is this career advice?",
        answer:
          "No. It is research-informed preparation framing and financial modelling. Seek career coaching separately if needed.",
      },
      {
        question: "What skills does WEF say are growing?",
        answer:
          "AI and big data, cybersecurity, technology literacy — alongside human skills like creative thinking and resilience.",
      },
      {
        question: "Should I start with the calculator?",
        answer: `Yes — model package and runway from your figures, then unlock the ${RUNWAY_REPORT_FULL} (£${RUNWAY_REPORT_PRICE_GBP}) for Role Protection Planner and protection playbooks.`,
      },
    ],
    researchSources: [
      AI_RESEARCH_SOURCES.wefFutureJobs2025,
      AI_RESEARCH_SOURCES.wefPressJan2025,
      AI_RESEARCH_SOURCES.ibmUkAi2025,
      AI_RESEARCH_SOURCES.onsAiEmploymentFoi,
    ],
  },
];
