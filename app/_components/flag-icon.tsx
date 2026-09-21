import Image from "next/image"
import { Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Currency } from "@/types/currency"

type FlagIconProps = { currency: Currency; size?: "small" | "medium" }

export function FlagIcon({ currency, size = "medium" }: FlagIconProps) {
  return currency.flag ? (
    <Image
      className={cn(
        "block shrink-0 rounded-md object-cover shadow-[0_2px_8px_rgb(15_23_42_/_18%)]",
        size === "small"
          ? "h-[18px] w-auto max-w-6 max-[760px]:h-[18px]"
          : "h-[46px] w-[86px] max-w-[86px] max-[760px]:h-[34px] max-[760px]:w-16 max-[760px]:max-w-16"
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
          ? "h-[18px] w-6"
          : "h-[46px] w-[86px] max-[760px]:h-[34px] max-[760px]:w-16"
      )}
      aria-hidden="true"
    >
      <Globe2 size={19} />
    </span>
  )
}
