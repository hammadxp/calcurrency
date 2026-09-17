export type Currency = {
  code: string
  name: string
  symbol: string
  flag?: string
}
export type Slot = "from" | "to"
export type View = "convert" | "rates" | "settings"
export type Settings = {
  decimals: boolean
  compact: boolean
  remember: boolean
}
export type RateData = {
  rates: Record<string, number>
  currencies: Currency[]
  refreshedAt: string
}

export const DEFAULT_SETTINGS: Settings = {
  decimals: true,
  compact: false,
  remember: true,
}

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
    !!data.rates.USD &&
    Array.isArray(data.currencies) &&
    data.currencies.length > 0 &&
    data.currencies.every(
      (currency) =>
        currency &&
        typeof currency.code === "string" &&
        typeof currency.name === "string" &&
        typeof currency.symbol === "string" &&
        data.rates?.[currency.code] !== undefined
    ) &&
    typeof data.refreshedAt === "string" &&
    !Number.isNaN(Date.parse(data.refreshedAt))
  )
}
