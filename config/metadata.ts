import type { Metadata } from "next"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

const title = `${PROJECT_DETAILS.name} · clear conversion`
const description = PROJECT_DETAILS.description

export const siteMetadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: PROJECT_DETAILS.name,
    type: "website",
  },
}
