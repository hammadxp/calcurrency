import { FALLBACK_RATES } from "@/lib/currency-data"

type ProviderRate = { quote: string; rate: number; date: string }
type ProviderCurrency = { iso_code: string; name: string; symbol: string }

function isProviderRate(value: unknown): value is ProviderRate {
  if (!value || typeof value !== "object") return false
  const row = value as Partial<ProviderRate>
  return (
    typeof row.quote === "string" &&
    /^[A-Z]{3}$/.test(row.quote) &&
    typeof row.rate === "number" &&
    Number.isFinite(row.rate) &&
    row.rate > 0 &&
    typeof row.date === "string"
  )
}

function isProviderCurrency(value: unknown): value is ProviderCurrency {
  if (!value || typeof value !== "object") return false
  const currency = value as Partial<ProviderCurrency>
  return (
    typeof currency.iso_code === "string" &&
    /^[A-Z]{3}$/.test(currency.iso_code) &&
    typeof currency.name === "string" &&
    typeof currency.symbol === "string"
  )
}

export async function GET() {
  try {
    const [ratesResponse, currenciesResponse] = await Promise.all([
      fetch("https://api.frankfurter.dev/v2/rates?base=USD", {
        next: { revalidate: 3600 },
      }),
      fetch("https://api.frankfurter.dev/v2/currencies", {
        next: { revalidate: 86400 },
      }),
    ])
    if (!ratesResponse.ok || !currenciesResponse.ok)
      throw new Error("Rate provider returned an error")

    const [rowsPayload, availablePayload]: unknown[] = await Promise.all([
      ratesResponse.json(),
      currenciesResponse.json(),
    ])
    if (!Array.isArray(rowsPayload) || !Array.isArray(availablePayload))
      throw new Error("Invalid provider response")
    const rows = rowsPayload.filter(isProviderRate)
    const available = availablePayload.filter(isProviderCurrency)
    if (rows.length === 0 || available.length === 0)
      throw new Error("No provider rates available")
    const rates: Record<string, number> = Object.fromEntries(
      rows.map((row) => [row.quote, row.rate])
    )
    rates.USD = 1
    const currencies = available
      .filter((currency) => rates[currency.iso_code] !== undefined)
      .map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
        symbol: currency.symbol || currency.iso_code,
      }))
    if (!currencies.length) throw new Error("No currencies available")

    return Response.json({
      rates,
      currencies,
      refreshedAt: new Date().toISOString(),
      rateDate: rows[0]?.date,
      live: true,
    })
  } catch {
    return Response.json({
      rates: FALLBACK_RATES,
      refreshedAt: null,
      live: false,
    })
  }
}
