import { z } from "zod";
import { safeUrlSchema } from "./profile";

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.enum([
    "github",
    "linkedin",
    "x",
    "instagram",
    "behance",
    "dribbble",
    "youtube",
    "facebook",
    "website",
    "other",
  ]),
  url: safeUrlSchema,
  sortOrder: z.number().int().default(0),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
