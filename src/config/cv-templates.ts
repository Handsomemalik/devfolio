/**
 * CV / Resume Templates Registry
 * 6 Professionally Engineered PDF Templates
 */

export type CVTemplateId = "executive" | "modern" | "creative" | "minimal" | "technical" | "elegant";

export interface CVTemplateMeta {
  id: CVTemplateId;
  name: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  recommendedPages: "1 page" | "1-2 pages" | "Multi-page";
  columns: 1 | 2;
  hasPhoto: boolean;
}

export const CV_TEMPLATES: Record<CVTemplateId, CVTemplateMeta> = {
  executive: {
    id: "executive",
    name: "Executive Leader",
    subtitle: "Formal, authoritative single-column layout for senior roles",
    description: "Refined typographic hierarchy with subtle divider lines and clear achievement highlights for leadership positions.",
    targetAudience: "Directors, Senior Managers, Staff Engineers, Executives",
    recommendedPages: "1-2 pages",
    columns: 1,
    hasPhoto: false,
  },
  modern: {
    id: "modern",
    name: "Modern Studio",
    subtitle: "Balanced two-column grid with styled sidebar and skill ratings",
    description: "Contemporary visual layout separating contact and technical proficiencies into a structured sidebar while experience takes center stage.",
    targetAudience: "Product Designers, Fullstack Engineers, Product Managers",
    recommendedPages: "1 page",
    columns: 2,
    hasPhoto: true,
  },
  creative: {
    id: "creative",
    name: "Creative Vanguard",
    subtitle: "Bold accent blocks, expressive typography and project spotlights",
    description: "Dynamic visual treatment built to catch recruiters' eyes in high-creativity sectors like UI/UX, marketing, and media.",
    targetAudience: "Brand Designers, UI/UX Designers, Art Directors, Marketers",
    recommendedPages: "1-2 pages",
    columns: 2,
    hasPhoto: true,
  },
  minimal: {
    id: "minimal",
    name: "Swiss Minimal",
    subtitle: "Clean whitespace, tight monochrome typography, timeless aesthetic",
    description: "Pure functional minimalism without distracting frills. Emphasizes clarity of thought, crisp dates, and concise accomplishments.",
    targetAudience: "Researchers, Academics, Writers, Minimalist Engineers",
    recommendedPages: "1 page",
    columns: 1,
    hasPhoto: false,
  },
  technical: {
    id: "technical",
    name: "Technical Core",
    subtitle: "Dense, ATS-optimized layout with detailed skills, tools and repos",
    description: "Designed specifically to beat Applicant Tracking Systems while giving engineering leads rapid scanning of stacks and quantified metrics.",
    targetAudience: "Software Engineers, DevOps, Systems Architects, Data Scientists",
    recommendedPages: "1-2 pages",
    columns: 1,
    hasPhoto: false,
  },
  elegant: {
    id: "elegant",
    name: "Editorial Elegance",
    subtitle: "Classic serif typography, gold accents and refined balance",
    description: "Timeless sophistication with editorial spacing, ideal for consulting, legal, finance, and boutique agency professionals.",
    targetAudience: "Consultants, Strategists, Analysts, Healthcare Professionals",
    recommendedPages: "1-2 pages",
    columns: 2,
    hasPhoto: false,
  },
};

export const DEFAULT_CV_TEMPLATE_ID: CVTemplateId = "executive";

export const CV_TEMPLATE_LIST = Object.values(CV_TEMPLATES);
