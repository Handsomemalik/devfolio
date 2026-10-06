import { z } from "zod";
import { safeUrlSchema } from "./profile";

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Project title is required").max(100, "Title must be under 100 characters"),
  description: z.string().trim().max(1500, "Description must be under 1,500 characters").optional().nullable(),
  techStack: z.array(z.string().trim().max(50)).default([]),
  liveUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  repoUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  imageUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;
