import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type RateRowProps = {
  currency: Currency
  rate: number
}

export function RateRow({ currency, rate }: RateRowProps) {
  return (
    <div className="grid min-h-[66px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-stone-200 px-3.5 py-3 text-base transition-colors hover:bg-stone-50 md:grid-cols-[minmax(200px,1fr)_auto] md:gap-5 dark:border-neutral-800 dark:hover:bg-neutral-900">
      <span className="flex items-center gap-3">
        <FlagIcon currency={currency} size="small" />
        <span className="flex flex-col gap-1">
          <strong className="text-sm md:text-base">{currency.code}</strong>
          <small className="text-xs text-slate-500 md:text-[13px] dark:text-neutral-300">
            {currency.name}
          </small>
        </span>
      </span>
      <span className="text-right text-sm font-[var(--font-amount),monospace] font-bold tabular-nums md:text-base">
        {formatRate(rate)}
      </span>
    </div>
  )
}
