/**
 * Input Sanitization and URL Security Utilities
 * Strips script tags, unsafe protocols, and malicious payloads.
 */

/**
 * Strips HTML tags and potential script content from text
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Validates if a URL is safe and uses HTTP/HTTPS protocol.
 * Rejects javascript:, data:, file:, and vbscript: URLs.
 */
export function isValidSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Explicitly block dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL, returning empty string if unsafe
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  return isValidSafeUrl(trimmed) ? trimmed : "";
}

/**
 * Validates a 3-character or 6-character hex color
 */
export function isValidHexColor(hex: string | null | undefined): boolean {
  if (!hex) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
}

/**
 * Fallback to default brand accent if invalid hex
 */
export function sanitizeHexColor(hex: string | null | undefined, fallback = "#6366F1"): string {
  if (!hex) return fallback;
  return isValidHexColor(hex) ? hex.trim() : fallback;
}
