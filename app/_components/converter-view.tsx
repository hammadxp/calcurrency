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
    <section
      className="flex h-[calc(100svh-70px)] min-h-0 flex-col overflow-hidden max-[760px]:grid max-[760px]:h-[calc(100svh-58px)] max-[760px]:grid-rows-[minmax(0,1fr)_auto]"
      aria-label="Currency converter"
    >
      <div className="grid h-full min-h-0 w-full flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] self-center">
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
