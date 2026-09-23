import { CurrencyAmount } from "./currency-amount"
import { CurrencyControl } from "./currency-control"
import { CurrencyPanelSkeleton } from "./currency-panel-skeleton"
import { cn } from "@/lib/utils"
import type { Currency, Settings } from "@/types/currency"

type CurrencyPanelProps = {
  currency: Currency | null
  loading: boolean
  role: "source" | "target"
  amount?: string
  converted?: number
  from?: Currency | null
  pairRate?: number
  settings: Settings
  onOpen: () => void
  onChange?: (value: string) => void
}

export function CurrencyPanel({
  currency,
  loading,
  role,
  amount,
  converted,
  from,
  pairRate,
  settings,
  onOpen,
  onChange,
}: CurrencyPanelProps) {
  return (
    <article
      className={cn(
        "flex min-h-0 flex-col justify-center p-[11px_16px] px-2.5 sm:px-4 md:p-[clamp(28px,5vh,64px)_clamp(24px,6vw,100px)_clamp(24px,4vh,48px)]",
        role === "source"
          ? "bg-emerald-600 text-emerald-50 dark:bg-emerald-800"
          : "bg-stone-50 text-slate-800 dark:bg-slate-900"
      )}
    >
      <div
        className={cn(
          "flex min-h-0 w-full flex-col items-stretch justify-center gap-3 min-[760px]:grid min-[760px]:grid-cols-[minmax(200px,30%)_minmax(0,1fr)] min-[760px]:items-center min-[760px]:gap-[clamp(22px,5vw,90px)]",
          !currency && "min-[760px]:flex"
        )}
      >
        {loading ? (
          <CurrencyPanelSkeleton role={role} />
        ) : (
          <>
            <CurrencyControl
              currency={currency}
              role={role}
              from={from}
              pairRate={pairRate}
              onOpen={onOpen}
            />

            {currency ? (
              <CurrencyAmount
                currency={currency}
                role={role}
                amount={amount}
                converted={converted}
                settings={settings}
                onChange={onChange}
              />
            ) : null}
          </>
        )}
      </div>
    </article>
  )
}
