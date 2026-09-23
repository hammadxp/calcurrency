import type { RateData, Settings } from "@/types/currency"

export function formatAmount(
  value: number,
  code: string,
  settings: Settings,
  maximumFractionDigits?: number,
  locale = "en-US"
) {
  if (!Number.isFinite(value)) return "—"
  const decimals = settings.decimals
    ? (maximumFractionDigits ?? (["JPY", "KRW"].includes(code) ? 0 : 2))
    : 0
  return new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
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

export function formatRelativeTimestamp(value: string, now = new Date()) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "recently"

  const elapsedSeconds = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 1_000)
  )

  if (elapsedSeconds < 60) return "Just now"

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  if (elapsedMinutes < 60)
    return elapsedMinutes === 1
      ? "a minute ago"
      : `${elapsedMinutes} minutes ago`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24)
    return elapsedHours === 1 ? "an hour ago" : `${elapsedHours} hours ago`

  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays < 7)
    return elapsedDays === 1 ? "a day ago" : `${elapsedDays} days ago`

  const elapsedWeeks = Math.floor(elapsedDays / 7)
  if (elapsedWeeks < 5)
    return elapsedWeeks === 1 ? "a week ago" : `${elapsedWeeks} weeks ago`

  const elapsedMonths = Math.floor(elapsedDays / 30)
  if (elapsedMonths < 12)
    return elapsedMonths === 1 ? "a month ago" : `${elapsedMonths} months ago`

  const elapsedYears = Math.floor(elapsedDays / 365)
  return elapsedYears === 1 ? "a year ago" : `${elapsedYears} years ago`
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

type AmountLocale = {
  group: string
  decimal: string
  integerFormatter: Intl.NumberFormat
}

const amountLocales = new Map<string, AmountLocale>()

export function amountSeparators(locale: string) {
  const cached = amountLocales.get(locale)
  if (cached) return cached

  const integerFormatter = new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
    maximumFractionDigits: 0,
  })
  const parts = new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
  }).formatToParts(1234.5)
  const next = {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    integerFormatter,
  }
  amountLocales.set(locale, next)
  return next
}

export function formatEditableAmount(value: string, locale: string) {
  if (!value) return ""
  const { decimal, integerFormatter } = amountSeparators(locale)
  const [integer, fraction] = value.split(".")
  const leadingZeros = integer.match(/^0+/)?.[0] ?? ""
  const significant = integer.slice(leadingZeros.length)
  const grouped = significant
    ? leadingZeros + integerFormatter.format(BigInt(significant))
    : integer
  return fraction === undefined ? grouped : `${grouped}${decimal}${fraction}`
}

export function parseEditableAmount(value: string, locale: string) {
  const { group, decimal } = amountSeparators(locale)
  const ungrouped = value.split(group).join("")
  return normalizeAmount(ungrouped.replace(decimal, "."))
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
