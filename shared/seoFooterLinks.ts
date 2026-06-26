import { GUIDE_CONTENT_YEAR } from "./site";
import { AI_REDUNDANCY_CLUSTER_SLUGS } from "./aiRedundancySeo";

export type FooterLink = { href: string; label: string };

/** Primary UK redundancy guides — footer and hub cross-links. */
export const FOOTER_GUIDE_LINKS: FooterLink[] = [
  { href: "/redundancy-pay-calculator-2026", label: `Statutory Redundancy Pay ${GUIDE_CONTENT_YEAR}` },
  { href: "/statutory-redundancy-pay-calculator", label: "Statutory redundancy pay calculator" },
  { href: "/redundancy-mortgage", label: "Redundancy & your mortgage" },
  { href: "/voluntary-redundancy-calculator", label: "Voluntary redundancy guide" },
  { href: "/how-long-will-my-redundancy-pay-last", label: "How long will redundancy pay last?" },
  { href: "/redundancy-package-calculator", label: "Redundancy package calculator" },
  { href: "/worried-about-redundancy", label: "Worried about redundancy?" },
  { href: "/redundancy-reset", label: "7-Day Redundancy Reset" },
];

export const FOOTER_CALCULATOR_LINKS: FooterLink[] = [
  { href: "/free-redundancy-calculator", label: "Free redundancy calculator" },
  { href: "/redundancy-pay-calculator-uk", label: "Redundancy pay calculator UK" },
  { href: "/redundancy-calculator-uk", label: "Redundancy calculator UK" },
  { href: "/redundancy-runway-calculator", label: "Redundancy runway calculator" },
  { href: "/ai-redundancy-calculator", label: "AI redundancy calculator" },
];

/** AI / automation cluster — first five in footer; full list in llms.txt. */
export const FOOTER_AI_LINKS: FooterLink[] = AI_REDUNDANCY_CLUSTER_SLUGS.slice(0, 5).map((slug) => ({
  href: `/${slug}`,
  label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export const FOOTER_PRODUCT_LINKS: FooterLink[] = [
  { href: "/brief-example", label: "Example brief" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];
