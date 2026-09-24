import { ConverterApp } from "./_components/converter-app"
import { PROJECT_DETAILS } from "@/data/PROJECT_DETAILS"

const applicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: PROJECT_DETAILS.name,
  url: PROJECT_DETAILS.url,
  description: PROJECT_DETAILS.description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(applicationSchema).replace(/</g, "\\u003c"),
        }}
      />
      <ConverterApp view="convert" />
    </>
  )
}
