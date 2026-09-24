export type Currency = {
  code: string
  name: string
  symbol: string
  flag?: string
}

export type CurrencyColor =
  "mint" | "paper" | "sky" | "peach" | "lilac" | "lemon"
export type SelectedCurrency = { code: string; color: CurrencyColor }
export type View = "convert" | "rates" | "settings"

export type Settings = {
  decimals: boolean
  compact: boolean
  remember: boolean
  showDonate: boolean
}

export type RateData = {
  rates: Record<string, number>
  currencies: Currency[]
  refreshedAt: string
  rateDate?: string
}
