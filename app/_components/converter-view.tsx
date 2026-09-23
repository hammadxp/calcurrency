import { CurrencyPanel } from "./currency-panel"
import { MobileKeypad } from "./mobile-keypad"
import type { Currency, Settings } from "@/types/currency"

type ConverterViewProps = {
  from: Currency | null
  to: Currency | null
  amount: string
  converted: number
  pairRate: number
  loading: boolean
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
  loading,
  settings,
  onAmountChange,
  onOpenFrom,
  onOpenTo,
  onKey,
}: ConverterViewProps) {
  return (
    <section
      className="grid h-[calc(100svh-58px)] min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden md:flex md:h-[calc(100svh-70px)] md:flex-col"
      aria-label="Currency converter"
    >
      <div className="grid h-full min-h-0 w-full flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] self-center">
        <CurrencyPanel
          currency={from}
          loading={loading}
          role="source"
          amount={amount}
          settings={settings}
          onOpen={onOpenFrom}
          onChange={onAmountChange}
        />

        <CurrencyPanel
          currency={to}
          loading={loading}
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
