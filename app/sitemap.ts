import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One public page today. Add new routes here as they're built.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
