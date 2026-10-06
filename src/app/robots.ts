import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://folionova.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/u/*", "/demo/*", "/privacy", "/terms"],
        disallow: [
          "/dashboard/*",
          "/edit/*",
          "/onboarding/*",
          "/settings/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
