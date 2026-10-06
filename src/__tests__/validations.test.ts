import { describe, it, expect } from "vitest";
import { cvSettingsSchema } from "@/lib/validations/cv-settings";
import { loginSchema, signupSchema } from "@/schemas/auth";
import { usernameSchema } from "@/schemas/profile";

describe("Validation Schemas", () => {
  describe("CV Settings Schema", () => {
    it("should accept valid CV configuration", () => {
      const valid = {
        template_id: "technical",
        paper_size: "A4",
        accent_color: "#10B981",
        include_photo: false,
        font_pairing: "modern",
        sections: {
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          languages: true,
        },
      };

      const result = cvSettingsSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid hex color format", () => {
      const invalid = {
        template_id: "executive",
        accent_color: "not-a-color",
      };

      const result = cvSettingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject unknown template IDs", () => {
      const invalid = {
        template_id: "space-alien-template",
      };

      const result = cvSettingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("Authentication & Username Rules", () => {
    it("should validate proper email format for login", () => {
      expect(loginSchema.safeParse({ email: "valid@example.com", password: "SecurePassword123" }).success).toBe(true);
      expect(loginSchema.safeParse({ email: "invalid-email", password: "SecurePassword123" }).success).toBe(false);
    });

    it("should reject empty password on login", () => {
      const result = loginSchema.safeParse({ email: "valid@example.com", password: "" });
      expect(result.success).toBe(false);
    });

    it("should enforce strong passwords on signup", () => {
      const validSignup = {
        fullName: "Alex Vance",
        email: "alex@example.com",
        password: "StrongPassWord123!",
        confirmPassword: "StrongPassWord123!",
      };
      expect(signupSchema.safeParse(validSignup).success).toBe(true);

      const weakSignup = {
        fullName: "Alex Vance",
        email: "alex@example.com",
        password: "123",
        confirmPassword: "123",
      };
      expect(signupSchema.safeParse(weakSignup).success).toBe(false);
    });

    it("should validate username constraints", () => {
      expect(usernameSchema.safeParse("alex-vance").success).toBe(true);
      expect(usernameSchema.safeParse("dev123").success).toBe(true);
      
      // Spaces not allowed
      expect(usernameSchema.safeParse("alex vance").success).toBe(false);
      // Trailing hyphen not allowed
      expect(usernameSchema.safeParse("alex-").success).toBe(false);
      // Reserved usernames rejected
      expect(usernameSchema.safeParse("admin").success).toBe(false);
      expect(usernameSchema.safeParse("api").success).toBe(false);
      expect(usernameSchema.safeParse("cv").success).toBe(false);
    });
  });
});
