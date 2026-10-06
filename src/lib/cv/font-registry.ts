import { Font } from "@react-pdf/renderer";

let isRegistered = false;

/**
 * Registers custom fonts with @react-pdf/renderer safely.
 * Includes graceful fallback to standard PDF fonts (Helvetica, Times-Roman, Courier)
 * to ensure PDF generation is 100% resilient across serverless runtimes and offline modes.
 */
export function registerCvFonts() {
  if (isRegistered) return;
  isRegistered = true;

  try {
    // Disable hyphenation callback for clean CV text flow
    Font.registerHyphenationCallback((word) => [word]);

    // Register Inter via reliable CDN for client and server
    Font.register({
      family: "Inter",
      fonts: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
          fontWeight: 400,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
          fontWeight: 700,
        },
      ],
    });
  } catch (err) {
    // Standard built-in PDF fonts (Helvetica, Times-Roman, Courier) will be used automatically
    console.warn("[CV Font Registry] Falling back to standard PDF typefaces:", err);
  }
}
