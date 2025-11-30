import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

const publicRoutes = ["/", "/dealers", "/about", "/contact", "/acceder"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteConfig.url}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
}
