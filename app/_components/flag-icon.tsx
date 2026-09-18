import Image from "next/image"
import { Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Currency } from "@/types/currency"

type FlagIconProps = { currency: Currency; size?: "small" | "medium" }

export function FlagIcon({ currency, size = "medium" }: FlagIconProps) {
  return currency.flag ? (
    <Image
      className={cn(
        "flag-image",
        size === "small" ? "flag-image-small" : "flag-image-medium"
      )}
      src={`https://flagcdn.com/w80/${currency.flag}.png`}
      width={80}
      height={60}
      alt=""
      aria-hidden="true"
    />
  ) : (
    <span
      className={cn(
        "flag-placeholder",
        size === "small" ? "flag-image-small" : "flag-image-medium"
      )}
      aria-hidden="true"
    >
      <Globe2 size={19} />
    </span>
  )
}
