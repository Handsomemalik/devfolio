import { z } from "zod";

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().trim().min(1, "Institution name is required").max(120),
  degree: z.string().trim().max(100).optional().nullable(),
  field: z.string().trim().max(100).optional().nullable(),
  startYear: z.string().trim().max(20).optional().nullable(),
  endYear: z.string().trim().max(20).optional().nullable(),
  grade: z.string().trim().max(40).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;
