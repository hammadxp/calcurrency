import { Globe2 } from "lucide-react"
import type { Currency } from "@/lib/currency"

type FlagIconProps = { currency: Currency; size?: "small" | "medium" }

export function FlagIcon({ currency, size = "medium" }: FlagIconProps) {
  return currency.flag ? (
    // Flag URLs come from the app's fixed currency codes and overrides.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`flag-image flag-image-${size}`}
      src={`https://flagcdn.com/w80/${currency.flag}.png`}
      alt=""
      aria-hidden="true"
    />
  ) : (
    <span className={`flag-placeholder flag-image-${size}`} aria-hidden="true">
      <Globe2 size={19} />
    </span>
  )
}
