import type { CurrencyColor, Settings } from "@/types/currency"

export const DEFAULT_SETTINGS: Settings = {
  decimals: true,
  compact: false,
  remember: true,
  showDonate: true,
}

export const KEYPAD_KEYS = [
  "clear",
  "hide",
  "%",
  "÷",
  "7",
  "8",
  "9",
  "×",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "delete",
  "=",
] as const

export const CURRENCY_COLORS: {
  value: CurrencyColor
  label: string
  className: string
  textClassName: string
}[] = [
  {
    value: "mint",
    label: "Mint",
    className: "bg-currency-mint",
    textClassName: "text-currency-mint",
  },
  {
    value: "paper",
    label: "Paper",
    className: "bg-currency-paper",
    textClassName: "text-currency-paper",
  },
  {
    value: "sky",
    label: "Sky",
    className: "bg-currency-sky",
    textClassName: "text-currency-sky",
  },
  {
    value: "peach",
    label: "Peach",
    className: "bg-currency-peach",
    textClassName: "text-currency-peach",
  },
  {
    value: "lilac",
    label: "Lilac",
    className: "bg-currency-lilac",
    textClassName: "text-currency-lilac",
  },
  {
    value: "lemon",
    label: "Lemon",
    className: "bg-currency-lemon",
    textClassName: "text-currency-lemon",
  },
]
