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
  keepAmountFocus?: boolean
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
  keepAmountFocus,
  onOpen,
  onChange,
}: CurrencyPanelProps) {
  return (
    <article
      className={cn(
        "flex min-w-0 overflow-hidden p-[11px_16px] px-3.5 sm:px-4 md:p-[clamp(28px,5vh,64px)_clamp(24px,6vw,100px)_clamp(24px,4vh,48px)]",
        role === "source"
          ? "bg-accent text-accent-foreground"
          : "bg-background text-foreground"
      )}
    >
      <div className="flex min-h-0 w-full items-center gap-1.5 md:gap-3">
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
                keepAmountFocus={keepAmountFocus}
                onChange={onChange}
              />
            ) : null}
          </>
        )}
      </div>
    </article>
  )
}
