export const CONSULTATION_SECTIONS = [
  {
    sectionKey: "why_at_risk",
    title: "Questions about why the role is at risk",
    questions: [
      "What business reasons are driving this redundancy proposal?",
      "How does my role fit into the proposed organisational changes?",
      "What alternatives to redundancy have been considered?",
    ],
  },
  {
    sectionKey: "selection_criteria",
    title: "Questions about selection criteria",
    questions: [
      "What selection criteria are being used?",
      "How will each criterion be scored or applied?",
      "Can you share the selection matrix or scoring approach?",
    ],
  },
  {
    sectionKey: "selection_pool",
    title: "Questions about selection pool",
    questions: [
      "How has my role or selection pool been defined?",
      "Who else is in the selection pool for my role or team?",
      "Why was this pool chosen rather than a wider or narrower group?",
    ],
  },
  {
    sectionKey: "alternatives",
    title: "Questions about alternatives to redundancy",
    questions: [
      "What alternatives to redundancy have been considered?",
      "Has reduced hours, redeployment or a hiring freeze been explored?",
      "Is voluntary redundancy being offered and how does it compare?",
    ],
  },
  {
    sectionKey: "suitable_roles",
    title: "Questions about suitable alternative roles",
    questions: [
      "Are there suitable alternative roles I should be considered for?",
      "Which internal vacancies are open now or expected soon?",
      "What is the process for being considered for alternative roles?",
    ],
  },
  {
    sectionKey: "package_calculation",
    title: "Questions about package calculation",
    questions: [
      "How has the redundancy package been calculated?",
      "Can you confirm how notice pay, holiday pay and any enhanced redundancy have been separated?",
      "Is the package figure gross or net, and when is payment expected?",
    ],
  },
] as const;

export const EVIDENCE_PACK_ITEMS = [
  "Recent appraisal or performance evidence",
  "Responsibilities and key deliverables",
  "Critical projects and outcomes",
  "Client or stakeholder feedback",
  "Skills and certifications",
  "Internal roles of interest",
  "Flexibility on location, hours or team if applicable",
  "Training or redeployment interest",
] as const;

export const ROLE_PROTECTION_SECTIONS = [
  {
    sectionKey: "visibility",
    title: "Visibility actions",
    actions: [
      "Update a concise list of current responsibilities",
      "Share recent achievements with your manager in writing",
      "Clarify business-critical work you are leading or supporting",
    ],
  },
  {
    sectionKey: "evidence",
    title: "Evidence actions",
    actions: [
      "Document recent achievements with measurable outcomes",
      "Gather performance evidence from appraisals or feedback",
      "Prepare a concise role value summary",
    ],
  },
  {
    sectionKey: "redeployment",
    title: "Redeployment actions",
    actions: [
      "Identify internal vacancies or adjacent teams",
      "List transferable skills relevant to other roles",
      "Prepare availability for alternative roles or locations",
    ],
  },
  {
    sectionKey: "skills",
    title: "Skills actions",
    actions: [
      "List certifications or training that support redeployment",
      "Identify skills gaps and retraining routes of interest",
      "Note systems or tools where you have specialist knowledge",
    ],
  },
  {
    sectionKey: "manager",
    title: "Manager conversation prompts",
    actions: [
      "Ask how your role contributes to current business priorities",
      "Clarify selection criteria if consultation has started",
      "Ask about training or redeployment routes before decisions are final",
    ],
  },
  {
    sectionKey: "mobility",
    title: "Internal mobility checklist",
    actions: [
      "Check internal job boards weekly",
      "Speak to HR about redeployment support",
      "Register interest in hybrid, remote or relocation options if relevant",
    ],
  },
] as const;

export const SELECTION_CRITERIA = [
  {
    criteriaKey: "skills",
    label: "Skills",
    evidence: "Gather examples of work, systems knowledge, client responsibilities, certifications and recent deliverables.",
    question: "How are skills being assessed and weighted in the selection process?",
  },
  {
    criteriaKey: "qualifications",
    label: "Qualifications",
    evidence: "Collect certificates, professional memberships and role-relevant training records.",
    question: "Which qualifications are required versus desirable for roles in the pool?",
  },
  {
    criteriaKey: "experience",
    label: "Experience",
    evidence: "Document tenure, project history, sector experience and scope of responsibility.",
    question: "How is relevant experience being defined for this selection pool?",
  },
  {
    criteriaKey: "performance",
    label: "Performance / appraisal",
    evidence: "Gather appraisal summaries, objectives met and recent feedback.",
    question: "What performance evidence is being used and from which period?",
  },
  {
    criteriaKey: "attendance",
    label: "Attendance (where relevant)",
    evidence: "Check attendance records and any documented reasons for absence.",
    question: "How is attendance being considered and is there a fair process for review?",
  },
  {
    criteriaKey: "disciplinary",
    label: "Disciplinary record (where relevant)",
    evidence: "Review any disciplinary records and related documentation.",
    question: "Is any disciplinary history being applied and how?",
  },
  {
    criteriaKey: "duplication",
    label: "Role duplication",
    evidence: "Clarify unique responsibilities versus overlapping roles in the pool.",
    question: "How was role duplication assessed when defining the pool?",
  },
  {
    criteriaKey: "business_need",
    label: "Business need",
    evidence: "Note business-critical work, revenue impact or specialist knowledge you hold.",
    question: "How does business need factor into who is selected?",
  },
  {
    criteriaKey: "flexibility",
    label: "Flexibility / redeployment suitability",
    evidence: "List willingness for location, hours, team or role changes.",
    question: "Is flexibility on redeployment being considered as a selection factor?",
  },
] as const;

export const ALTERNATIVE_ROLE_QUESTIONS = [
  "Are there suitable alternative roles I should be considered for?",
  "Which internal vacancies are open now or expected soon?",
  "What skills or experience are required for those roles?",
  "Is retraining or redeployment support available?",
  "What is the process for being considered?",
] as const;

export const ALTERNATIVE_ROLE_CHECKLIST = [
  "Search internal job boards and talent systems",
  "List departments or teams of interest",
  "Match your skills to open role descriptions",
  "Prepare a short redeployment CV or profile",
  "Note salary range flexibility if applicable",
  "Confirm hybrid or remote preferences with HR",
] as const;

export const PACKAGE_CLARIFICATION_EMAIL = {
  package: {
    subject: "Clarification on redundancy package figures",
    body: `Hi [Name],

Please could you confirm how the package figure has been broken down between statutory redundancy, any enhanced redundancy amount, notice pay or PILON, accrued holiday pay, unpaid wages, bonus or commission if relevant, deductions and expected payment dates?

I'm trying to make sure I understand the full package clearly before relying on the figure for personal planning.

Thanks,
[Name]`,
  },
  consultation: {
    subject: "Questions ahead of redundancy consultation",
    body: `Hi [Name],

Ahead of the consultation, please could you confirm:

1. What selection criteria are being used?
2. How the selection pool has been defined?
3. Whether any suitable alternative roles are available or expected?
4. Whether redeployment or retraining support is available?
5. How the redundancy package figure has been calculated and broken down?

I'm trying to prepare properly and understand the options and figures clearly.

Thanks,
[Name]`,
  },
} as const;
