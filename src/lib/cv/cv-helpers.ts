import { PortfolioPayload, Skill } from "@/types/database";
import { CvSettings } from "@/types/database";

/**
 * Format dates into standard CV resume notation (e.g., "Jan 2022 – Present")
 */
export function formatCvDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  if (trimmed.toLowerCase() === "present" || trimmed.toLowerCase() === "current") {
    return "Present";
  }
  return trimmed;
}

/**
 * Splits multiline descriptions into structured bullet lines
 */
export function parseBulletPoints(description?: string | null): string[] {
  if (!description) return [];
  return description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.startsWith("•") || line.startsWith("-") || line.startsWith("*") ? line.substring(1).trim() : line));
}

/**
 * Groups skills by category for organized CV presentation
 */
export function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  const groups: Record<string, Skill[]> = {};
  for (const s of skills) {
    const cat = s.category?.trim() || "Technical Proficiencies";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  }
  return groups;
}

/**
 * Returns either #000000 or #FFFFFF depending on background luminance for WCAG contrast
 */
export function getPdfContrastTextColor(hexColor?: string): string {
  if (!hexColor) return "#FFFFFF";
  const hex = hexColor.replace("#", "");
  if (hex.length < 6) return "#FFFFFF";
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#0F172A" : "#FFFFFF";
}

/**
 * Ensures link URLs are fully qualified for clickable PDF links
 */
export function ensureSafePdfUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
