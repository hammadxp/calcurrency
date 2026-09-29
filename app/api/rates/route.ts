import { SeverityNumber } from "@opentelemetry/api-logs"
import { after } from "next/server"
import { loggerProvider, posthogLogLogger } from "@/instrumentation"
import { getCurrencyRates } from "@/queries/currency-rates"

function flushPostHogLogs() {
  after(() => loggerProvider?.forceFlush())
}

export async function GET() {
  try {
    const rates = await getCurrencyRates()

    posthogLogLogger?.emit({
      body: "currency_rates_served",
      severityNumber: SeverityNumber.INFO,
      attributes: {
        endpoint: "/api/rates",
        outcome: "success",
      },
    })
    flushPostHogLogs()

    return Response.json({ ...rates, live: true })
  } catch {
    posthogLogLogger?.emit({
      body: "currency_rates_unavailable",
      severityNumber: SeverityNumber.ERROR,
      attributes: {
        endpoint: "/api/rates",
        outcome: "provider_unavailable",
        response_status: 502,
      },
    })
    flushPostHogLogs()

    return Response.json(
      { error: "Rates are temporarily unavailable" },
      { status: 502 }
    )
  }
}
