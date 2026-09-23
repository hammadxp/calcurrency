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
          "shrink-0 bg-red-200 text-[15px] leading-none font-[var(--font-amount),monospace] sm:text-[clamp(15px,4.5vw,31px)] md:text-[clamp(26px,4.2vw,66px)]",
          role === "target" && "text-white/50"
        )}
      >
        {currency.symbol}
      </span>

      {role === "source" ? (
        <span className="flex min-w-0 items-center">
          <input
            className="peer bg-red-200 text-center text-[29px] leading-none tracking-tighter text-slate-900 caret-transparent outline-none placeholder:text-slate-500 focus-visible:outline-none sm:text-[clamp(29px,9vw,62px)] md:text-[clamp(52px,8.4vw,132px)] dark:text-white dark:placeholder:text-slate-400"
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
            className="amount-caret h-[clamp(23px,7vw,48px)] w-1.5 shrink-0 rounded-full bg-rose-500 opacity-0 peer-focus:opacity-100 md:h-[clamp(32px,6.4vw,96px)]"
            aria-hidden="true"
          />
        </span>
      ) : (
        <output
          className="mr-3 bg-blue-200 text-center text-[29px] leading-none tracking-tighter sm:text-[clamp(29px,9vw,62px)] md:text-[clamp(52px,8.4vw,132px)]"
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
