/**
 * FolioNova Core Brand Configuration
 * Single source of truth for branding, typography, metadata and links.
 */

export const BRAND_NAME = "FolioNova" as const;
export const BRAND_TAGLINE = "Your career, as a living work of art." as const;
export const BRAND_DESCRIPTION = 
  "The cinematic portfolio platform and professional CV generator for modern creators, engineers, and visionaries.";
export const DEVELOPER_CREDIT = "Designed & developed by Abdul Manan" as const;

export const BRAND_CONFIG = {
  name: BRAND_NAME,
  tagline: BRAND_TAGLINE,
  description: BRAND_DESCRIPTION,
  version: "1.0.0",
  developerCredit: DEVELOPER_CREDIT,
  author: "Abdul Manan",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultAccent: "#6366F1",
  colors: {
    darkBg: "#07070B",
    darkSurface: "#0E0E17",
    lightBg: "#F7F7FB",
    lightSurface: "#FFFFFF",
    primary: "#6366F1",
    secondary: "#8B5CF6",
    glow: "#22D3EE",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
  },
  socialLinks: {
    github: "https://github.com",
    x: "https://x.com",
    linkedin: "https://linkedin.com",
  },
} as const;
