import type { MetadataRoute } from "next"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", PROJECT_DETAILS.url).toString() },
    { url: new URL("/rates", PROJECT_DETAILS.url).toString() },
  ]
}
