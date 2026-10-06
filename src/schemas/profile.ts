import { z } from "zod";
import { isUsernameReserved } from "@/config/reserved-usernames";
import { isValidHexColor, isValidSafeUrl } from "@/lib/security/sanitize";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
    "Username can only contain lowercase letters, numbers, and hyphens (cannot start or end with a hyphen)"
  )
  .refine((val) => !isUsernameReserved(val), "This username is reserved and cannot be claimed");

export const hexColorSchema = z
  .string()
  .trim()
  .refine((val) => isValidHexColor(val), "Must be a valid hex color code (e.g. #6366F1)");

export const safeUrlSchema = z
  .string()
  .trim()
  .refine((val) => !val || isValidSafeUrl(val), "Must be a valid URL starting with http:// or https://");

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(80, "Name must be under 80 characters"),
  username: usernameSchema.optional().nullable(),
  professionalTitle: z.string().trim().max(100, "Title must be under 100 characters").optional().nullable(),
  headline: z.string().trim().max(180, "Headline must be under 180 characters").optional().nullable(),
  shortBio: z.string().trim().max(300, "Short bio must be under 300 characters").optional().nullable(),
  aboutMe: z.string().trim().max(3000, "About me must be under 3,000 characters").optional().nullable(),
  avatarUrl: safeUrlSchema.optional().nullable(),
  location: z.string().trim().max(100, "Location must be under 100 characters").optional().nullable(),
  openToWork: z.boolean().default(false),
  yearsOfExperience: z.number().int().min(0).max(70).default(0),
  languages: z.array(z.string().trim().max(40)).default([]),
});

export const contactInfoSchema = z.object({
  emailPublic: z.string().trim().email("Please enter a valid email address").optional().nullable().or(z.literal("")),
  phonePublic: z.string().trim().max(30, "Phone number must be under 30 characters").optional().nullable(),
  website: safeUrlSchema.optional().nullable().or(z.literal("")),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
});

export const customizationSchema = z.object({
  designId: z.enum(["aurora", "noir", "kinetic", "bento", "editorial"]).default("aurora"),
  cvTemplateId: z.enum(["executive", "modern", "creative", "minimal", "technical", "elegant"]).default("executive"),
  themeMode: z.enum(["light", "dark", "system"]).default("dark"),
  accentColor: hexColorSchema.default("#6366F1"),
  fontStyle: z.enum(["inter", "sora", "poppins", "roboto", "mono"]).default("inter"),
});

export const seoSchema = z.object({
  seoTitle: z.string().trim().max(70, "SEO title should be under 70 characters").optional().nullable(),
  seoDescription: z.string().trim().max(160, "SEO description should be under 160 characters").optional().nullable(),
});

export const fullProfileSchema = personalInfoSchema
  .merge(contactInfoSchema)
  .merge(customizationSchema)
  .merge(seoSchema)
  .extend({
    isPublished: z.boolean().default(false),
  });

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type CustomizationInput = z.infer<typeof customizationSchema>;
export type SeoInput = z.infer<typeof seoSchema>;
export type FullProfileInput = z.infer<typeof fullProfileSchema>;
