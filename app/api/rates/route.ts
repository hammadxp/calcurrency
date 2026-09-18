import { FALLBACK_RATES } from "@/data/currency"
import { getCurrencyRates } from "@/queries/currency-rates"

export async function GET() {
  try {
    return Response.json({ ...(await getCurrencyRates()), live: true })
  } catch {
    return Response.json({
      rates: FALLBACK_RATES,
      refreshedAt: null,
      live: false,
    })
  }
}
