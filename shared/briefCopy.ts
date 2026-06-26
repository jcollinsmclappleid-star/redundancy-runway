export type BriefSituationType = "at_risk" | "post_redundancy" | "other";

export const BRIEF_REPORT_VERSION = "2.2";

export const BRIEF_METHODOLOGY = `This report combines three layers: (1) figures calculated by the deterministic runway engine from the assumptions you entered; (2) expert-written UK redundancy guidance, filtered to your situation; and (3) an optional plain-English executive summary when AI enhancement is enabled. It does not provide financial, legal, tax, employment, debt, mortgage, benefits or career advice and does not predict job outcomes.`;

export const BRIEF_GLOSSARY: Array<{ term: string; definition: string }> = [
  {
    term: "Statutory redundancy pay",
    definition:
      "A minimum redundancy payment for qualifying employees, calculated from age, length of service and weekly pay subject to a legal cap. Your employer may offer more.",
  },
  {
    term: "Notice pay",
    definition:
      "Pay for the notice period when employment ends. It may be worked, paid in lieu (PILON), or a combination depending on contract and process.",
  },
  {
    term: "Enhanced redundancy",
    definition:
      "An employer payment above the statutory minimum. It may replace statutory redundancy in the package total — components should not be double-counted.",
  },
  {
    term: "Starting capital",
    definition:
      "The lump sum available at the start of the model, typically redundancy package plus savings and other one-off amounts entered.",
  },
  {
    term: "Net monthly burn",
    definition:
      "Monthly expenses minus income included in the model during the gap period. This drives how quickly starting capital is used.",
  },
  {
    term: "Baseline scenario",
    definition:
      "The primary model path using your entered assumptions, including replacement income and job-gap timing where provided.",
  },
  {
    term: "Severe scenario",
    definition:
      "A stress case that removes replacement income and benefits from the model to show pressure if no income were included.",
  },
];

export const PACKAGE_COMPONENT_GUIDES: Record<
  string,
  { title: string; body: string; whenRelevant: string }
> = {
  statutory_redundancy: {
    title: "Statutory redundancy",
    body:
      "The statutory estimate uses your age, service and weekly pay assumptions. It is a reference figure — many packages include an enhanced element instead of or as well as statutory pay.",
    whenRelevant: "Always shown when service and pay inputs are present.",
  },
  enhanced_redundancy: {
    title: "Enhanced redundancy",
    body:
      "When an enhanced or manual package is entered, it typically replaces the statutory element in the model total. Check the offer letter shows how statutory, notice and holiday are separated.",
    whenRelevant: "When an enhanced or manual package figure is used.",
  },
  notice_pay: {
    title: "Notice pay",
    body:
      "Notice pay reflects your notice period. Confirm whether this is worked, paid in lieu, or already included in a single headline redundancy figure.",
    whenRelevant: "When notice weeks are entered or estimated.",
  },
  holiday_pay: {
    title: "Holiday pay",
    body:
      "Accrued but untaken holiday is often paid on termination. Verify days accrued and the rate used — it is commonly a separate line from redundancy pay.",
    whenRelevant: "When holiday weeks or days are included in the model.",
  },
  unpaid_wages: {
    title: "Unpaid wages",
    body:
      "Final payroll items — wages, overtime, commission or bonus due — can affect starting capital if included. Confirm against your final payslip.",
    whenRelevant: "When unpaid wages are entered or flagged as missing.",
  },
  pilon: {
    title: "Payment in lieu of notice (PILON)",
    body:
      "PILON may appear instead of worked notice. Tax treatment and contract wording can differ from redundancy pay — verify the breakdown with HR or payroll.",
    whenRelevant: "When PILON is referenced in package inputs or checks.",
  },
};

export const THEME_LABELS: Record<string, string> = {
  starting_capital: "Starting capital",
  monthly_pressure: "Monthly pressure",
  scenario_spread: "Scenario spread",
  housing_pressure: "Housing pressure",
  data_quality: "Assumption quality",
  runway_duration: "Months on household costs",
  sensitivity: "What changes the picture",
  income_assumptions: "Income assumptions",
  package_clarity: "Package clarity",
};

export const THEME_FINDING_TEMPLATES: Record<
  string,
  { title: string; body: string; priority: number }
> = {
  package_clarity: {
    title: "Package clarity",
    priority: 1,
    body:
      "Under the assumptions entered, one or more package components are missing, unclear or not yet confirmed. Clarifying notice pay, holiday pay, unpaid wages and the payment date can change the starting capital figure used in this model.",
  },
  housing_pressure: {
    title: "Housing pressure",
    priority: 2,
    body:
      "Under the assumptions entered, housing forms a material share of essential monthly costs. In this model, housing assumptions flow through to monthly pressure and to how many months the money may last in stress scenarios.",
  },
  scenario_spread: {
    title: "Scenario spread",
    priority: 3,
    body:
      "Under the assumptions entered, the gap between baseline and stress scenarios is notable. This shows how sensitive the picture is to income timing, job-gap length or removal of replacement income — not a forecast of what will happen.",
  },
  monthly_pressure: {
    title: "Monthly pressure",
    priority: 4,
    body:
      "Under the assumptions entered, monthly expenses exceed income included in the model during the gap period. The net monthly shortfall is the main driver of how quickly starting capital is used.",
  },
  sensitivity: {
    title: "Sensitivity",
    priority: 5,
    body:
      "Under the assumptions entered, small changes to essential costs or income timing appear to move the months-left figure meaningfully in the sensitivity tests. These are model stress tests, not predictions.",
  },
  data_quality: {
    title: "Assumption quality",
    priority: 6,
    body:
      "Under the assumptions entered, some inputs are partial, missing or marked uncertain. Sections marked for verification should be confirmed before relying on the model for planning conversations.",
  },
  starting_capital: {
    title: "Starting capital",
    priority: 7,
    body:
      "Under the assumptions entered, starting capital combines the redundancy package with savings and other amounts entered. The enhanced package replaces statutory in the total when used — verify the breakdown matches your offer letter.",
  },
  runway_duration: {
    title: "Months on household costs",
    priority: 8,
    body:
      "Under the assumptions entered, the baseline months-left figure reflects net monthly burn against starting capital. Stress scenarios show how that changes if income or job-gap assumptions differ.",
  },
  income_assumptions: {
    title: "Income assumptions",
    priority: 9,
    body:
      "Under the assumptions entered, replacement income, benefits or partner income may be included in the model. Confirm which income sources you expect during the gap period and for how long.",
  },
};

export const EXECUTIVE_HEADLINE_TEMPLATES: Record<string, string> = {
  package_clarity:
    "Under your assumptions, clarifying the redundancy package breakdown appears most relevant before relying on the months-left picture.",
  housing_pressure:
    "Under your assumptions, housing costs are a notable pressure point within essential spending.",
  scenario_spread:
    "Under your assumptions, the gap between baseline and stress scenarios shows how sensitive the picture is to income and timing.",
  at_risk_consultation:
    "Under your assumptions, consultation preparation and package clarity are the main planning themes while your role is at risk.",
  post_redundancy_package:
    "Under your assumptions, the package total and how it translates to months on household costs are the main themes in this report.",
  default:
    "Under your assumptions, this report summarises your package, months on household costs, and practical preparation areas from the figures entered.",
};

export const SITUATION_INTROS: Record<BriefSituationType, string> = {
  at_risk:
    "You indicated your role may be at risk. This report prioritises consultation preparation, package understanding and evidence organisation alongside the months-left model.",
  post_redundancy:
    "You indicated a recent or impending redundancy. This report prioritises package verification, missing-payment checks and how long the money may last on your household costs.",
  other:
    "This report organises your redundancy package assumptions, months-left model and preparation checklists from the figures entered.",
};

export const POSITION_PLAYBOOK_INTRO = {
  package:
    "Most redundancy packages combine several components. The checklist below is standard UK guidance — your model highlights which areas are included, missing or worth confirming.",
  consultation:
    "If you are in consultation, structured questions can help you understand the process and package calculation. These are preparation prompts only — not legal advice.",
  scenarios:
    "The payout scenario ladder shows how different package totals could change starting capital and baseline months in this model. It does not predict what your employer will offer.",
  roleProtection:
    "While your role is at risk, organising evidence and visibility can support consultation conversations. These are preparation actions only — they do not guarantee any outcome.",
  selection:
    "If selection criteria apply, understanding what may be used and what evidence you hold can help you prepare questions. This does not assess whether criteria are fair.",
};

/** Standard UK package lines to verify — always shown; model flags which apply. */
export const PACKAGE_VERIFICATION_CHECKLIST: Array<{
  itemKey: string;
  label: string;
  whatToConfirm: string;
  whereToCheck: string;
}> = [
  {
    itemKey: "statutory",
    label: "Statutory redundancy",
    whatToConfirm: "How statutory pay was calculated (age, service, weekly pay cap) and whether an enhanced element replaces it.",
    whereToCheck: "Settlement letter, HR breakdown, payslips",
  },
  {
    itemKey: "notice",
    label: "Notice pay or PILON",
    whatToConfirm: "Whether notice is worked, paid in lieu, or included in a single headline figure.",
    whereToCheck: "Contract, termination letter, HR",
  },
  {
    itemKey: "holiday",
    label: "Accrued holiday pay",
    whatToConfirm: "Days accrued, rate used, and whether holiday is separate from redundancy pay.",
    whereToCheck: "HR, final payslip, holiday records",
  },
  {
    itemKey: "wages",
    label: "Unpaid wages, overtime, commission or bonus",
    whatToConfirm: "Any final payroll items due on termination and payment timing.",
    whereToCheck: "Final payslip, commission plan, HR payroll",
  },
  {
    itemKey: "tax",
    label: "Tax treatment and deductions",
    whatToConfirm: "Which elements are gross, expected tax treatment, and net vs gross figures in communications.",
    whereToCheck: "Payroll, P45, HMRC guidance, tax professional if needed",
  },
  {
    itemKey: "payment_date",
    label: "Payment date and instalments",
    whatToConfirm: "When cash is paid, whether instalments apply, and impact on your planning timeline.",
    whereToCheck: "Settlement letter, HR, payroll",
  },
  {
    itemKey: "pension",
    label: "Pension and benefits on exit",
    whatToConfirm: "Pension contributions to leaving date, life cover, share schemes or LTIPs if relevant.",
    whereToCheck: "HR, pension provider, scheme documents",
  },
  {
    itemKey: "settlement",
    label: "Settlement agreement terms",
    whatToConfirm: "If signing an agreement, that the headline figure matches signed terms and schedules.",
    whereToCheck: "Solicitor, employer HR, signed agreement",
  },
];

export const DOCUMENTS_TO_GATHER: Array<{ label: string; whyItMatters: string }> = [
  { label: "Redundancy or termination letter", whyItMatters: "Confirms process stage, dates and headline package references." },
  { label: "Written package breakdown from HR", whyItMatters: "Separates statutory, enhanced, notice, holiday and other lines." },
  { label: "Recent payslips (last 3–12 months)", whyItMatters: "Supports weekly pay, bonus and deduction verification." },
  { label: "Contract and handbook extracts", whyItMatters: "Notice periods, redundancy policy and enhanced terms if contractual." },
  { label: "Pension scheme summary", whyItMatters: "Clarifies contributions and options on leaving." },
  { label: "Mortgage or tenancy statement", whyItMatters: "Confirms housing cost used in monthly pressure modelling." },
  { label: "Bank statements (savings access)", whyItMatters: "Confirms liquid amounts available at redundancy." },
  { label: "Appraisal or performance records", whyItMatters: "Relevant if consultation or selection criteria apply." },
];

export const HR_PACKAGE_QUESTIONS: string[] = [
  "Can you provide a written breakdown of statutory redundancy, enhanced redundancy, notice pay or PILON, and holiday pay?",
  "Is the package figure gross or net, and what deductions should I expect?",
  "When will each element be paid — single payment or instalments?",
  "Are unpaid wages, bonus or commission included, and if not, why?",
  "Does the enhanced redundancy replace statutory redundancy in the calculation?",
  "Can I have a copy of the calculation method used for my package?",
];

export const PRACTICAL_ORGANISATION_CHECKLIST: string[] = [
  "List essential monthly costs and compare to the model figures entered.",
  "Note redundancy effective date and expected payment date on one timeline.",
  "Gather package letters and payslips in one folder (digital or physical).",
  "List questions for HR before accepting or signing anything.",
  "Note internal vacancies or redeployment routes if consultation applies.",
  "Identify which figures in this model you are least confident about.",
];

export const QUESTIONS_SECTION_INTRO =
  "This section organises questions for HR, regulated professionals and official sources. It is preparation support only — not legal, financial, employment or benefits advice.";

export const POSITION_SITUATION_FOCUS: Record<BriefSituationType, string[]> = {
  at_risk: [
    "Understand consultation process and selection criteria",
    "Organise evidence and role value documentation",
    "Clarify package components before decisions are final",
    "Explore suitable alternative roles and redeployment",
    "Model how different package outcomes could affect household costs",
  ],
  post_redundancy: [
    "Verify package breakdown against settlement letter",
    "Check missing payroll items and payment timing",
    "Confirm tax treatment with payroll or a qualified professional",
    "Align cash timing with essential monthly costs",
    "Prepare questions for regulated advice if needed",
  ],
  other: [
    "Clarify which package components are included in the model",
    "Verify assumptions that drive months-left figures",
    "Prepare questions before relying on the model in conversations",
  ],
};

export const PROFESSIONAL_QUESTION_BANK = {
  financialAdviser: [
    "What assumptions in this model should I verify before a regulated advice conversation?",
    "How should I think about the starting capital figure if part of the package may be taxed differently?",
    "Which documents would help confirm the redundancy package amount in this model?",
    "How might a gap period affect my wider financial plan under these assumptions?",
    "Should any of this lump sum be held separately for tax or essential costs — how would you frame that conversation?",
    "How do my essential costs and job-gap assumptions compare to what you would typically stress-test?",
  ],
  mortgageBroker: [
    "How should I think about my housing cost relative to gap-period income under these figures?",
    "Which documents would help confirm my current mortgage payment in this model?",
    "Are there mortgage-related questions I should clarify before my income changes?",
    "If my income drops during a job-search period, what information would you need to discuss options?",
    "How should I think about payment holidays or product switches — where is official guidance?",
  ],
  employerOrCareer: [
    "What assumptions in my job-gap timing should I verify with my own research?",
    "Where can I check official guidance on redundancy notice and pay?",
    "What internal vacancies or redeployment routes should I ask about, if applicable?",
    "Can you confirm how selection criteria are documented and applied?",
    "What evidence of role value should I prepare for consultation meetings?",
    "Is voluntary redundancy offered, and how does the package compare in writing?",
  ],
  benefitsSignposting: [
    "Where can I check official guidance on support during a job-search period?",
    "What assumptions should I verify before including a benefits estimate in this model?",
    "How might redundancy pay timing affect when I could apply for support — where is official guidance?",
    "How do savings and redundancy pay interact with eligibility rules — which official source applies?",
    "What documents will I need when contacting Jobcentre Plus or local authority support?",
  ],
  hrPackage: HR_PACKAGE_QUESTIONS,
};

export const SIGNPOSTING_LINKS = [
  { label: "ACAS — redundancy guidance", url: "https://www.acas.org.uk/redundancy" },
  { label: "GOV.UK — redundancy pay", url: "https://www.gov.uk/redundancy-your-rights" },
  { label: "Citizens Advice — redundancy", url: "https://www.citizensadvice.org.uk/work/leaving-a-job/redundancy/" },
];

export const SCENARIO_READING_GUIDE =
  "Read scenarios as comparisons under changed assumptions, not forecasts. Baseline uses your entered figures. Stress cases remove income or extend job-gap references to show how the picture changes when assumptions shift.";

export const ASSUMPTION_VERIFY_GUIDES: Record<string, string> = {
  redundancy_package:
    "The package figure affects starting capital directly. Confirm statutory, notice, holiday and any enhanced element against your settlement letter or HR breakdown.",
  replacement_timing:
    "Job-gap duration shapes when full income resumes in the model. This is an assumption you control — adjust it if your search timeline changes.",
  housing:
    "Housing is often the largest essential cost. Verify the monthly figure against your mortgage statement or tenancy agreement.",
  income:
    "Income during the gap period reduces monthly pressure. Confirm what you realistically expect from temp work, self-employment or partner income.",
  savings:
    "Cash and liquid investments feed starting capital. Confirm amounts you can access without penalty during the gap period.",
  essential_costs:
    "Essential costs drive net monthly burn. A partial list understates pressure — review all committed outgoings.",
};
