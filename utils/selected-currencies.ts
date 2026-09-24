import type { CurrencyColor, SelectedCurrency } from "../types/currency"

export const DEFAULT_SELECTED: SelectedCurrency[] = [
  { code: "USD", color: "mint" },
  { code: "EUR", color: "paper" },
]

const COLORS: CurrencyColor[] = [
  "mint",
  "paper",
  "sky",
  "peach",
  "lilac",
  "lemon",
]

export function readSelected(value: string | null): SelectedCurrency[] {
  if (value) {
    try {
      const parsed: unknown = JSON.parse(value)
      if (Array.isArray(parsed)) {
        const seen = new Set<string>()
        return parsed.filter((item): item is SelectedCurrency => {
          if (!item || typeof item !== "object") return false
          const { code, color } = item as Partial<SelectedCurrency>
          if (
            typeof code !== "string" ||
            !/^[A-Z]{3}$/.test(code) ||
            seen.has(code) ||
            typeof color !== "string" ||
            !COLORS.includes(color as CurrencyColor)
          )
            return false
          seen.add(code)
          return true
        })
      }

      // Existing pair preferences keep their original order.
      if (parsed && typeof parsed === "object") {
        const pair = parsed as { from?: unknown; to?: unknown }
        const codes = [pair.from, pair.to].filter(
          (code): code is string =>
            typeof code === "string" && /^[A-Z]{3}$/.test(code)
        )
        if (codes.length) {
          return [...new Set(codes)].map((code, index) => ({
            code,
            color: index === 0 ? "mint" : "paper",
          }))
        }
      }
    } catch {
      /* Ignore invalid saved data. */
    }
  }
  return DEFAULT_SELECTED
}

export function moveSelectedCurrency(
  selected: SelectedCurrency[],
  from: number,
  to: number
) {
  if (
    from < 0 ||
    to < 0 ||
    from >= selected.length ||
    to >= selected.length ||
    from === to
  )
    return selected
  const next = [...selected]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
