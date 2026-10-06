/**
 * Design & Accessibility Utilities
 * Handles WCAG contrast calculation, RTL language detection,
 * initials extraction, and dynamic monogram gradient generation.
 */

/**
 * Calculates WCAG 2.1 relative luminance and returns the optimal
 * high-contrast foreground color (#000000 or #FFFFFF).
 */
export function getContrastTextColor(hexColor?: string | null): "#000000" | "#FFFFFF" {
  if (!hexColor || typeof hexColor !== "string") return "#FFFFFF";

  let clean = hexColor.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length !== 6) return "#FFFFFF";

  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  // Linearize RGB components
  const sR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const sG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const sB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Relative luminance
  const luminance = 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;

  // If background is light (luminance > 0.45), use pure black text. Otherwise, use pure white.
  return luminance > 0.45 ? "#000000" : "#FFFFFF";
}

/**
 * Detects if a given string contains Right-to-Left script characters
 * (Arabic, Urdu, Hebrew, Persian, Syriac, Thaana).
 */
export function isRTL(text?: string | null): boolean {
  if (!text) return false;
  // RTL Unicode ranges
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
}

/**
 * Extracts 1 or 2 uppercase initials from a person or project name.
 */
export function getInitials(name?: string | null, fallback = "FN"): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a consistent, aesthetic CSS gradient based on a seed string.
 * Used for missing avatars and project cover fallbacks.
 */
export function getMonogramGradient(seed?: string | null): string {
  const gradients = [
    "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
    "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
    "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
    "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
    "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
  ];

  if (!seed) return gradients[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

/**
 * Font family resolver for portfolio CSS variables.
 */
export function getFontFamilyClass(font?: string | null): string {
  switch (font) {
    case "sora":
      return "font-sans font-heading";
    case "poppins":
      return "font-sans";
    case "roboto":
      return "font-sans";
    case "mono":
      return "font-mono";
    case "inter":
    default:
      return "font-sans";
  }
}
