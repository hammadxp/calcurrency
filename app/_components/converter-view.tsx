import { CurrencyPanel } from "./currency-panel"
import { MobileKeypad } from "./mobile-keypad"
import type { Currency, Settings } from "@/types/currency"

type ConverterViewProps = {
  from: Currency | null
  to: Currency | null
  amount: string
  converted: number
  pairRate: number
  settings: Settings
  onAmountChange: (value: string) => void
  onOpenFrom: () => void
  onOpenTo: () => void
  onKey: (key: string) => void
}

export function ConverterView({
  from,
  to,
  amount,
  converted,
  pairRate,
  settings,
  onAmountChange,
  onOpenFrom,
  onOpenTo,
  onKey,
}: ConverterViewProps) {
  return (
    <section className="converter-view" aria-label="Currency converter">
      <div className="currency-stack">
        <CurrencyPanel
          currency={from}
          role="source"
          amount={amount}
          settings={settings}
          onOpen={onOpenFrom}
          onChange={onAmountChange}
        />

        <CurrencyPanel
          currency={to}
          role="target"
          converted={converted}
          from={from}
          pairRate={pairRate}
          settings={settings}
          onOpen={onOpenTo}
        />
      </div>

      <MobileKeypad onKey={onKey} />
    </section>
  )
}
