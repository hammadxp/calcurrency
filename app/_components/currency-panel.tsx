import { CurrencyAmount } from "./currency-amount"
import { CurrencyControl } from "./currency-control"
import { cn } from "@/lib/utils"
import type { Currency, Settings } from "@/types/currency"

type CurrencyPanelProps = {
  currency: Currency | null
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
        "currency-panel",
        role === "source" ? "source-panel" : "target-panel"
      )}
    >
      <div className="panel-main">
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
      </div>
    </article>
  )
}
