import type { RateData, Settings } from "@/types/currency"

export function formatAmount(
  value: number,
  code: string,
  settings: Settings,
  maximumFractionDigits?: number
) {
  if (!Number.isFinite(value)) return "—"
  const decimals = settings.decimals
    ? (maximumFractionDigits ?? (["JPY", "KRW"].includes(code) ? 0 : 2))
    : 0
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits:
      decimals > 0 && maximumFractionDigits === undefined && !settings.compact
        ? 2
        : 0,
    notation: settings.compact ? "compact" : "standard",
  }).format(value)
}

export function formatRate(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "—"
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 0.01 ? 8 : 4,
  }).format(value)
}

export function formatRefreshTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "recently"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function formatRateDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return "unknown date"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export function normalizeAmount(value: string) {
  const digits = value.replace(/[^\d.]/g, "")
  const dot = digits.indexOf(".")
  return dot === -1
    ? digits
    : digits.slice(0, dot + 1) + digits.slice(dot + 1).replaceAll(".", "")
}

export function isRateData(value: unknown): value is RateData {
  if (!value || typeof value !== "object") return false
  const data = value as Partial<RateData>
  return (
    !!data.rates &&
    typeof data.rates === "object" &&
    !Array.isArray(data.rates) &&
    Object.values(data.rates).every(
      (rate) => typeof rate === "number" && Number.isFinite(rate) && rate > 0
    ) &&
    data.rates.USD === 1 &&
    Array.isArray(data.currencies) &&
    data.currencies.length > 0 &&
    data.currencies.every(
      (currency) =>
        currency &&
        typeof currency.code === "string" &&
        /^[A-Z]{3}$/.test(currency.code) &&
        typeof currency.name === "string" &&
        typeof currency.symbol === "string" &&
        (currency.flag === undefined ||
          (typeof currency.flag === "string" &&
            /^(?:[a-z]{2})?$/.test(currency.flag))) &&
        data.rates?.[currency.code] !== undefined
    ) &&
    typeof data.refreshedAt === "string" &&
    !Number.isNaN(Date.parse(data.refreshedAt)) &&
    (data.rateDate === undefined ||
      (typeof data.rateDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(data.rateDate) &&
        !Number.isNaN(Date.parse(data.rateDate))))
  )
}
