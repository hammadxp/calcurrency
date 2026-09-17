import { ChevronDown } from "lucide-react"
import { FlagIcon } from "@/components/converter/flag-icon"
import {
  formatAmount,
  formatRate,
  normalizeAmount,
  type Currency,
  type Settings,
} from "@/lib/currency"

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
  const isSource = role === "source"

  return (
    <article
      className={`currency-panel ${isSource ? "source-panel" : "target-panel"}`}
    >
      <div className="panel-main">
        <div
          className={`currency-control ${currency ? "" : "currency-control-empty"}`}
        >
          <button
            type="button"
            className="currency-trigger"
            onClick={onOpen}
            aria-label={`Choose ${role} currency`}
          >
            <span className="currency-code">
              {currency?.code ?? "Select currency"}
            </span>
            <ChevronDown size={17} />
          </button>
          {currency ? (
            <div className="currency-identity">
              <FlagIcon currency={currency} />
              <span>{currency.name}</span>
            </div>
          ) : null}
          {!isSource && currency && from ? (
            <div className="rate-summary-inline">
              <span>
                1 {from.code} equals{" "}
                <strong>
                  {formatRate(pairRate ?? 0)} {currency.code}
                </strong>
              </span>
            </div>
          ) : null}
        </div>
        {currency ? (
          <div className="amount-wrap">
            <span className="amount-symbol">{currency.symbol}</span>
            {isSource ? (
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
        ) : null}
      </div>
    </article>
  )
}
