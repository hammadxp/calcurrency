import type { Metadata } from "next"

const title = "calcurrency · clear conversion"
const description =
  "Convert currencies with clear reference rates and a simple calculator."

export const siteMetadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "calcurrency",
    type: "website",
  },
}
