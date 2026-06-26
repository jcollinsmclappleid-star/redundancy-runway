import type { BriefSituationType } from "./briefCopy";
import type { ContextInputs } from "./schema";

export const PROTECTION_MEASURES_DISCLAIMER =
  "Protection measures are preparation actions only. They do not promise job security, selection outcomes, legal rights, redeployment success or improved package offers.";

export const PROTECTION_MEASURES_INTRO =
  "Protection measures are practical steps that may strengthen your preparation before redundancy decisions are final — or help you organise facts if AI, automation or restructuring is affecting your role. They are not tactics to avoid redundancy and do not constitute legal, employment or career advice.";

export interface ProtectionMeasureItem {
  label: string;
  detail: string;
  documents?: string;
}

export interface ProtectionMeasurePillar {
  pillarKey: string;
  title: string;
  summary: string;
  whyItMatters: string;
  measures: ProtectionMeasureItem[];
  /** When true, emphasise for AI/automation employment context */
  aiRelevant?: boolean;
  /** Situation types where this pillar is shown (empty = all) */
  situations?: BriefSituationType[];
}

export const PROTECTION_MEASURES_PILLARS: ProtectionMeasurePillar[] = [
  {
    pillarKey: "role_value",
    title: "Role value and visibility",
    summary: "Make the contribution of your role legible before headcount decisions are abstracted.",
    whyItMatters:
      "When organisations restructure — including for AI or automation — decision-makers may see roles as cost lines rather than bundles of judgement, relationships and accountability. Documenting value does not guarantee protection, but it can support clearer consultation conversations.",
    measures: [
      {
        label: "Write a one-page role value summary",
        detail:
          "List outcomes delivered in the last 12 months: revenue protected, risk reduced, clients retained, compliance maintained, or specialist knowledge held. Keep it factual — not promotional.",
        documents: "Appraisal summaries, project close-outs, client thank-you emails (anonymised)",
      },
      {
        label: "Map judgement-led work vs repeatable tasks",
        detail:
          "Separate tasks that require discretion, stakeholder trust or sign-off from tasks that are rules-based or document-heavy. This helps you discuss role redesign honestly if AI tools are introduced.",
      },
      {
        label: "Clarify business-critical dependencies",
        detail:
          "Note where work would stall if your role were vacant: approvals, client relationships, regulatory sign-off, or undocumented process knowledge.",
      },
      {
        label: "Share achievements in writing with your manager",
        detail:
          "A short email summarising recent deliverables creates a contemporaneous record — useful for consultation preparation, not as a negotiation tactic.",
      },
      {
        label: "Identify sponsors or stakeholders who can describe your impact",
        detail:
          "Colleagues or clients who can speak to outcomes may help you prepare evidence themes. This does not promise advocacy in a selection process.",
      },
    ],
    situations: ["at_risk", "other"],
    aiRelevant: true,
  },
  {
    pillarKey: "consultation_record",
    title: "Consultation and process documentation",
    summary: "Keep a clear written trail of what was said, when, and what remains unclear.",
    whyItMatters:
      "UK redundancy processes typically involve consultation stages where facts, selection approach and alternatives should be explained. A personal record helps you prepare follow-up questions — it is not a substitute for trade union, HR or legal support.",
    measures: [
      {
        label: "Start a consultation log",
        detail:
          "Date, attendees, topics discussed, answers received and outstanding questions. Note whether information was verbal or written.",
        documents: "Consultation letters, meeting invites, slide decks, FAQ documents",
      },
      {
        label: "Request written confirmation of key figures",
        detail:
          "Package breakdown, selection pool definition, criteria weighting and payment dates are easier to model when confirmed in writing.",
      },
      {
        label: "Ask for selection criteria and scoring method in writing",
        detail:
          "If selection applies, clarify how criteria are weighted and what evidence will be used. Prepare questions — do not assume the process is complete.",
      },
      {
        label: "Follow up verbally agreed points by email",
        detail:
          "A neutral recap email ('Further to our conversation, I understand that…') helps organise facts for your own preparation.",
      },
      {
        label: "Note timelines and decision gates",
        detail:
          "Consultation end dates, appeal windows and effective dates affect both employment planning and when cash may arrive.",
      },
    ],
    situations: ["at_risk"],
  },
  {
    pillarKey: "selection_evidence",
    title: "Selection criteria and evidence",
    summary: "Organise evidence themes that may be relevant if selection criteria apply.",
    whyItMatters:
      "Employers may use criteria such as skills, performance, attendance or business need. This section helps you prepare evidence and clarification questions — it does not score your employer's process or assess fairness.",
    measures: [
      {
        label: "Build a criteria-to-evidence table",
        detail:
          "For each criterion mentioned, list supporting documents, gaps and questions. Example columns: criterion, your evidence, question for HR.",
        documents: "Appraisals, objectives, training records, attendance records",
      },
      {
        label: "Gather performance evidence for the relevant period",
        detail:
          "Check which appraisal cycle or date range selection will use. Older achievements may still be relevant if they show specialist knowledge.",
      },
      {
        label: "Document skills and certifications",
        detail:
          "Professional memberships, technical certifications and system expertise may support redeployment conversations as well as selection preparation.",
      },
      {
        label: "Clarify unique vs overlapping responsibilities",
        detail:
          "If pools include similar roles, prepare a short note on what is unique in your remit — as a factual record, not an argument script.",
      },
      {
        label: "Prepare neutral questions about weighting",
        detail:
          "Example: 'How is [criterion] weighted relative to [other criterion] in this pool?' — preparation only.",
      },
    ],
    situations: ["at_risk"],
  },
  {
    pillarKey: "alternative_roles",
    title: "Alternative employment and redeployment",
    summary: "Track internal options and prepare role-fit questions before decisions are final.",
    whyItMatters:
      "Suitable alternative employment may be discussed during consultation. Organising vacancies, role content and trial-period questions early can reduce rushed decisions — without assuming a role will be offered or that suitability can be decided here.",
    measures: [
      {
        label: "Search internal vacancies weekly",
        detail:
          "Job boards, talent systems and manager referrals. Save adverts with dates in case roles close during consultation.",
      },
      {
        label: "Prepare a short redeployment profile",
        detail:
          "Skills, sectors, locations, hybrid preferences and salary flexibility — for your own clarity when discussing options with HR.",
      },
      {
        label: "List questions for each alternative role",
        detail:
          "Job content, location, pay, trial period, training and how suitability will be assessed. Use the Alternative Role Finder in your report to organise these.",
      },
      {
        label: "Note retraining or reskilling interest",
        detail:
          "If employer-funded retraining is mentioned, capture what is offered, duration and whether it affects redundancy timing.",
      },
      {
        label: "Compare package impact of redeployment vs redundancy",
        detail:
          "If pay or benefits differ, model how that changes monthly pressure using the payout scenario tools — illustrative only.",
      },
    ],
    situations: ["at_risk"],
  },
  {
    pillarKey: "ai_automation",
    title: "AI and automation exposure",
    summary: "Document how AI or automation is changing your role — without predicting job loss.",
    whyItMatters:
      "When employers cite efficiency, digitisation or AI, the practical change is often task redesign before whole-role removal. Organising exposure themes helps you prepare consultation questions and financial scenarios if income changes.",
    aiRelevant: true,
    measures: [
      {
        label: "List tasks already assisted by AI tools",
        detail:
          "Drafting, coding assistance, scheduling, customer triage, reporting or data extraction. Note what you still review, approve or own.",
      },
      {
        label: "Document tasks requiring human judgement",
        detail:
          "Escalations, regulated advice boundaries, client relationships, ethical calls, quality sign-off and accountability that cannot be delegated to software.",
      },
      {
        label: "Clarify employer messaging on AI pilots vs firm decisions",
        detail:
          "Ask whether changes are experimental, team-level or organisation-wide — and on what timeline headcount or role design may be reviewed.",
      },
      {
        label: "Prepare questions if AI is cited in restructuring rationale",
        detail:
          "What is changing, which roles are in scope, whether redeployment is considered, and how selection interacts with automation plans.",
      },
      {
        label: "Model runway if income changes earlier than expected",
        detail:
          "Use the 'if redundancy happened this month' scenario and slow income-recovery paths — stress tests only, not predictions.",
      },
      {
        label: "Capture training or upskilling offers in writing",
        detail:
          "If reskilling is proposed, note duration, cost, certification and whether role security is discussed — without treating this as a promise.",
      },
    ],
    situations: ["at_risk", "other"],
  },
  {
    pillarKey: "financial_readiness",
    title: "Financial and runway protection",
    summary: "Turn package and household assumptions into months you can plan around.",
    whyItMatters:
      "Financial pressure can force fast decisions. Modelling starting capital, monthly burn and income-recovery timing under your own figures may help you prepare questions about payment dates, notice and essential costs.",
    measures: [
      {
        label: "Verify package components before modelling",
        detail:
          "Statutory redundancy, enhanced terms, notice pay, holiday pay, bonus and deductions should be confirmed against HR or payroll — not a single headline figure.",
        documents: "Settlement letter, payslips, HR breakdown",
      },
      {
        label: "Separate essential and flexible costs",
        detail:
          "Identify which expenses could pause in a gap period versus fixed commitments (housing, debt, childcare).",
      },
      {
        label: "Model slow and severe income scenarios",
        detail:
          "Compare baseline runway with longer job gaps and essential-only spending. These are sensitivity tests in your report, not forecasts.",
      },
      {
        label: "Align payment timing with cash needs",
        detail:
          "If payment is delayed or instalmented, note how that interacts with mortgage, rent or debt due dates.",
      },
      {
        label: "Identify figures you are least confident about",
        detail:
          "Flag weak assumptions in the report's verification section and gather documents to confirm them before relying on the model in conversations.",
      },
    ],
  },
  {
    pillarKey: "communications",
    title: "Communications and boundaries",
    summary: "Keep conversations professional, documented and within your preparation comfort zone.",
    whyItMatters:
      "High-stress periods increase the risk of verbal commitments being misremembered. Neutral written follow-ups and prepared question lists support clarity — not confrontation.",
    measures: [
      {
        label: "Use prepared question banks — do not improvise under pressure",
        detail:
          "Consultation Defence Pack and HR question lists in this report are starting points. Edit to your situation before meetings.",
      },
      {
        label: "Avoid committing to figures or timelines verbally",
        detail:
          "Ask for written package breakdown and time to review before accepting or signing.",
      },
      {
        label: "Keep copies of everything you send and receive",
        detail:
          "Dedicated email folder or cloud directory for consultation and package correspondence.",
      },
      {
        label: "Know when to seek regulated or professional support",
        detail:
          "Employment advisers, solicitors, financial advisers, mortgage brokers and benefits specialists each cover different questions — this report signposts themes only.",
      },
    ],
  },
  {
    pillarKey: "package_integrity",
    title: "Package integrity after redundancy",
    summary: "Protect the accuracy of figures if redundancy has already been confirmed.",
    whyItMatters:
      "After redundancy, the priority shifts from consultation to verifying that payroll, tax treatment and payment timing match what was agreed.",
    situations: ["post_redundancy"],
    measures: [
      {
        label: "Reconcile settlement letter against final payslip",
        detail:
          "Check each line: redundancy, notice, holiday, bonus, deductions and net pay.",
        documents: "Settlement letter, final payslip, P45",
      },
      {
        label: "Chase missing payroll items promptly",
        detail:
          "Unpaid wages, commission, expenses or holiday accruals may still be owed — prepare factual written queries to payroll.",
      },
      {
        label: "Confirm tax treatment with payroll or HMRC guidance",
        detail:
          "Statutory redundancy, notice and holiday may be treated differently. This report does not provide tax advice.",
      },
      {
        label: "Update your runway model when cash arrives",
        detail:
          "Replace assumptions with actual amounts received and revise months-left figures in the calculator.",
      },
    ],
  },
];

export function getProtectionMeasuresForReport(
  situationType: BriefSituationType,
  employmentStatus: ContextInputs["employmentStatus"],
): ProtectionMeasurePillar[] {
  const showAi =
    employmentStatus === "ai_automation_concern" || employmentStatus === "restructuring";

  return PROTECTION_MEASURES_PILLARS.filter((pillar) => {
    if (pillar.situations?.length && !pillar.situations.includes(situationType)) {
      return false;
    }
    if (pillar.pillarKey === "ai_automation") {
      return showAi || situationType === "at_risk";
    }
    return true;
  });
}

/** Readiness actions shown on calculator SEO pages and report intro cards */
export const READINESS_SCORE_FACTORS = [
  "Package assumptions confirmed in writing",
  "Essential monthly costs fully entered",
  "Savings and liquid amounts verified",
  "Income recovery timing modelled",
  "Consultation documents gathered (if at risk)",
  "Protection measures checklist started",
] as const;
