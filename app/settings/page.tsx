import { ConverterApp } from "../_components/converter-app"
import { createPageMetadata } from "@/config/metadata"

export const metadata = createPageMetadata({
  title: "Settings",
  description:
    "Customize how calcurrency displays conversions and remembers your preferences in this browser.",
  path: "/settings",
  index: false,
})

export default function SettingsPage() {
  return <ConverterApp view="settings" />
}
