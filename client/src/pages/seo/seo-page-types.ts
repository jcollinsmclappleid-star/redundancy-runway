export type PageVariant =
  | "core"
  | "package"
  | "tax"
  | "notice"
  | "holiday"
  | "question"
  | "runway"
  | "mortgage"
  | "household"
  | "reset"
  | "consultation"
  | "rights"
  | "benefits"
  | "age"
  | "eligibility"
  | "ai";

export interface SeoPageContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  primaryCta: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  badge: string;
  intro: string;
  intent: string;
  helps: string[];
  assumptions: string[];
  example: {
    title: string;
    body: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  officialLinks?: Array<{ href: string; label: string }>;
  variant: PageVariant;
}
