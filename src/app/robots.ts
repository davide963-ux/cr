import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/content";

export default function robots(): MetadataRoute.Robots {
  return {
    // In modalità dimostrativa il sito non viene indicizzato
    rules: siteConfig.demoMode ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
