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
    <div className="flex min-w-0 flex-col items-start gap-4.25 max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:gap-x-3 max-[760px]:gap-y-2.5">
      <button
        type="button"
        className={cn(
          "inline-flex w-21.5 items-center justify-between gap-2 rounded-[7px] border border-transparent bg-stone-100 px-3.25 py-2.75 font-extrabold whitespace-nowrap text-slate-900 transition duration-200 hover:bg-emerald-100 focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-rose-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
          role === "target" &&
            "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
          !currency && "w-auto px-5 py-4 max-[760px]:px-3.5 max-[760px]:py-3"
        )}
        onClick={onOpen}
        aria-label={`Choose ${role} currency`}
      >
        <span className="text-lg leading-none tracking-[0.02em] max-[760px]:text-[13px]">
          {currency?.code ?? "Select currency"}
        </span>
        <ChevronDown size={17} />
      </button>

      {currency ? (
        <div className="flex min-w-0 flex-col items-start gap-2.5 max-[760px]:flex-row max-[760px]:items-center max-[760px]:gap-1.75">
          <FlagIcon currency={currency} />
          <span
            className={cn(
              "mt-1 max-w-52 truncate text-[clamp(12px,1vw,15px)] leading-tight font-semibold max-[760px]:text-[11px] max-[360px]:max-w-21.75"
            )}
          >
            {currency.name}
          </span>
        </div>
      ) : null}

      {role === "target" && currency && from ? (
        <div className="flex min-w-0 items-center gap-2 text-left text-[clamp(11px,1vw,14px)] leading-[1.35] font-medium max-[760px]:w-full max-[760px]:gap-1.75 max-[760px]:text-[10px] max-[760px]:whitespace-normal">
          <span className="whitespace-nowrap opacity-80 max-[760px]:whitespace-normal">
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
