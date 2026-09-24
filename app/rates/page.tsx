import { ConverterApp } from "../_components/converter-app"
import { createPageMetadata } from "@/config/metadata"

export const metadata = createPageMetadata({
  title: "Exchange Rates",
  description:
    "Compare the latest available reference exchange rates across multiple currencies. Choose a base currency and see indicative rates in one list.",
  path: "/rates",
})

export default function RatesPage() {
  return <ConverterApp view="rates" />
}
