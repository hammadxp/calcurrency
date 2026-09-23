import { getCurrencyRates } from "@/queries/currency-rates"

export async function GET() {
  try {
    return Response.json({ ...(await getCurrencyRates()), live: true })
  } catch {
    return Response.json(
      { error: "Rates are temporarily unavailable" },
      { status: 502 }
    )
  }
}
