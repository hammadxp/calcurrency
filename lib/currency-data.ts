import type { Currency } from "@/lib/currency"

export const FALLBACK_CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "us" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "eu" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "gb" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "jp" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "au" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "ca" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "ch" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "cn" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "in" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "sg" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "nz" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "se" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "no" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "br" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "za" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "ae" },
]

export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.8618,
  GBP: 0.7431,
  JPY: 146.44,
  AUD: 1.521,
  CAD: 1.374,
  CHF: 0.806,
  CNY: 7.177,
  INR: 87.54,
  SGD: 1.281,
  NZD: 1.753,
  SEK: 9.497,
  NOK: 10.103,
  BRL: 5.43,
  ZAR: 17.56,
  AED: 3.6725,
}

export const FLAG_OVERRIDES: Record<string, string> = {
  EUR: "eu",
  GBP: "gb",
  CHF: "ch",
  CNY: "cn",
  AED: "ae",
  XOF: "",
  XAF: "",
  XCD: "",
  XPF: "",
  XDR: "",
  ANG: "cw",
  BOV: "bo",
  CLF: "cl",
  CNH: "cn",
  MRU: "mr",
  SLE: "sl",
  SSP: "ss",
  STN: "st",
  VED: "ve",
  ZWG: "zw",
}

export const KEYPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "delete",
] as const

export const SETTING_ITEMS = [
  {
    key: "decimals",
    title: "Show decimal precision",
    detail: "Keep two decimal places on converted values.",
  },
  {
    key: "compact",
    title: "Compact numbers",
    detail: "Use 1.2K instead of 1,200 on larger values.",
  },
  {
    key: "remember",
    title: "Remember my last amount",
    detail: "Save your last typed value to this browser only.",
  },
] as const
