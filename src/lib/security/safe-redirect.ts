/**
 * Open Redirect Protection Helper.
 * Validates that redirect paths are strictly local relative URLs
 * and blocks protocol-relative attacks (//evil.com) and backslash traversal.
 */
export function getSafeRedirectUrl(
  target: string | null | undefined,
  defaultUrl: string = "/dashboard"
): string {
  if (!target) return defaultUrl;

  const trimmed = target.trim();

  // Must start with a single slash, not double-slash (protocol-relative), and not contain backslash
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes("\\")
  ) {
    // Extra safety: block javascript: or data: URIs
    if (!trimmed.toLowerCase().includes("javascript:") && !trimmed.toLowerCase().includes("data:")) {
      return trimmed;
    }
  }

  return defaultUrl;
}
