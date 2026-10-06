import { z } from "zod";

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Skill name is required").max(60, "Skill name must be under 60 characters"),
  level: z.number().int().min(1).max(5).optional().nullable(),
  category: z.string().trim().max(50).optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;
