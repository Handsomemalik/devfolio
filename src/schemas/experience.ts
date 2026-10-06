import { z } from "zod";

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().trim().min(1, "Company name is required").max(100, "Company name must be under 100 characters"),
  role: z.string().trim().min(1, "Role title is required").max(100, "Role must be under 100 characters"),
  location: z.string().trim().max(100).optional().nullable(),
  startDate: z.string().trim().min(1, "Start date is required").max(40),
  endDate: z.string().trim().max(40).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(2500, "Description must be under 2,500 characters").optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
