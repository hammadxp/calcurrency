import { FlagIcon } from "@/components/converter/flag-icon"
import { formatRate, type Currency } from "@/lib/currency"

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
