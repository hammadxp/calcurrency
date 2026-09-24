import { ImageResponse } from "next/og"
import { SocialImage } from "./_components/social-image"
import { SOCIAL_IMAGE_ALT } from "@/config/metadata"

export const alt = SOCIAL_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(<SocialImage />, size)
}
