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
    <div className="flex w-full min-w-0 items-end justify-end gap-1 overflow-visible">
      <span
        className={cn(
          "shrink-0 self-end pb-[0.08em] text-[clamp(52px,8.4vw,132px)] leading-none font-[var(--font-amount),monospace] font-normal text-emerald-600 max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-emerald-300",
          role === "target" && "text-white dark:text-white"
        )}
      >
        {currency.symbol}
      </span>

      {role === "source" ? (
        <input
          className="block max-w-full min-w-0 flex-[0_1_auto] border-0 bg-transparent p-0 text-right text-[clamp(52px,8.4vw,132px)] leading-none font-[var(--font-amount),monospace] font-normal tracking-[-0.075em] text-slate-900 tabular-nums caret-rose-500 outline-none placeholder:text-slate-500 focus-visible:outline-none max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-white dark:placeholder:text-slate-400"
          style={{ width: `${Math.max(amount?.length ?? 0, 4)}ch` }}
          inputMode="decimal"
          value={amount ?? ""}
          onChange={(event) => onChange?.(normalizeAmount(event.target.value))}
          placeholder="0.00"
          aria-label={`Amount in ${currency.code}`}
        />
      ) : (
        <output
          className="block w-max max-w-full flex-[0_1_auto] overflow-visible text-right text-[clamp(52px,8.4vw,132px)] leading-none font-[var(--font-amount),monospace] font-normal tracking-[-0.075em] whitespace-nowrap text-slate-900 tabular-nums max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-white"
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
