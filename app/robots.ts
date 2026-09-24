import type { MetadataRoute } from "next"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", PROJECT_DETAILS.url).toString(),
  }
}
