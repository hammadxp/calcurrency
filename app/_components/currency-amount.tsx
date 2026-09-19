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
    <div className="flex w-full min-w-0 items-end justify-end gap-[0.08em] overflow-visible max-[760px]:gap-[0.08em]">
      <span
        className={cn(
          "shrink-0 self-end pb-[0.08em] text-[clamp(52px,8.4vw,132px)] leading-none font-[var(--font-amount),monospace] font-normal text-emerald-600 max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-emerald-300",
          role === "target" && "text-emerald-100"
        )}
      >
        {currency.symbol}
      </span>

      {role === "source" ? (
        <span className="relative inline-grid w-max max-w-full min-w-0 flex-[0_1_auto] overflow-visible max-[760px]:w-auto max-[760px]:max-w-[calc(100%-30px)] max-[760px]:flex-[1_1_auto]">
          <span
            className="invisible block max-w-full pr-[0.2em] text-right text-[clamp(52px,8.4vw,132px)] leading-none font-[var(--font-amount),monospace] font-normal tracking-[-0.075em] whitespace-nowrap tabular-nums max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px]"
            aria-hidden="true"
          >
            {amount || "0.00"}
          </span>
          <input
            className="absolute inset-0 block size-full max-w-full bg-transparent p-0 pr-[0.2em] text-right text-[clamp(52px,8.4vw,132px)] leading-none font-[var(--font-amount),monospace] font-normal tracking-[-0.075em] text-slate-900 tabular-nums caret-transparent outline-none placeholder:text-slate-300 focus-visible:outline-none max-[760px]:text-[clamp(29px,9vw,62px)] max-[360px]:text-[29px] dark:text-white dark:placeholder:text-emerald-200"
            inputMode="decimal"
            value={amount ?? ""}
            onChange={(event) =>
              onChange?.(normalizeAmount(event.target.value))
            }
            placeholder="0.00"
            aria-label={`Amount in ${currency.code}`}
          />
          <span
            className="pointer-events-none absolute top-[6%] right-px h-[88%] w-[3px] animate-pulse bg-rose-500"
            aria-hidden="true"
          />
        </span>
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
