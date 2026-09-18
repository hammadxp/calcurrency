import { ArrowLeft } from "lucide-react"
import { RateRow } from "@/components/converter/rate-row"
import { formatRate, type Currency } from "@/lib/currency"

type RatesViewProps = {
  from: Currency | null
  to: Currency | null
  pairRate: number
  rates: Record<string, number>
  currencies: Currency[]
  onBack: () => void
}

export function RatesView({
  from,
  to,
  pairRate,
  rates,
  currencies,
  onBack,
}: RatesViewProps) {
  return (
    <section className="detail-view">
      <div className="detail-topline">
        <button type="button" className="back-button" onClick={onBack}>
          <ArrowLeft size={16} /> Converter
        </button>
        <span>Reference rates · USD base</span>
      </div>
      <div className="detail-heading">
        <h1>Exchange rates</h1>
        <p className="detail-intro">
          Compare indicative rates before sending money.
        </p>
      </div>
      <div className="pair-strip">
        <span>Your selected pair</span>
        <strong>
          {from?.code ?? "—"} / {to?.code ?? "—"}
        </strong>
        <span>
          1 {from?.code ?? "—"} equals {formatRate(pairRate)} {to?.code ?? "—"}
        </span>
      </div>
      <div className="table-header">
        <div>
          <h2>Currencies</h2>
        </div>
        <span>1 USD buys</span>
      </div>
      <div className="rate-table">
        {currencies.map((currency) => (
          <RateRow
            key={currency.code}
            currency={currency}
            rate={rates[currency.code]}
          />
        ))}
      </div>
    </section>
  )
}
