import type { Settings } from "@/types/currency"

export const DEFAULT_SETTINGS: Settings = {
  decimals: true,
  compact: false,
  remember: true,
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
