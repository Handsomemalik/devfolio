import { z } from "zod";

export const cvSectionsToggleSchema = z.object({
  summary: z.boolean().default(true),
  skills: z.boolean().default(true),
  experience: z.boolean().default(true),
  projects: z.boolean().default(true),
  education: z.boolean().default(true),
  certifications: z.boolean().default(true),
  languages: z.boolean().default(true),
});

export const cvSettingsSchema = z.object({
  template_id: z
    .enum(["executive", "modern", "creative", "minimal", "technical", "elegant"])
    .default("executive"),
  accent_color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color format")
    .default("#6366F1"),
  include_photo: z.boolean().default(false),
  paper_size: z.enum(["A4", "LETTER"]).default("A4"),
  font_pairing: z.enum(["classic", "modern", "editorial"]).default("classic"),
  sections: cvSectionsToggleSchema.default({
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
    languages: true,
  }),
  section_order: z.array(z.string()).default([
    "summary",
    "experience",
    "skills",
    "projects",
    "education",
    "certifications",
    "languages",
  ]),
});

export type CvSettingsInput = z.infer<typeof cvSettingsSchema>;

export const DEFAULT_CV_SETTINGS: CvSettingsInput = {
  template_id: "executive",
  accent_color: "#6366F1",
  include_photo: false,
  paper_size: "A4",
  font_pairing: "classic",
  sections: {
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
    languages: true,
  },
  section_order: [
    "summary",
    "experience",
    "skills",
    "projects",
    "education",
    "certifications",
    "languages",
  ],
};
