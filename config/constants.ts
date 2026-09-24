import type { CurrencyColor, Settings } from "@/types/currency"

export const DEFAULT_SETTINGS: Settings = {
  decimals: true,
  compact: false,
  remember: true,
  showDonate: true,
}

export const KEYPAD_KEYS = [
  "clear",
  "÷",
  "×",
  "delete",
  "7",
  "8",
  "9",
  "-",
  "4",
  "5",
  "6",
  "+",
  "1",
  "2",
  "3",
  "%",
  "0",
  ".",
  "=",
] as const

export const CURRENCY_COLORS: {
  value: CurrencyColor
  label: string
  className: string
}[] = [
  { value: "mint", label: "Mint", className: "bg-currency-mint" },
  { value: "paper", label: "Paper", className: "bg-currency-paper" },
  { value: "sky", label: "Sky", className: "bg-currency-sky" },
  { value: "peach", label: "Peach", className: "bg-currency-peach" },
  { value: "lilac", label: "Lilac", className: "bg-currency-lilac" },
  { value: "lemon", label: "Lemon", className: "bg-currency-lemon" },
]
