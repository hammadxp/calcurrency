import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type RateRowProps = {
  currency: Currency
  rate: number
}

export function RateRow({ currency, rate }: RateRowProps) {
  return (
    <div className="grid min-h-[66px] grid-cols-[minmax(200px,1fr)_auto] items-center gap-5 border-b border-stone-200 px-3.5 py-3 text-base transition-colors hover:bg-stone-50 max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-2 dark:border-slate-800 dark:hover:bg-slate-900">
      <span className="flex items-center gap-3">
        <FlagIcon currency={currency} size="small" />
        <span className="flex flex-col gap-1">
          <strong className="text-base max-md:text-sm">{currency.code}</strong>
          <small className="text-[13px] text-slate-500 max-md:text-xs dark:text-slate-300">
            {currency.name}
          </small>
        </span>
      </span>
      <span className="text-right text-base font-[var(--font-amount),monospace] font-bold tabular-nums max-md:text-sm">
        {formatRate(rate)}
      </span>
    </div>
  )
}
