import Image from "next/image"
import { Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Currency } from "@/types/currency"

type FlagIconProps = { currency: Currency; size?: "small" | "medium" }

export function FlagIcon({ currency, size = "medium" }: FlagIconProps) {
  return currency.flag ? (
    <Image
      className={cn(
        "block shrink-0 rounded-md object-cover shadow-[0_2px_8px_rgb(15_23_42/18%)]",
        size === "small"
          ? "h-5 w-7 rounded-[4px]"
          : "h-11.5 w-21.5 max-w-21.5 max-[760px]:h-9"
      )}
      src={`https://flagcdn.com/w320/${currency.flag}.png`}
      width={320}
      height={240}
      alt=""
      aria-hidden="true"
    />
  ) : (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded bg-emerald-100 text-emerald-600",
        size === "small"
          ? "h-5 w-7 rounded-lg"
          : "h-11.5 w-21.5 max-[760px]:h-9"
      )}
      aria-hidden="true"
    >
      <Globe2 size={19} />
    </span>
  )
}
