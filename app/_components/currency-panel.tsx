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
        "flex min-h-0 flex-col justify-center p-[clamp(28px,5vh,64px)_clamp(24px,6vw,100px)_clamp(24px,4vh,48px)] max-md:p-[11px_16px] max-sm:px-2.5",
        role === "source"
          ? "bg-emerald-600 text-emerald-50 dark:bg-emerald-800"
          : "bg-stone-50 text-slate-800 dark:bg-slate-900"
      )}
    >
      <div
        className={cn(
          "grid min-h-0 w-full grid-cols-[minmax(200px,30%)_minmax(0,1fr)] items-center gap-[clamp(22px,5vw,90px)] max-[760px]:flex max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:justify-center max-[760px]:gap-3",
          !currency && "flex justify-center"
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
