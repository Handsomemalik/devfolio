/**
 * Portfolio Designs Registry
 * 5 Distinct, Cinematic Design Archetypes
 */

export type PortfolioDesignId = "aurora" | "noir" | "kinetic" | "bento" | "editorial";
export type PortfolioDesignKey = PortfolioDesignId;

export interface PortfolioDesignMeta {
  id: PortfolioDesignId;
  name: string;
  tagline: string;
  description: string;
  vibe: string;
  accentRecommended: string;
  defaultTheme: "dark" | "light";
  features: string[];
}

export const PORTFOLIO_DESIGNS: Record<PortfolioDesignId, PortfolioDesignMeta> = {
  aurora: {
    id: "aurora",
    name: "Aurora Glass",
    tagline: "Ethereal luminous gradients and frosted surfaces",
    description: "Multi-layered ambient gradients with soft glassmorphic panels and fluid light waves that react to cursor movement.",
    vibe: "Cinematic, modern, expressive",
    accentRecommended: "#6366F1",
    defaultTheme: "dark",
    features: ["Dynamic Aurora Meshes", "Glass Cards", "Floating Stat Badges", "Subtle Spotlight"],
  },
  noir: {
    id: "noir",
    name: "Obsidian Noir",
    tagline: "High-contrast monochrome luxury and precise typography",
    description: "Pitch black aesthetics with ultra-sharp white type, razor-thin borders, and high-impact gold or electric cyan highlights.",
    vibe: "Brutalist luxury, executive, minimalist",
    accentRecommended: "#F8FAFC",
    defaultTheme: "dark",
    features: ["Monochrome Architecture", "Wireframe Grids", "Sharp Contrast", "Typographic Scale"],
  },
  kinetic: {
    id: "kinetic",
    name: "Kinetic Flow",
    tagline: "Interactive velocity, physics, and scroll-driven storytelling",
    description: "High-energy layout with smooth GSAP velocity curves, magnetic triggers, parallax showcases, and dynamic cards.",
    vibe: "Technical, developer-first, high-velocity",
    accentRecommended: "#22D3EE",
    defaultTheme: "dark",
    features: ["Scroll-Triggered Reveals", "Velocity Parallax", "Terminal Preview", "Interactive Sliders"],
  },
  bento: {
    id: "bento",
    name: "Bento Matrix",
    tagline: "Structured modular masonry with micro-interactive tiles",
    description: "Apple-inspired asymmetric bento grid architecture showcasing skills, projects, and achievements in interconnected widgets.",
    vibe: "Product-minded, organized, visually dense",
    accentRecommended: "#8B5CF6",
    defaultTheme: "dark",
    features: ["Modular Bento Grid", "Interactive Widget Chips", "Live Metrics", "Expandable Cards"],
  },
  editorial: {
    id: "editorial",
    name: "Editorial Atelier",
    tagline: "High-fashion typographic elegance and magazine pacing",
    description: "Sophisticated editorial layout inspired by luxury print magazines with generous whitespace and serif-influenced title treatments.",
    vibe: "Curated, artistic, literary",
    accentRecommended: "#D97706",
    defaultTheme: "dark",
    features: ["Magazine Column Spacing", "Artistic Captions", "Split-Screen Narratives", "Classic Rhythm"],
  },
};

export const DEFAULT_DESIGN_ID: PortfolioDesignId = "aurora";

export const PORTFOLIO_DESIGN_LIST = Object.values(PORTFOLIO_DESIGNS);
