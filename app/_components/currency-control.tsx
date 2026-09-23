import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type CurrencyControlProps = {
  currency: Currency | null
  role: "source" | "target"
  from?: Currency | null
  pairRate?: number
  onOpen: () => void
}

export function CurrencyControl({
  currency,
  role,
  from,
  pairRate,
  onOpen,
}: CurrencyControlProps) {
  return (
    <div className="flex min-w-0 shrink-0 flex-col items-start gap-1.5 md:gap-4.25">
      <button
        type="button"
        className={cn(
          "inline-flex w-21.5 items-center justify-between gap-2 rounded-[7px] border border-transparent bg-stone-100 px-3.25 py-2.75 font-extrabold whitespace-nowrap text-slate-900 transition duration-200 hover:bg-emerald-100 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100",
          role === "target" &&
            "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
          !currency && "w-auto px-3.5 py-3 md:px-5 md:py-4"
        )}
        onClick={onOpen}
        aria-label={`Choose ${role} currency`}
      >
        <span className="text-[13px] leading-none tracking-[0.02em] md:text-lg">
          {currency?.code ?? "Select currency"}
        </span>
        <ChevronDown size={17} />
      </button>

      {currency ? (
        <div className="flex min-w-0 flex-col items-start gap-1.5 md:gap-2.5">
          <FlagIcon currency={currency} />
          <span
            className={cn(
              "max-w-52 truncate text-[11px] leading-tight font-semibold md:text-[clamp(12px,1vw,15px)]"
            )}
          >
            {currency.name}
          </span>
        </div>
      ) : null}

      {role === "target" && currency && from ? (
        <div className="flex w-full min-w-0 items-center gap-1.75 text-left text-[10px] leading-[1.35] font-medium whitespace-normal md:gap-2 md:text-sm">
          <span className="opacity-80 md:whitespace-nowrap">
            1 {from.code} equals
          </span>
          <strong className="font-extrabold">
            {formatRate(pairRate ?? 0)} {currency.code}
          </strong>
        </div>
      ) : null}
    </div>
  )
}
