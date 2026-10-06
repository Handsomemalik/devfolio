import { describe, it, expect } from "vitest";
import { getSafeRedirectUrl } from "@/lib/security/safe-redirect";
import { validateImageMagicBytes } from "@/lib/security/magic-bytes";
import { rateLimit } from "@/lib/security/rate-limit";

describe("Security Hardening Tests", () => {
  describe("Open Redirect Protection", () => {
    it("should allow safe relative paths", () => {
      expect(getSafeRedirectUrl("/dashboard")).toBe("/dashboard");
      expect(getSafeRedirectUrl("/cv?template=modern")).toBe("/cv?template=modern");
      expect(getSafeRedirectUrl("/edit")).toBe("/edit");
    });

    it("should reject external protocol-relative redirects", () => {
      expect(getSafeRedirectUrl("//evil.com")).toBe("/dashboard");
      expect(getSafeRedirectUrl("//google.com/malicious")).toBe("/dashboard");
    });

    it("should reject absolute external URLs", () => {
      expect(getSafeRedirectUrl("https://evil.com")).toBe("/dashboard");
      expect(getSafeRedirectUrl("http://phishing.site")).toBe("/dashboard");
    });

    it("should reject backslash traversal attempts", () => {
      expect(getSafeRedirectUrl("/\\evil.com")).toBe("/dashboard");
      expect(getSafeRedirectUrl("/dashboard\\evil")).toBe("/dashboard");
    });

    it("should reject javascript: or data: URIs", () => {
      expect(getSafeRedirectUrl("javascript:alert(1)")).toBe("/dashboard");
      expect(getSafeRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe("/dashboard");
    });
  });

  describe("Magic Bytes Verification", () => {
    it("should accept valid PNG magic bytes", async () => {
      const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
      const blob = new Blob([pngHeader], { type: "image/png" });
      const file = new File([blob], "test.png", { type: "image/png" });

      const isValid = await validateImageMagicBytes(file);
      expect(isValid).toBe(true);
    });

    it("should accept valid JPEG magic bytes", async () => {
      const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
      const blob = new Blob([jpegHeader], { type: "image/jpeg" });
      const file = new File([blob], "test.jpg", { type: "image/jpeg" });

      const isValid = await validateImageMagicBytes(file);
      expect(isValid).toBe(true);
    });

    it("should reject disguised text/executable files claiming to be image", async () => {
      const textHeader = new TextEncoder().encode("<script>alert('xss')</script>");
      const blob = new Blob([textHeader], { type: "image/png" });
      const file = new File([blob], "fake.png", { type: "image/png" });

      const isValid = await validateImageMagicBytes(file);
      expect(isValid).toBe(false);
    });
  });

  describe("In-Memory Sliding Window Rate Limiting", () => {
    it("should permit requests within rate limit threshold", () => {
      const testKey = `test-ip-${Date.now()}`;
      const firstAttempt = rateLimit(testKey, { limit: 5, windowMs: 10000 });
      expect(firstAttempt.success).toBe(true);
      expect(firstAttempt.remaining).toBe(4);
    });

    it("should block requests exceeding rate limit threshold", () => {
      const testKey = `test-blocked-${Date.now()}`;
      for (let i = 0; i < 3; i++) {
        rateLimit(testKey, { limit: 3, windowMs: 10000 });
      }
      const fourthAttempt = rateLimit(testKey, { limit: 3, windowMs: 10000 });
      expect(fourthAttempt.success).toBe(false);
      expect(fourthAttempt.remaining).toBe(0);
    });
  });
});
