import { z } from "zod";
import { safeUrlSchema } from "./profile";

export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Certification name is required").max(100),
  issuer: z.string().trim().min(1, "Issuing organization is required").max(100),
  year: z.string().trim().max(20).optional().nullable(),
  url: safeUrlSchema.optional().nullable().or(z.literal("")),
  sortOrder: z.number().int().default(0),
});

export type CertificationInput = z.infer<typeof certificationSchema>;
