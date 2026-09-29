import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

function reportMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    )
  }
}

export const loggerProvider = (() => {
  if (!projectToken) {
    reportMissingConfiguration("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN")
    return null
  }

  if (!posthogHost) {
    reportMissingConfiguration("NEXT_PUBLIC_POSTHOG_HOST")
    return null
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "calcurrency" }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL("/i/v1/logs", posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  })
})()

export const posthogLogLogger = loggerProvider?.getLogger(
  "calcurrency-posthog-export",
)

export function register() {
  // Route handlers import posthogLogLogger directly, keeping existing loggers local.
}
