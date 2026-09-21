import type { Currency, Settings } from "@/types/currency"
import { cn } from "@/lib/utils"
import { formatAmount, normalizeAmount } from "@/utils/currency"

type CurrencyAmountProps = {
  currency: Currency
  role: "source" | "target"
  amount?: string
  converted?: number
  settings: Settings
  onChange?: (value: string) => void
}

export function CurrencyAmount({
  currency,
  role,
  amount,
  converted,
  settings,
  onChange,
}: CurrencyAmountProps) {
  return (
    <div className="flex w-full min-w-0 items-end justify-end gap-2 overflow-visible">
      <span
        className={cn(
          "shrink-0 text-[clamp(26px,4.2vw,66px)] leading-none font-[var(--font-amount),monospace] text-emerald-600 max-[760px]:text-[clamp(15px,4.5vw,31px)] max-[360px]:text-[15px] dark:text-emerald-300",
          role === "target" && "text-white/50"
        )}
      >
        {currency.symbol}
      </span>

      {role === "source" ? (
        <span className="flex min-w-0 items-center gap-1">
          <input
            className="peer block max-w-full min-w-0 flex-[0_1_auto] border-0 bg-red-200 text-center text-[clamp(52px,8.4vw,132px)] leading-0 font-[var(--font-amount),monospace] tracking-tighter text-slate-900 tabular-nums caret-transparent outline-none placeholder:text-slate-500 focus-visible:outline-none max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-white dark:placeholder:text-slate-400"
            style={{ width: `${amount ? Math.max(amount.length, 1) : 4}ch` }}
            inputMode="decimal"
            value={amount ?? ""}
            onChange={(event) =>
              onChange?.(normalizeAmount(event.target.value))
            }
            placeholder="0.00"
            aria-label={`Amount in ${currency.code}`}
          />
          <span
            className="amount-caret h-[clamp(32px,6.4vw,96px)] w-1.5 shrink-0 rounded-full bg-rose-500 opacity-0 peer-focus:opacity-100 max-[760px]:h-[clamp(23px,7vw,48px)]"
            aria-hidden="true"
          />
        </span>
      ) : (
        <output
          className="block w-max max-w-full flex-[0_1_auto] overflow-visible bg-red-400 pr-2.5 text-right text-[clamp(52px,8.4vw,132px)] leading-none font-normal tracking-[-0.075em] whitespace-nowrap text-white tabular-nums max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-white"
          aria-label={`Converted amount in ${currency.code}`}
        >
          {converted !== undefined && Number.isFinite(converted)
            ? formatAmount(converted, currency.code, settings)
            : "0.00"}
        </output>
      )}
    </div>
  )
}
