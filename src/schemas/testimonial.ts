import { z } from "zod";

export const testimonialSchema = z.object({
  id: z.string().optional(),
  author: z.string().trim().min(1, "Author name is required").max(80),
  role: z.string().trim().max(100).optional().nullable(),
  quote: z.string().trim().min(1, "Quote is required").max(1000),
  sortOrder: z.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
