import { FlagIcon } from "./flag-icon"
import type { Currency } from "@/types/currency"
import { formatRate } from "@/utils/currency"

type RateRowProps = {
  currency: Currency
  rate: number
}

export function RateRow({ currency, rate }: RateRowProps) {
  return (
    <div className="rate-row">
      <span className="table-identity">
        <FlagIcon currency={currency} size="small" />
        <span className="table-currency">
          <strong>{currency.code}</strong>
          <small>{currency.name}</small>
        </span>
      </span>
      <span className="table-value">{formatRate(rate)}</span>
    </div>
  )
}
