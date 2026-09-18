import type { Currency, Settings } from "@/types/currency"
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
    <div className="amount-wrap">
      <span className="amount-symbol">{currency.symbol}</span>

      {role === "source" ? (
        <span className="input-holder">
          <span className="amount-number input-sizer" aria-hidden="true">
            {amount || "0.00"}
          </span>
          <input
            className="amount-number"
            inputMode="decimal"
            value={amount ?? ""}
            onChange={(event) =>
              onChange?.(normalizeAmount(event.target.value))
            }
            placeholder="0.00"
            aria-label={`Amount in ${currency.code}`}
          />
          <span className="persistent-caret" aria-hidden="true" />
        </span>
      ) : (
        <output
          className="amount-number"
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
