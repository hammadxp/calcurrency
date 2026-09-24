import type { Metadata } from "next"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

const homeTitle = `${PROJECT_DETAILS.name} | Convert Multiple Currencies at Once`

export const SOCIAL_IMAGE_ALT =
  "calcurrency converts one amount into multiple currencies at once"

export const siteMetadata: Metadata = {
  metadataBase: new URL(PROJECT_DETAILS.url),
  applicationName: PROJECT_DETAILS.name,
  title: {
    default: homeTitle,
    template: `%s | ${PROJECT_DETAILS.name}`,
  },
  description: PROJECT_DETAILS.description,
  alternates: { canonical: "/" },
  authors: [{ name: PROJECT_DETAILS.author, url: PROJECT_DETAILS.authorUrl }],
  openGraph: {
    type: "website",
    url: "/",
    siteName: PROJECT_DETAILS.name,
    title: homeTitle,
    description: PROJECT_DETAILS.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: PROJECT_DETAILS.description,
  },
}

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  index?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${PROJECT_DETAILS.name}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: PROJECT_DETAILS.name,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [
        {
          url: new URL("/opengraph-image", PROJECT_DETAILS.url).toString(),
          width: 1200,
          height: 630,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        {
          url: new URL("/twitter-image", PROJECT_DETAILS.url).toString(),
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    robots: { index, follow: true },
  }
}
